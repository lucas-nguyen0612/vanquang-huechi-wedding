-- ============================================================
-- 00008_apply_review_fixes.sql
-- Applies review fixes to existing tables (incremental ALTERs)
-- All tables already exist from 00001-00007
-- ============================================================

-- ============================================================
-- 00001 profiles fixes:
-- - Add CHECK for total_xp >= 0
-- - Add CHECK for current_level 1-20
-- - Add CHECK for avatar_url length
-- - Search_path already fixed in 00001 trigger
-- ============================================================

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_total_xp_positive,
  ADD CONSTRAINT profiles_total_xp_positive CHECK (total_xp >= 0);

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_current_level_range,
  ADD CONSTRAINT profiles_current_level_range CHECK (current_level BETWEEN 1 AND 20);

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_avatar_url_length,
  ADD CONSTRAINT profiles_avatar_url_length
    CHECK (avatar_url IS NULL OR char_length(avatar_url) <= 2048);

-- ============================================================
-- 00002 pomo_sessions fixes:
-- - Add CHECK planned_duration > 0
-- - Add CHECK actual_duration >= 0
-- - Add CHECK no_completed_at_when_active
-- ============================================================

ALTER TABLE public.pomo_sessions
  DROP CONSTRAINT IF EXISTS planned_duration_positive,
  ADD CONSTRAINT planned_duration_positive CHECK (planned_duration > 0);

ALTER TABLE public.pomo_sessions
  DROP CONSTRAINT IF EXISTS actual_duration_nonnegative,
  ADD CONSTRAINT actual_duration_nonnegative CHECK (actual_duration >= 0);

ALTER TABLE public.pomo_sessions
  DROP CONSTRAINT IF EXISTS no_completed_at_when_active,
  ADD CONSTRAINT no_completed_at_when_active CHECK (
    (status IN ('active', 'paused') AND completed_at IS NULL) OR
    (status IN ('completed', 'cancelled') AND completed_at IS NOT NULL)
  );

-- ============================================================
-- 00003 habit_definitions fixes:
-- - Change icon DEFAULT from emoji to key string
-- - Add custom_days valid CHECK
-- - Drop redundant partial index (idx_habit_definitions_user_active)
-- ============================================================

ALTER TABLE public.habit_definitions
  ALTER COLUMN icon SET DEFAULT 'star';

ALTER TABLE public.habit_definitions
  DROP CONSTRAINT IF EXISTS custom_days_valid,
  ADD CONSTRAINT custom_days_valid CHECK (
    custom_days IS NULL OR
    (array_length(custom_days, 1) > 0 AND
     cardinality(custom_days) = (SELECT count(*) FROM unnest(custom_days) AS d WHERE d BETWEEN 0 AND 6))
  );

DROP INDEX IF EXISTS idx_habit_definitions_user_active;

-- ============================================================
-- 00004 habit_entries fixes:
-- - Add no_future_checkin CHECK
-- ============================================================

ALTER TABLE public.habit_entries
  DROP CONSTRAINT IF EXISTS no_future_checkin,
  ADD CONSTRAINT no_future_checkin CHECK (checked_at <= CURRENT_DATE);

-- ============================================================
-- 00005 gam_xp_transactions fixes:
-- - Rename source_ref_id → old_source_ref_id
-- - Add pomo_session_id and habit_entry_id as proper FKs
-- - Add CHECK exactly_one_source_ref
-- - Replace old unique constraint with two new partial ones
-- - Drop old unique index (now replaced by two partial indexes)
-- ============================================================

-- Rename the old polymorphic column (keep data for reference, will migrate later)
ALTER TABLE public.gam_xp_transactions
  RENAME COLUMN source_ref_id TO old_source_ref_id;

-- Add the two proper FK columns
ALTER TABLE public.gam_xp_transactions
  ADD COLUMN pomo_session_id UUID,
  ADD COLUMN habit_entry_id  UUID;

-- Populate the new columns from old_source_ref_id using source_type
-- This runs as a one-time data migration
UPDATE public.gam_xp_transactions
SET
  pomo_session_id = CASE WHEN source_type = 'pomodoro' THEN old_source_ref_id::UUID ELSE NULL END,
  habit_entry_id  = CASE WHEN source_type = 'habit'    THEN old_source_ref_id::UUID ELSE NULL END;

-- Add FK constraints
ALTER TABLE public.gam_xp_transactions
  ADD CONSTRAINT fk_pomo_session
    FOREIGN KEY (pomo_session_id) REFERENCES public.pomo_sessions(id) ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

ALTER TABLE public.gam_xp_transactions
  ADD CONSTRAINT fk_habit_entry
    FOREIGN KEY (habit_entry_id) REFERENCES public.habit_entries(id) ON DELETE SET NULL
    DEFERRABLE INITIALLY DEFERRED;

-- Exactly one source must be set
ALTER TABLE public.gam_xp_transactions
  DROP CONSTRAINT IF EXISTS exactly_one_source_ref,
  ADD CONSTRAINT exactly_one_source_ref CHECK (
    (pomo_session_id IS NOT NULL AND habit_entry_id IS NULL) OR
    (pomo_session_id IS NULL    AND habit_entry_id IS NOT NULL)
  );

-- Replace old unique index with two partial ones
DROP INDEX IF EXISTS uq_gam_xp_transactions_source;

CREATE UNIQUE INDEX IF NOT EXISTS uq_gam_xp_transactions_pomo
  ON public.gam_xp_transactions (source_type, pomo_session_id)
  WHERE pomo_session_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_gam_xp_transactions_habit
  ON public.gam_xp_transactions (source_type, habit_entry_id)
  WHERE habit_entry_id IS NOT NULL;

-- Add XP amount upper bound
ALTER TABLE public.gam_xp_transactions
  DROP CONSTRAINT IF EXISTS xp_amount_positive,
  ADD CONSTRAINT xp_amount_positive CHECK (amount > 0 AND amount <= 1000);

-- Drop the now-obsolete source_ref_id column (data has been migrated)
ALTER TABLE public.gam_xp_transactions
  DROP COLUMN old_source_ref_id;

-- Sync trigger already created in 00005
-- Re-create to ensure it references correct column names
DROP TRIGGER IF EXISTS gam_xp_transactions_sync_profile ON public.gam_xp_transactions;
DROP FUNCTION IF EXISTS public.sync_profile_xp_on_insert();

CREATE OR REPLACE FUNCTION public.sync_profile_xp_on_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles
  SET
    total_xp = total_xp + NEW.amount,
    current_level = (
      SELECT COALESCE(MAX(level), 1)
      FROM public.gam_levels
      WHERE min_xp <= (
        SELECT total_xp + NEW.amount
        FROM public.profiles
        WHERE user_id = NEW.user_id
      )
    )
  WHERE user_id = NEW.user_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = pg_catalog, public;

CREATE TRIGGER gam_xp_transactions_sync_profile
  AFTER INSERT ON public.gam_xp_transactions
  FOR EACH ROW
  EXECUTE FUNCTION public.sync_profile_xp_on_insert();

COMMENT ON FUNCTION public.sync_profile_xp_on_insert() IS
  'After XP insert, atomically updates profiles.total_xp and recomputes current_level';

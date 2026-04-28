-- Enable RLS on all tables
alter table profiles enable row level security;
alter table character_stats enable row level security;
alter table pomodoro_settings enable row level security;
alter table pomodoro_tasks enable row level security;
alter table pomodoro_sessions enable row level security;
alter table habits enable row level security;
alter table habit_completions enable row level security;
alter table habit_notes enable row level security;
alter table flashcard_decks enable row level security;
alter table flashcard_cards enable row level security;
alter table flashcard_reviews enable row level security;
alter table xp_transactions enable row level security;
alter table badges enable row level security;
alter table user_badges enable row level security;
alter table quests enable row level security;
alter table user_quests enable row level security;
alter table unlockables enable row level security;
alter table user_unlockables enable row level security;
alter table level_thresholds enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
create policy "Users can view own profile" on profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- ============================================================
-- CHARACTER STATS
-- ============================================================
create policy "Users can view own stats" on character_stats for select using (auth.uid() = user_id);

-- ============================================================
-- POMODORO SETTINGS
-- ============================================================
create policy "Users can manage own pomodoro settings" on pomodoro_settings for all using (auth.uid() = user_id);

-- ============================================================
-- POMODORO TASKS
-- ============================================================
create policy "Users can manage own tasks" on pomodoro_tasks for all using (auth.uid() = user_id);

-- ============================================================
-- POMODORO SESSIONS
-- ============================================================
create policy "Users can view own sessions" on pomodoro_sessions for select using (auth.uid() = user_id);
-- INSERT is handled by SECURITY DEFINER function only

-- ============================================================
-- HABITS
-- ============================================================
create policy "Users can manage own habits" on habits for all using (auth.uid() = user_id);

-- ============================================================
-- HABIT COMPLETIONS
-- ============================================================
create policy "Users can view own completions" on habit_completions for select using (auth.uid() = user_id);
create policy "Users can insert own completions" on habit_completions for insert with check (auth.uid() = user_id);
create policy "Users can delete own completions" on habit_completions for delete using (auth.uid() = user_id);

-- ============================================================
-- HABIT NOTES
-- ============================================================
create policy "Users can manage own notes" on habit_notes for all using (auth.uid() = user_id);

-- ============================================================
-- FLASHCARD DECKS
-- ============================================================
create policy "Users can manage own decks" on flashcard_decks for all using (auth.uid() = user_id);
create policy "Public decks are viewable" on flashcard_decks for select using (is_public = true);

-- ============================================================
-- FLASHCARD CARDS
-- ============================================================
create policy "Users can manage own cards" on flashcard_cards for all using (auth.uid() = user_id);

-- ============================================================
-- FLASHCARD REVIEWS
-- ============================================================
create policy "Users can view own reviews" on flashcard_reviews for select using (auth.uid() = user_id);

-- ============================================================
-- XP TRANSACTIONS (read-only for users, write via SECURITY DEFINER)
-- ============================================================
create policy "Users can view own XP transactions" on xp_transactions for select using (auth.uid() = user_id);

-- ============================================================
-- BADGES (public catalogue)
-- ============================================================
create policy "Badges are publicly viewable" on badges for select using (true);

-- ============================================================
-- USER BADGES
-- ============================================================
create policy "Users can view own badges" on user_badges for select using (auth.uid() = user_id);

-- ============================================================
-- QUESTS (public catalogue)
-- ============================================================
create policy "Quests are publicly viewable" on quests for select using (true);

-- ============================================================
-- USER QUESTS
-- ============================================================
create policy "Users can view own quests" on user_quests for select using (auth.uid() = user_id);

-- ============================================================
-- UNLOCKABLES (public catalogue)
-- ============================================================
create policy "Unlockables are publicly viewable" on unlockables for select using (true);

-- ============================================================
-- USER UNLOCKABLES
-- ============================================================
create policy "Users can view own unlockables" on user_unlockables for select using (auth.uid() = user_id);

-- ============================================================
-- LEVEL THRESHOLDS (public)
-- ============================================================
create policy "Level thresholds are publicly viewable" on level_thresholds for select using (true);

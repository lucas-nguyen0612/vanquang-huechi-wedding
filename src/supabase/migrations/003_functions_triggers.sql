-- ============================================================
-- update_updated_at trigger function
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply to all relevant tables
create trigger trg_profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger trg_character_stats_updated_at before update on character_stats
  for each row execute function update_updated_at();
create trigger trg_pomodoro_settings_updated_at before update on pomodoro_settings
  for each row execute function update_updated_at();
create trigger trg_pomodoro_tasks_updated_at before update on pomodoro_tasks
  for each row execute function update_updated_at();
create trigger trg_habits_updated_at before update on habits
  for each row execute function update_updated_at();
create trigger trg_habit_notes_updated_at before update on habit_notes
  for each row execute function update_updated_at();
create trigger trg_flashcard_decks_updated_at before update on flashcard_decks
  for each row execute function update_updated_at();
create trigger trg_flashcard_cards_updated_at before update on flashcard_cards
  for each row execute function update_updated_at();
create trigger trg_user_quests_updated_at before update on user_quests
  for each row execute function update_updated_at();

-- ============================================================
-- on_auth_user_created — auto-init profile/stats/settings
-- ============================================================
create or replace function on_auth_user_created()
returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, username, character_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'character_name', 'Adventurer')
  );

  insert into character_stats (user_id)
  values (new.id);

  insert into pomodoro_settings (user_id)
  values (new.id);

  -- Assign today's daily quests
  insert into user_quests (user_id, quest_id, assigned_date)
  select new.id, q.id, current_date
  from quests q
  where q.quest_type = 'daily' and q.is_active = true
  limit 3;

  return new;
end;
$$;

create trigger trg_on_auth_user_created
  after insert on auth.users
  for each row execute function on_auth_user_created();

-- ============================================================
-- award_xp — atomic XP award with level-up detection
-- ============================================================
create or replace function award_xp(
  p_user_id uuid,
  p_amount integer,
  p_source text,
  p_source_id uuid,
  p_description text
)
returns table(xp_awarded integer, leveled_up boolean, new_level integer, old_level integer)
language plpgsql security definer as $$
declare
  v_stats character_stats%rowtype;
  v_old_level integer;
  v_new_xp integer;
  v_new_level integer;
  v_xp_in_level integer;
  v_leveled_up boolean := false;
  v_threshold record;
begin
  -- Lock the row for atomic update
  select * into v_stats
  from character_stats
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'Character stats not found for user %', p_user_id;
  end if;

  v_old_level := v_stats.level;
  v_new_xp := v_stats.total_xp + p_amount;

  -- Calculate new level
  v_new_level := v_old_level;
  select level into v_new_level
  from level_thresholds
  where xp_required <= v_new_xp
  order by level desc
  limit 1;

  v_new_level := coalesce(v_new_level, 1);
  v_leveled_up := v_new_level > v_old_level;

  -- Calculate XP within current level
  select coalesce(xp_required, 0) into v_xp_in_level
  from level_thresholds
  where level = v_new_level;
  v_xp_in_level := v_new_xp - v_xp_in_level;

  -- Update character stats
  update character_stats
  set
    total_xp = v_new_xp,
    xp_in_current_level = v_xp_in_level,
    level = v_new_level,
    last_activity_date = current_date
  where user_id = p_user_id;

  -- Log XP transaction
  insert into xp_transactions (user_id, amount, source, source_id, description)
  values (p_user_id, p_amount, p_source, p_source_id, p_description);

  -- Check for badges
  perform check_and_award_badges(p_user_id);

  return query select p_amount, v_leveled_up, v_new_level, v_old_level;
end;
$$;

-- ============================================================
-- apply_sm2 — SM-2 review + award XP
-- ============================================================
create or replace function apply_sm2(
  p_user_id uuid,
  p_card_id uuid,
  p_rating integer -- 0=Again, 1=Hard, 2=Good, 3=Easy
)
returns table(xp_awarded integer, new_interval integer, new_ease_factor numeric, leveled_up boolean)
language plpgsql security definer as $$
declare
  v_card flashcard_cards%rowtype;
  v_ease numeric(4,2);
  v_interval integer;
  v_reps integer;
  v_xp integer;
  v_new_state text;
  v_xp_amounts integer[] := array[0, 1, 2, 3];
begin
  select * into v_card from flashcard_cards where id = p_card_id and user_id = p_user_id for update;
  if not found then raise exception 'Card not found'; end if;

  v_ease := v_card.ease_factor;
  v_interval := v_card.interval;
  v_reps := v_card.repetitions;
  v_xp := v_xp_amounts[p_rating + 1];

  if p_rating = 0 then
    v_reps := 0;
    v_interval := 1;
  else
    if v_reps = 0 then v_interval := 1;
    elsif v_reps = 1 then v_interval := 6;
    else v_interval := round(v_interval * v_ease);
    end if;
    v_ease := greatest(1.3, v_ease + (0.1 - (3 - p_rating) * (0.08 + (3 - p_rating) * 0.02)));
    v_reps := v_reps + 1;
  end if;

  -- Determine state
  if v_interval <= 1 then v_new_state := 'learning';
  elsif v_interval <= 7 then v_new_state := 'young';
  else v_new_state := 'mature';
  end if;

  -- Save review history
  insert into flashcard_reviews (card_id, user_id, deck_id, rating, ease_factor_before, interval_before, ease_factor_after, interval_after, xp_awarded)
  values (p_card_id, p_user_id, v_card.deck_id, p_rating, v_card.ease_factor, v_card.interval, v_ease, v_interval, v_xp);

  -- Update card
  update flashcard_cards
  set ease_factor = v_ease, interval = v_interval, repetitions = v_reps,
      due_at = now() + (v_interval || ' days')::interval, state = v_new_state
  where id = p_card_id;

  -- Update character stats
  update character_stats set total_cards_reviewed = total_cards_reviewed + 1 where user_id = p_user_id;

  -- Award XP (only for non-zero ratings)
  if v_xp > 0 then
    perform award_xp(p_user_id, v_xp, 'flashcard', p_card_id, 'Flashcard review: ' || case p_rating when 1 then 'Hard' when 2 then 'Good' when 3 then 'Easy' end);
  end if;

  return query select v_xp, v_interval, v_ease, false::boolean;
end;
$$;

-- ============================================================
-- update_streak — timezone-aware streak update
-- ============================================================
create or replace function update_streak()
returns trigger language plpgsql security definer as $$
declare
  v_user_id uuid;
  v_habit habits%rowtype;
  v_yesterday date;
  v_new_streak integer;
  v_xp_to_award integer := 0;
  v_milestone_xp integer := 0;
begin
  v_user_id := new.user_id;
  select * into v_habit from habits where id = new.habit_id for update;
  v_yesterday := new.completed_date - interval '1 day';

  if v_habit.last_completed_date = v_yesterday then
    v_new_streak := v_habit.current_streak + 1;
  elsif v_habit.last_completed_date = new.completed_date then
    return new; -- Already completed today
  else
    v_new_streak := 1;
  end if;

  -- Check streak milestones
  if v_new_streak = 7 then v_milestone_xp := 50;
  elsif v_new_streak = 14 then v_milestone_xp := 100;
  elsif v_new_streak = 30 then v_milestone_xp := 200;
  end if;

  update habits
  set current_streak = v_new_streak,
      longest_streak = greatest(longest_streak, v_new_streak),
      last_completed_date = new.completed_date
  where id = new.habit_id;

  -- Update character stats
  update character_stats
  set total_habits_completed = total_habits_completed + 1
  where user_id = v_user_id;

  -- Award habit check-in XP
  perform award_xp(v_user_id, 5, 'habit', new.habit_id, 'Habit check-in: ' || v_habit.name);

  -- Award milestone XP
  if v_milestone_xp > 0 then
    perform award_xp(v_user_id, v_milestone_xp, 'streak', new.habit_id,
      v_new_streak || '-day streak milestone: ' || v_habit.name);
  end if;

  return new;
end;
$$;

create trigger trg_habit_completion_streak
  after insert on habit_completions
  for each row execute function update_streak();

-- ============================================================
-- check_and_award_badges
-- ============================================================
create or replace function check_and_award_badges(p_user_id uuid)
returns void language plpgsql security definer as $$
declare
  v_stats character_stats%rowtype;
  v_badge record;
begin
  select * into v_stats from character_stats where user_id = p_user_id;

  for v_badge in
    select b.* from badges b
    where not exists (
      select 1 from user_badges ub where ub.user_id = p_user_id and ub.badge_id = b.id
    )
  loop
    case v_badge.condition_type
      when 'total_xp' then
        if v_stats.total_xp >= v_badge.condition_value then
          insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id) on conflict do nothing;
        end if;
      when 'level' then
        if v_stats.level >= v_badge.condition_value then
          insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id) on conflict do nothing;
        end if;
      when 'total_pomodoros' then
        if v_stats.total_pomodoros >= v_badge.condition_value then
          insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id) on conflict do nothing;
        end if;
      when 'longest_streak' then
        if v_stats.longest_streak >= v_badge.condition_value then
          insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id) on conflict do nothing;
        end if;
      when 'total_cards_reviewed' then
        if v_stats.total_cards_reviewed >= v_badge.condition_value then
          insert into user_badges (user_id, badge_id) values (p_user_id, v_badge.id) on conflict do nothing;
        end if;
    end case;
  end loop;
end;
$$;

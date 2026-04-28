-- Enable required extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm";

-- ============================================================
-- AUTH & PROFILE
-- ============================================================

create table profiles (
  id uuid references auth.users on delete cascade primary key,
  username text unique not null,
  character_name text not null default 'Adventurer',
  character_class text not null default 'Scholar',
  goals text[] not null default '{}',
  first_tool text,
  onboarding_completed boolean not null default false,
  preferred_theme text not null default 'system',
  accent_hue integer not null default 38 check (accent_hue between 0 and 360),
  timezone text not null default 'Asia/Ho_Chi_Minh',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table character_stats (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null unique,
  level integer not null default 1 check (level between 1 and 50),
  total_xp integer not null default 0 check (total_xp >= 0),
  xp_in_current_level integer not null default 0 check (xp_in_current_level >= 0),
  focus_stat integer not null default 0 check (focus_stat between 0 and 100),
  discipline_stat integer not null default 0 check (discipline_stat between 0 and 100),
  knowledge_stat integer not null default 0 check (knowledge_stat between 0 and 100),
  endurance_stat integer not null default 0 check (endurance_stat between 0 and 100),
  total_pomodoros integer not null default 0,
  total_focus_minutes integer not null default 0,
  total_habits_completed integer not null default 0,
  total_cards_reviewed integer not null default 0,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_activity_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- POMODORO
-- ============================================================

create table pomodoro_settings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null unique,
  work_duration integer not null default 25 check (work_duration between 1 and 120),
  short_break integer not null default 5 check (short_break between 1 and 60),
  long_break integer not null default 15 check (long_break between 1 and 120),
  sessions_before_long_break integer not null default 4,
  auto_start_breaks boolean not null default false,
  auto_start_pomodoros boolean not null default false,
  soundscape text not null default 'none',
  soundscape_volume integer not null default 50 check (soundscape_volume between 0 and 100),
  focus_blocker_enabled boolean not null default false,
  blocked_sites text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pomodoro_tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  title text not null,
  estimated_pomodoros integer not null default 1 check (estimated_pomodoros between 1 and 20),
  completed_pomodoros integer not null default 0,
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table pomodoro_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  task_id uuid references pomodoro_tasks on delete set null,
  started_at timestamptz not null,
  completed_at timestamptz not null,
  duration_minutes integer not null,
  interruptions integer not null default 0,
  is_clean boolean not null default false,
  xp_awarded integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- HABITS
-- ============================================================

create table habits (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  category text not null default 'custom' check (category in ('health', 'learning', 'work', 'social', 'custom')),
  time_of_day text not null default 'anytime' check (time_of_day in ('morning', 'afternoon', 'evening', 'anytime')),
  color text not null default '#6366f1',
  target_days integer[] not null default '{1,2,3,4,5,6,7}',
  reminder_time time,
  current_streak integer not null default 0,
  longest_streak integer not null default 0,
  last_completed_date date,
  is_archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table habit_completions (
  id uuid primary key default uuid_generate_v4(),
  habit_id uuid references habits on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  completed_date date not null,
  created_at timestamptz not null default now(),
  unique(habit_id, completed_date)
);

create table habit_notes (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  note_date date not null,
  content text not null,
  mood integer check (mood between 1 and 5),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, note_date)
);

-- ============================================================
-- FLASHCARD
-- ============================================================

create table flashcard_decks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  description text,
  color text not null default '#6366f1',
  is_public boolean not null default false,
  card_count integer not null default 0,
  due_count integer not null default 0,
  new_count integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table flashcard_cards (
  id uuid primary key default uuid_generate_v4(),
  deck_id uuid references flashcard_decks on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  front text not null,
  back text not null,
  tags text[] not null default '{}',
  ease_factor numeric(4,2) not null default 2.5 check (ease_factor >= 1.3),
  interval integer not null default 0,
  repetitions integer not null default 0,
  due_at timestamptz not null default now(),
  state text not null default 'new' check (state in ('new', 'learning', 'young', 'mature')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table flashcard_reviews (
  id uuid primary key default uuid_generate_v4(),
  card_id uuid references flashcard_cards on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null,
  deck_id uuid references flashcard_decks on delete cascade not null,
  rating integer not null check (rating between 0 and 3),
  ease_factor_before numeric(4,2) not null,
  interval_before integer not null,
  ease_factor_after numeric(4,2) not null,
  interval_after integer not null,
  xp_awarded integer not null default 0,
  reviewed_at timestamptz not null default now()
);

-- ============================================================
-- GAMIFICATION
-- ============================================================

create table xp_transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  amount integer not null check (amount > 0),
  source text not null check (source in ('pomodoro', 'habit', 'flashcard', 'quest', 'streak', 'bonus')),
  source_id uuid,
  description text not null,
  created_at timestamptz not null default now()
);

create table badges (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null,
  icon text not null,
  rarity text not null default 'common' check (rarity in ('common', 'uncommon', 'rare', 'legendary', 'mythic')),
  condition_type text not null,
  condition_value integer not null,
  created_at timestamptz not null default now()
);

create table user_badges (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  badge_id uuid references badges on delete cascade not null,
  earned_at timestamptz not null default now(),
  unique(user_id, badge_id)
);

create table quests (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null,
  quest_type text not null check (quest_type in ('daily', 'weekly')),
  tool text not null check (tool in ('pomodoro', 'habit', 'flashcard', 'any')),
  target_value integer not null,
  xp_reward integer not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table user_quests (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  quest_id uuid references quests on delete cascade not null,
  current_value integer not null default 0,
  is_completed boolean not null default false,
  assigned_date date not null default current_date,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table unlockables (
  id uuid primary key default uuid_generate_v4(),
  slug text unique not null,
  name text not null,
  description text not null,
  unlock_type text not null check (unlock_type in ('level', 'badge', 'purchase')),
  unlock_value integer,
  category text not null check (category in ('soundscape', 'theme', 'avatar_frame')),
  created_at timestamptz not null default now()
);

create table user_unlockables (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  unlockable_id uuid references unlockables on delete cascade not null,
  unlocked_at timestamptz not null default now(),
  unique(user_id, unlockable_id)
);

create table level_thresholds (
  level integer primary key check (level between 1 and 50),
  xp_required integer not null check (xp_required >= 0),
  unlock_feature text,
  created_at timestamptz not null default now()
);

-- ============================================================
-- INDEXES
-- ============================================================

create index idx_pomodoro_sessions_user_created on pomodoro_sessions(user_id, created_at desc);
create index idx_habit_completions_user_date on habit_completions(user_id, completed_date desc);
create index idx_habit_completions_habit_date on habit_completions(habit_id, completed_date desc);
create index idx_flashcard_cards_deck_due on flashcard_cards(deck_id, due_at) where state != 'mature';
create index idx_flashcard_reviews_user_reviewed on flashcard_reviews(user_id, reviewed_at desc);
create index idx_xp_transactions_user_created on xp_transactions(user_id, created_at desc);
create index idx_user_quests_user_date on user_quests(user_id, assigned_date desc);

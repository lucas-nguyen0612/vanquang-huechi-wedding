-- ============================================================
-- LEVEL THRESHOLDS (1–50)
-- ============================================================
insert into level_thresholds (level, xp_required, unlock_feature) values
(1, 0, null),
(2, 300, null),
(3, 700, null),
(4, 1200, null),
(5, 1500, 'dark_mode'),
(6, 2100, null),
(7, 2800, null),
(8, 3600, null),
(9, 4500, null),
(10, 5500, 'cafe_soundscape'),
(11, 6700, null),
(12, 8000, null),
(13, 9500, null),
(14, 11000, null),
(15, 12000, 'deep_forest_soundscape'),
(16, 14000, null),
(17, 16000, null),
(18, 18500, null),
(19, 19800, null),
(20, 21000, 'accent_color_picker'),
(21, 23500, null),
(22, 26000, null),
(23, 28500, null),
(24, 31000, null),
(25, 34000, null),
(26, 37000, null),
(27, 40000, null),
(28, 43000, null),
(29, 45000, null),
(30, 46500, 'legendary_avatar'),
(31, 50000, null),
(32, 54000, null),
(33, 58000, null),
(34, 62000, null),
(35, 66500, null),
(36, 71000, null),
(37, 76000, null),
(38, 81000, null),
(39, 86500, null),
(40, 92000, null),
(41, 98000, null),
(42, 104500, null),
(43, 111000, null),
(44, 118000, null),
(45, 120000, null),
(46, 122000, null),
(47, 123500, null),
(48, 125000, null),
(49, 126500, null),
(50, 127500, 'mythic_avatar');

-- ============================================================
-- BADGES (20 badges)
-- ============================================================
insert into badges (slug, name, description, icon, rarity, condition_type, condition_value) values
-- Common
('first_session', 'First Focus', 'Complete your first Pomodoro session', '🍅', 'common', 'total_pomodoros', 1),
('first_habit', 'Creature of Habit', 'Check in your first habit', 'checkmark.circle', 'common', 'total_habits_completed', 1),
('first_card', 'Card Collector', 'Review your first flashcard', '📇', 'common', 'total_cards_reviewed', 1),
('level_5', 'Rising Star', 'Reach level 5', '⭐', 'common', 'level', 5),

-- Uncommon
('pomodoro_10', 'Focus Apprentice', 'Complete 10 Pomodoro sessions', '🍅', 'uncommon', 'total_pomodoros', 10),
('streak_7', 'Week Warrior', 'Maintain a 7-day habit streak', '🔥', 'uncommon', 'longest_streak', 7),
('cards_50', 'Flashcard Fan', 'Review 50 flashcards', '📚', 'uncommon', 'total_cards_reviewed', 50),
('level_10', 'Apprentice Scholar', 'Reach level 10', '📖', 'uncommon', 'level', 10),
('xp_1000', 'XP Collector', 'Earn 1,000 total XP', '✨', 'uncommon', 'total_xp', 1000),

-- Rare
('pomodoro_50', 'Focus Journeyman', 'Complete 50 Pomodoro sessions', '⏰', 'rare', 'total_pomodoros', 50),
('streak_14', 'Fortnight Fighter', 'Maintain a 14-day habit streak', '🔥', 'rare', 'longest_streak', 14),
('cards_200', 'Memory Master', 'Review 200 flashcards', '🧠', 'rare', 'total_cards_reviewed', 200),
('level_15', 'Rare Achiever', 'Reach level 15', '💎', 'rare', 'level', 15),
('xp_10000', 'XP Hoarder', 'Earn 10,000 total XP', '💰', 'rare', 'total_xp', 10000),

-- Legendary
('pomodoro_200', 'Focus Master', 'Complete 200 Pomodoro sessions', '🏆', 'legendary', 'total_pomodoros', 200),
('streak_30', 'Month Master', 'Maintain a 30-day habit streak', '🌟', 'legendary', 'longest_streak', 30),
('cards_1000', 'Knowledge Keeper', 'Review 1,000 flashcards', '📜', 'legendary', 'total_cards_reviewed', 1000),
('level_30', 'Legendary Scholar', 'Reach level 30', '👑', 'legendary', 'level', 30),

-- Mythic
('level_50', 'Mythic Sage', 'Reach the maximum level 50', '🌌', 'mythic', 'level', 50),
('xp_100000', 'Century Scholar', 'Earn 100,000 total XP', '🌠', 'mythic', 'total_xp', 100000);

-- ============================================================
-- QUESTS (9 quests: 6 daily + 3 weekly)
-- ============================================================
insert into quests (slug, name, description, quest_type, tool, target_value, xp_reward) values
-- Daily quests
('daily_pomodoro_2', 'Deep Focus', 'Complete 2 Pomodoro sessions', 'daily', 'pomodoro', 2, 30),
('daily_flashcard_20', 'Quick Review', 'Review 20 flashcards', 'daily', 'flashcard', 20, 25),
('daily_habit_all', 'Perfect Day', 'Complete all your habits today', 'daily', 'habit', 1, 25),
('daily_focus_60', 'Hour of Power', 'Accumulate 60 minutes of focus time', 'daily', 'pomodoro', 60, 20),
('daily_habit_3', 'Triple Check', 'Check in at least 3 habits', 'daily', 'habit', 3, 15),
('daily_flashcard_50', 'Card Marathon', 'Review 50 flashcards in one day', 'daily', 'flashcard', 50, 40),
-- Weekly quests
('weekly_pomodoro_10', 'Focus Week', 'Complete 10 Pomodoro sessions this week', 'weekly', 'pomodoro', 10, 80),
('weekly_streak_7', 'Streak Keeper', 'Maintain a 7-day habit streak', 'weekly', 'habit', 7, 100),
('weekly_flashcard_100', 'Card Master Week', 'Review 100 flashcards this week', 'weekly', 'flashcard', 100, 90);

-- ============================================================
-- UNLOCKABLES (9 items)
-- ============================================================
insert into unlockables (slug, name, description, unlock_type, unlock_value, category) values
('soundscape_none', 'Silence', 'No background sound', 'level', 1, 'soundscape'),
('soundscape_rain', 'Rain & Thunder', 'Peaceful rain sounds', 'level', 1, 'soundscape'),
('soundscape_cafe', 'Café Ambience', 'Cozy café background noise', 'level', 10, 'soundscape'),
('soundscape_forest', 'Deep Forest', 'Immersive forest soundscape', 'level', 15, 'soundscape'),
('soundscape_lofi', 'Lo-Fi Beats', 'Relaxing lo-fi music', 'level', 20, 'soundscape'),
('soundscape_ocean', 'Ocean Waves', 'Calm ocean waves', 'level', 25, 'soundscape'),
('theme_dark', 'Dark Mode', 'Switch to dark theme', 'level', 5, 'theme'),
('theme_accent', 'Custom Accent', 'Choose your accent color', 'level', 20, 'theme'),
('frame_legendary', 'Legendary Frame', 'Golden avatar frame for legendary users', 'level', 30, 'avatar_frame');

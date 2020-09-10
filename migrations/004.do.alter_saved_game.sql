ALTER TABLE saneful_saved_game
ADD COLUMN health_points_max INTEGER NOT NULL,
ADD COLUMN sanity_points_max INTEGER NOT NULL,
ADD COLUMN energy_points_max INTEGER NOT NULL;
-- Flyway Migration V10: Add google_place_id column to activities

ALTER TABLE activities ADD COLUMN IF NOT EXISTS google_place_id VARCHAR(255);

CREATE INDEX IF NOT EXISTS idx_activities_google_place_id ON activities(google_place_id);

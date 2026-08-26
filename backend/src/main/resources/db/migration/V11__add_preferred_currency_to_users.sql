-- Flyway Migration V11: Add preferred_currency to users table

ALTER TABLE users ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(10) DEFAULT 'INR';

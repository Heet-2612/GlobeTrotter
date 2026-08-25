-- Flyway Migration V9: Add currency_code and currency_symbol to cities

ALTER TABLE cities ADD COLUMN IF NOT EXISTS currency_code VARCHAR(10) DEFAULT 'INR';
ALTER TABLE cities ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(10) DEFAULT '₹';

UPDATE cities
SET currency_code = 'INR', currency_symbol = '₹'
WHERE currency_code IS NULL OR currency_symbol IS NULL;

ALTER TABLE cities ALTER COLUMN currency_code SET NOT NULL;
ALTER TABLE cities ALTER COLUMN currency_symbol SET NOT NULL;

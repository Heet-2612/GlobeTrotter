-- V36__create_expense_payers.sql
-- Create expense_payers table for multi-payer expense support and backfill existing data

CREATE TABLE expense_payers (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    paid_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_payers_expense FOREIGN KEY (expense_id) REFERENCES trip_expenses(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_payers_member FOREIGN KEY (member_id) REFERENCES trip_members(id) ON DELETE RESTRICT,
    CONSTRAINT uq_expense_payer UNIQUE (expense_id, member_id),
    CONSTRAINT chk_paid_amount_positive CHECK (paid_amount > 0.00)
);

CREATE INDEX idx_expense_payers_expense_id ON expense_payers(expense_id);
CREATE INDEX idx_expense_payers_member_id ON expense_payers(member_id);

-- Backfill existing single payers from trip_expenses
INSERT INTO expense_payers (expense_id, member_id, paid_amount)
SELECT id, payer_member_id, amount
FROM trip_expenses
WHERE payer_member_id IS NOT NULL
ON CONFLICT (expense_id, member_id) DO NOTHING;

-- Make payer_member_id nullable to support multi-payer expenses
ALTER TABLE trip_expenses ALTER COLUMN payer_member_id DROP NOT NULL;

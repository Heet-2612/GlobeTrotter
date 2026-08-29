-- V34__create_trip_expenses_and_participants.sql
-- Create trip_expenses and expense_participants tables for Phase 2 GlobeTrotter bill-splitting

CREATE TABLE trip_expenses (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    payer_member_id BIGINT NOT NULL,
    created_by_user_id BIGINT NOT NULL,
    trip_activity_id BIGINT,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    category VARCHAR(50) NOT NULL DEFAULT 'OTHER',
    expense_date DATE NOT NULL,
    split_type VARCHAR(20) NOT NULL DEFAULT 'EQUAL',
    notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_expenses_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_expenses_payer FOREIGN KEY (payer_member_id) REFERENCES trip_members(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trip_expenses_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trip_expenses_activity FOREIGN KEY (trip_activity_id) REFERENCES trip_activities(id) ON DELETE SET NULL
);

CREATE INDEX idx_trip_expenses_trip_id ON trip_expenses(trip_id);
CREATE INDEX idx_trip_expenses_payer_id ON trip_expenses(payer_member_id);
CREATE INDEX idx_trip_expenses_creator_id ON trip_expenses(created_by_user_id);
CREATE INDEX idx_trip_expenses_activity_id ON trip_expenses(trip_activity_id);

CREATE TABLE expense_participants (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    share_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_expense_participants_expense FOREIGN KEY (expense_id) REFERENCES trip_expenses(id) ON DELETE CASCADE,
    CONSTRAINT fk_expense_participants_member FOREIGN KEY (member_id) REFERENCES trip_members(id) ON DELETE RESTRICT,
    CONSTRAINT uq_expense_participant UNIQUE (expense_id, member_id)
);

CREATE INDEX idx_expense_participants_expense_id ON expense_participants(expense_id);
CREATE INDEX idx_expense_participants_member_id ON expense_participants(member_id);

-- Flyway Migration V35: Create trip_settlements table
CREATE TABLE trip_settlements (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    payer_member_id BIGINT NOT NULL,
    receiver_member_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    settlement_date DATE NOT NULL,
    notes TEXT,
    created_by_user_id BIGINT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_settlements_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_settlements_payer FOREIGN KEY (payer_member_id) REFERENCES trip_members(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trip_settlements_receiver FOREIGN KEY (receiver_member_id) REFERENCES trip_members(id) ON DELETE RESTRICT,
    CONSTRAINT fk_trip_settlements_creator FOREIGN KEY (created_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT chk_settlements_different_members CHECK (payer_member_id <> receiver_member_id),
    CONSTRAINT chk_settlements_amount_positive CHECK (amount > 0.00)
);

CREATE INDEX idx_trip_settlements_trip_id ON trip_settlements(trip_id);
CREATE INDEX idx_trip_settlements_payer_id ON trip_settlements(payer_member_id);
CREATE INDEX idx_trip_settlements_receiver_id ON trip_settlements(receiver_member_id);
CREATE INDEX idx_trip_settlements_creator_id ON trip_settlements(created_by_user_id);

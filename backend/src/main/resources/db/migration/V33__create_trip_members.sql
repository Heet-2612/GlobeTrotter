-- V33__create_trip_members.sql
-- Create trip_members table for Phase 1 GlobeTrotter bill-splitting and member management

CREATE TABLE trip_members (
    id BIGSERIAL PRIMARY KEY,
    trip_id BIGINT NOT NULL,
    user_id BIGINT,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'MEMBER',
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trip_members_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_members_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT uq_trip_member_registered UNIQUE (trip_id, user_id)
);

CREATE INDEX idx_trip_members_trip_id ON trip_members(trip_id);
CREATE INDEX idx_trip_members_user_id ON trip_members(user_id);

-- Backfill existing trip owners as OWNER members
INSERT INTO trip_members (trip_id, user_id, full_name, role, status)
SELECT t.id, t.user_id, COALESCE(u.name, 'Trip Owner'), 'OWNER', 'ACTIVE'
FROM trips t
JOIN users u ON t.user_id = u.id
ON CONFLICT (trip_id, user_id) DO NOTHING;

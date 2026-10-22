-- SOLO para la base NUEVA y VACIA elorrietatrack-estable-auth. Ejecutar UNA vez.

CREATE TABLE IF NOT EXISTS users (
 id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL,
 role TEXT NOT NULL DEFAULT 'user' CHECK(role IN ('admin','user')),
 active INTEGER NOT NULL DEFAULT 1, created_at INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
 token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS login_limits (bucket TEXT PRIMARY KEY, attempts INTEGER NOT NULL, until_at INTEGER NOT NULL);

CREATE TABLE IF NOT EXISTS licenses(id TEXT PRIMARY KEY,key_hash TEXT NOT NULL UNIQUE,label TEXT NOT NULL,expires_at INTEGER NOT NULL,active INTEGER NOT NULL DEFAULT 1,device TEXT,public_key TEXT,activated_at INTEGER,created_at INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS license_nonces(nonce TEXT PRIMARY KEY,created_at INTEGER NOT NULL);

ALTER TABLE licenses ADD COLUMN plan TEXT NOT NULL DEFAULT 'basic' CHECK(plan IN ('basic','premium'));
ALTER TABLE users ADD COLUMN plan TEXT NOT NULL DEFAULT 'basic' CHECK(plan IN ('basic','premium'));
CREATE INDEX IF NOT EXISTS license_nonces_created ON license_nonces(created_at);

-- One-time, additive migration. Does not change activation or signed permits.
ALTER TABLE licenses ADD COLUMN key_ciphertext TEXT;
ALTER TABLE licenses ADD COLUMN owner_email TEXT NOT NULL DEFAULT '';

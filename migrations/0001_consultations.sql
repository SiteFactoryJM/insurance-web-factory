CREATE TABLE IF NOT EXISTS consultations (
  id TEXT PRIMARY KEY,
  site_id TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  privacy_consent INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  user_agent TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'new'
);
CREATE INDEX IF NOT EXISTS idx_consultations_site_created_at ON consultations(site_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);

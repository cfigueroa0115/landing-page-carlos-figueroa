-- Neon PostgreSQL Schema for Landing Page CV - Contact Form Leads & Analytics
-- Run this SQL in your Neon database console to create the required tables and indexes.

-- =============================================================================
-- Leads Table (Contact Form)
-- =============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100),
  email VARCHAR(150) NOT NULL,
  motivo VARCHAR(50) NOT NULL CHECK (motivo IN ('Consultoría', 'Colaboración', 'Docencia', 'Otro')),
  mensaje TEXT NOT NULL CHECK (char_length(mensaje) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash VARCHAR(64) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_leads_ip_hash_created ON leads (ip_hash, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);

-- =============================================================================
-- Analytics Events Table (Page Tracking)
-- =============================================================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  event_data JSONB DEFAULT '{}',
  page_url VARCHAR(500),
  referrer VARCHAR(500),
  user_agent VARCHAR(500),
  ip_hash VARCHAR(64),
  session_id VARCHAR(64),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_event_type ON analytics_events (event_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_session ON analytics_events (session_id, created_at DESC);

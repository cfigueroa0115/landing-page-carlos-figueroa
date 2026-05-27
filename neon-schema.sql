-- Neon PostgreSQL Schema for Landing Page CV - Contact Form Leads
-- Run this SQL in your Neon database console to create the required table and indexes.

CREATE TABLE leads (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  empresa VARCHAR(100),
  email VARCHAR(150) NOT NULL,
  motivo VARCHAR(50) NOT NULL CHECK (motivo IN ('Consultoría', 'Colaboración', 'Docencia', 'Otro')),
  mensaje TEXT NOT NULL CHECK (char_length(mensaje) <= 1000),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_hash VARCHAR(64) NOT NULL
);

CREATE INDEX idx_leads_ip_hash_created ON leads (ip_hash, created_at DESC);
CREATE INDEX idx_leads_created_at ON leads (created_at DESC);

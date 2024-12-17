-- Modify workspace_settings table to use client_id instead of park_id
ALTER TABLE workspace_settings 
  DROP COLUMN IF EXISTS yango_park_id,
  ADD COLUMN IF NOT EXISTS yango_client_id TEXT;
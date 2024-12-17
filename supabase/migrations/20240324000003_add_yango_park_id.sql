-- Add park_id column to workspace_settings
ALTER TABLE workspace_settings 
  ADD COLUMN IF NOT EXISTS yango_park_id TEXT;
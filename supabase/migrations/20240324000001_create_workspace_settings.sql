-- Create workspace_settings table
CREATE TABLE IF NOT EXISTS workspace_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,
  yango_api_key TEXT,
  yango_client_id TEXT,
  yango_park_id TEXT,
  yango_connection_status BOOLEAN DEFAULT false,
  yango_last_sync TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(workspace_id)
);

-- Add RLS policies
ALTER TABLE workspace_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Workspace admins can read settings" ON workspace_settings;
DROP POLICY IF EXISTS "Workspace admins can update settings" ON workspace_settings;
DROP POLICY IF EXISTS "Workspace admins can insert settings" ON workspace_settings;

-- Create new policies
CREATE POLICY "Workspace admins can read settings"
  ON workspace_settings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_settings.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

CREATE POLICY "Workspace admins can update settings"
  ON workspace_settings
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_settings.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

CREATE POLICY "Workspace admins can insert settings"
  ON workspace_settings
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_members.workspace_id = workspace_settings.workspace_id
      AND workspace_members.user_id = auth.uid()
      AND workspace_members.role = 'admin'
    )
  );

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_workspace_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::TEXT, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_workspace_settings_updated_at ON workspace_settings;
CREATE TRIGGER update_workspace_settings_updated_at
  BEFORE UPDATE ON workspace_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_workspace_settings_updated_at();
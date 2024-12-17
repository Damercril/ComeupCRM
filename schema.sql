-- Existing tables...

-- Statistics for operators
CREATE TABLE operator_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,
  operator_id UUID REFERENCES profiles(id) NOT NULL,
  date DATE NOT NULL,
  calls_count INTEGER DEFAULT 0,
  revenue_generated DECIMAL(12,2) DEFAULT 0,
  avg_call_duration INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(workspace_id, operator_id, date)
);

-- Driver segments tracking
CREATE TABLE driver_segments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,
  date DATE NOT NULL,
  core_drivers_count INTEGER DEFAULT 0,
  potential_drivers_count INTEGER DEFAULT 0,
  inactive_drivers_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(workspace_id, date)
);

-- Daily workspace stats
CREATE TABLE workspace_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) NOT NULL,
  date DATE NOT NULL,
  total_calls INTEGER DEFAULT 0,
  total_revenue DECIMAL(12,2) DEFAULT 0,
  core_drivers INTEGER DEFAULT 0,
  potential_drivers INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::TEXT, NOW()) NOT NULL,
  UNIQUE(workspace_id, date)
);
export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Workspace {
  id: string;
  name: string;
  created_at: string;
  owner_id: string;
}

export interface WorkspaceMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: 'admin' | 'operator';
  created_at: string;
}

export interface WorkspaceInvite {
  id: string;
  workspace_id: string;
  email: string;
  role: 'admin' | 'operator';
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
}
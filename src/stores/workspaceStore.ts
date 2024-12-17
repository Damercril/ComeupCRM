import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Workspace, WorkspaceInvite, WorkspaceMember } from '../types/auth';

interface WorkspaceState {
  createWorkspace: (name: string, userId: string) => Promise<Workspace>;
  inviteMember: (workspaceId: string, email: string, role: 'admin' | 'operator') => Promise<void>;
  acceptInvite: (inviteId: string, userId: string) => Promise<void>;
  getWorkspaceInvites: (workspaceId: string) => Promise<WorkspaceInvite[]>;
  getPendingInvites: (email: string) => Promise<WorkspaceInvite[]>;
  updateMemberRole: (workspaceId: string, memberId: string, role: 'admin' | 'operator') => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceState>((set, get) => ({
  createWorkspace: async (name: string, userId: string) => {
    const { data: workspace, error: workspaceError } = await supabase
      .from('workspaces')
      .insert([
        {
          name,
          owner_id: userId,
        },
      ])
      .select()
      .single();

    if (workspaceError) throw workspaceError;

    // Add creator as admin
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([
        {
          workspace_id: workspace.id,
          user_id: userId,
          role: 'admin',
        },
      ]);

    if (memberError) throw memberError;

    return workspace;
  },

  inviteMember: async (workspaceId: string, email: string, role: 'admin' | 'operator') => {
    const { error } = await supabase
      .from('workspace_invites')
      .insert([
        {
          workspace_id: workspaceId,
          email,
          role,
          status: 'pending',
        },
      ]);

    if (error) throw error;
  },

  acceptInvite: async (inviteId: string, userId: string) => {
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_invites')
      .update({ status: 'accepted' })
      .eq('id', inviteId)
      .select()
      .single();

    if (inviteError) throw inviteError;

    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert([
        {
          workspace_id: invite.workspace_id,
          user_id: userId,
          role: invite.role,
        },
      ]);

    if (memberError) throw memberError;
  },

  getWorkspaceInvites: async (workspaceId: string) => {
    const { data, error } = await supabase
      .from('workspace_invites')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  },

  getPendingInvites: async (email: string) => {
    const { data, error } = await supabase
      .from('workspace_invites')
      .select('*')
      .eq('email', email)
      .eq('status', 'pending');

    if (error) throw error;
    return data;
  },

  updateMemberRole: async (workspaceId: string, memberId: string, role: 'admin' | 'operator') => {
    const { error } = await supabase
      .from('workspace_members')
      .update({ role })
      .eq('id', memberId)
      .eq('workspace_id', workspaceId);

    if (error) throw error;
  },
}));
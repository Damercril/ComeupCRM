import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { User, Workspace, WorkspaceMember } from '../types/auth';
import { useWorkspaceStore } from './workspaceStore';

interface AuthState {
  user: User | null;
  workspace: Workspace | null;
  workspaceRole: 'admin' | 'operator' | null;
  isLoading: boolean;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, fullName: string) => Promise<void>;
  signOut: () => Promise<void>;
  setWorkspace: (workspace: Workspace | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  workspace: null,
  workspaceRole: null,
  isLoading: true,

  initialize: async () => {
    try {
      set({ isLoading: true });
      
      // Check current session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          set({ 
            user: {
              id: session.user.id,
              email: session.user.email!,
              full_name: profile.full_name
            }
          });
          
          // Get user's workspace and role
          const { data: memberData } = await supabase
            .from('workspace_members')
            .select(`
              workspace_id,
              role,
              workspaces:workspace_id (
                id,
                name,
                created_at,
                owner_id
              )
            `)
            .eq('user_id', session.user.id)
            .single();

          if (memberData?.workspaces) {
            set({ 
              workspace: memberData.workspaces,
              workspaceRole: memberData.role
            });
          } else {
            // Check for pending invites
            const { data: pendingInvite } = await supabase
              .from('workspace_invites')
              .select('*')
              .eq('email', session.user.email)
              .eq('status', 'pending')
              .single();

            if (pendingInvite) {
              // Accept the invitation automatically
              const { error: acceptError } = await supabase
                .from('workspace_members')
                .insert([
                  {
                    workspace_id: pendingInvite.workspace_id,
                    user_id: session.user.id,
                    role: pendingInvite.role,
                  },
                ]);

              if (!acceptError) {
                // Update invite status
                await supabase
                  .from('workspace_invites')
                  .update({ status: 'accepted' })
                  .eq('id', pendingInvite.id);

                // Get workspace details
                const { data: workspace } = await supabase
                  .from('workspaces')
                  .select('*')
                  .eq('id', pendingInvite.workspace_id)
                  .single();

                if (workspace) {
                  set({
                    workspace,
                    workspaceRole: pendingInvite.role
                  });
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await get().initialize();
    }
  },

  signUp: async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create profile
      await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            full_name: fullName,
            email,
          },
        ]);

      await get().initialize();
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, workspace: null, workspaceRole: null });
  },

  setWorkspace: (workspace) => {
    set({ workspace });
  },
}));
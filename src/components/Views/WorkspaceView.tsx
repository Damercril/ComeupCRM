import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useAuthStore } from '../../stores/authStore';
import { supabase } from '../../lib/supabase';
import { UserPlus, Users, Mail, Shield } from 'lucide-react';
import type { WorkspaceInvite, WorkspaceMember } from '../../types/auth';
import YangoSettings from '../Yango/YangoSettings';

interface Member extends WorkspaceMember {
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export default function WorkspaceView() {
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'operator'>('operator');
  const workspace = useAuthStore(state => state.workspace);
  const { inviteMember, getWorkspaceInvites, updateMemberRole } = useWorkspaceStore();

  useEffect(() => {
    if (workspace) {
      loadWorkspaceData();
    }
  }, [workspace]);

  const loadWorkspaceData = async () => {
    if (!workspace) return;

    try {
      const { data: membersData, error: membersError } = await supabase
        .from('workspace_members')
        .select(`
          id,
          user_id,
          role,
          profiles:user_id (
            full_name,
            email
          )
        `)
        .eq('workspace_id', workspace.id);

      if (membersError) throw membersError;

      const invitesData = await getWorkspaceInvites(workspace.id);

      setMembers(membersData || []);
      setInvites(invitesData);
    } catch (error) {
      console.error('Error loading workspace data:', error);
    }
  };

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workspace || !email) return;

    try {
      await inviteMember(workspace.id, email, role);
      setEmail('');
      setRole('operator');
      setShowInviteForm(false);
      await loadWorkspaceData();
    } catch (error) {
      console.error('Error inviting member:', error);
    }
  };

  const handleRoleChange = async (memberId: string, newRole: 'admin' | 'operator') => {
    if (!workspace) return;

    try {
      await updateMemberRole(workspace.id, memberId, newRole);
      await loadWorkspaceData();
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (!workspace) return null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-text-primary">Workspace Management</h2>
        <button
          onClick={() => setShowInviteForm(!showInviteForm)}
          className="glass-button active flex items-center space-x-2"
        >
          <UserPlus className="w-5 h-5" />
          <span>Invite Member</span>
        </button>
      </div>

      <YangoSettings />

      {showInviteForm && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-4">
            Invite New Member
          </h3>
          <form onSubmit={handleInvite} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input px-4 py-2 w-full"
                placeholder="collaborator@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'admin' | 'operator')}
                className="glass-input px-4 py-2 w-full"
              >
                <option value="operator">Operator</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
            <button type="submit" className="glass-button active w-full">
              Send Invitation
            </button>
          </form>
        </div>
      )}

      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center space-x-2">
          <Users className="w-5 h-5" />
          <span>Team Members</span>
        </h3>
        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 glass-card flex items-center justify-center">
                    <span className="text-sm font-medium">
                      {member.profiles.full_name
                        ?.split(' ')
                        .map(n => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-text-primary">
                      {member.profiles.full_name || 'User'}
                    </p>
                    <p className="text-sm text-text-secondary">
                      {member.profiles.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, e.target.value as 'admin' | 'operator')}
                    className="glass-input px-3 py-1"
                    disabled={member.user_id === workspace.owner_id}
                  >
                    <option value="operator">Operator</option>
                    <option value="admin">Administrator</option>
                  </select>
                  {member.user_id === workspace.owner_id && (
                    <Shield className="w-5 h-5 text-accent" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {invites.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6 flex items-center space-x-2">
            <Mail className="w-5 h-5" />
            <span>Pending Invitations</span>
          </h3>
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite.id} className="glass-card p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-text-primary font-medium">{invite.email}</p>
                    <p className="text-sm text-text-secondary">
                      Invited as {invite.role === 'admin' ? 'Administrator' : 'Operator'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm">
                    Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
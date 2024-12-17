import React, { useState, useEffect } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useAuthStore } from '../../stores/authStore';
import InviteMemberForm from './InviteMemberForm';
import type { WorkspaceInvite, WorkspaceMember } from '../../types/auth';

export default function WorkspaceSettings() {
  const [members, setMembers] = useState<WorkspaceMember[]>([]);
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const [showInviteForm, setShowInviteForm] = useState(false);
  const workspace = useAuthStore(state => state.workspace);
  const { getWorkspaceMembers, getWorkspaceInvites } = useWorkspaceStore();

  useEffect(() => {
    if (workspace) {
      loadWorkspaceData();
    }
  }, [workspace]);

  const loadWorkspaceData = async () => {
    if (!workspace) return;

    try {
      const [membersData, invitesData] = await Promise.all([
        getWorkspaceMembers(workspace.id),
        getWorkspaceInvites(workspace.id)
      ]);

      setMembers(membersData);
      setInvites(invitesData);
    } catch (error) {
      console.error('Error loading workspace data:', error);
    }
  };

  if (!workspace) return null;

  return (
    <div className="space-y-6">
      <div className="glass-card p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-text-primary">
            Membres de l'équipe
          </h3>
          <button
            onClick={() => setShowInviteForm(!showInviteForm)}
            className="glass-button active"
          >
            Inviter un membre
          </button>
        </div>

        {showInviteForm && (
          <div className="mb-6">
            <InviteMemberForm
              workspaceId={workspace.id}
              onSuccess={() => {
                setShowInviteForm(false);
                loadWorkspaceData();
              }}
            />
          </div>
        )}

        <div className="space-y-4">
          {members.map((member) => (
            <div key={member.id} className="glass-card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-text-primary font-medium">{member.user.full_name}</p>
                  <p className="text-text-secondary text-sm">{member.user.email}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  member.role === 'admin' 
                    ? 'bg-accent/20 text-accent' 
                    : 'bg-accent-success/20 text-accent-success'
                }`}>
                  {member.role === 'admin' ? 'Admin' : 'Opérateur'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {invites.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-text-primary mb-6">
            Invitations en attente
          </h3>
          <div className="space-y-4">
            {invites.map((invite) => (
              <div key={invite.id} className="glass-card p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-text-primary font-medium">{invite.email}</p>
                    <p className="text-text-secondary text-sm">
                      Invité en tant que {invite.role === 'admin' ? 'Admin' : 'Opérateur'}
                    </p>
                  </div>
                  <span className="text-text-secondary text-sm">
                    En attente
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
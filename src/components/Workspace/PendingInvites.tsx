import React, { useEffect, useState } from 'react';
import { useWorkspaceStore } from '../../stores/workspaceStore';
import { useAuthStore } from '../../stores/authStore';
import type { WorkspaceInvite } from '../../types/auth';

export default function PendingInvites() {
  const [invites, setInvites] = useState<WorkspaceInvite[]>([]);
  const getPendingInvites = useWorkspaceStore(state => state.getPendingInvites);
  const acceptInvite = useWorkspaceStore(state => state.acceptInvite);
  const user = useAuthStore(state => state.user);

  useEffect(() => {
    if (user?.email) {
      loadInvites();
    }
  }, [user?.email]);

  const loadInvites = async () => {
    if (!user?.email) return;
    
    try {
      const pendingInvites = await getPendingInvites(user.email);
      setInvites(pendingInvites);
    } catch (error) {
      console.error('Error loading invites:', error);
    }
  };

  const handleAccept = async (inviteId: string) => {
    if (!user?.id) return;
    
    try {
      await acceptInvite(inviteId, user.id);
      await loadInvites();
    } catch (error) {
      console.error('Error accepting invite:', error);
    }
  };

  if (invites.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Invitations en attente
      </h3>
      
      <div className="space-y-4">
        {invites.map((invite) => (
          <div key={invite.id} className="glass-card p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-text-primary font-medium">
                  Invitation pour rejoindre un workspace
                </p>
                <p className="text-text-secondary text-sm mt-1">
                  Rôle: {invite.role === 'admin' ? 'Administrateur' : 'Opérateur'}
                </p>
              </div>
              
              <button
                onClick={() => handleAccept(invite.id)}
                className="glass-button active"
              >
                Accepter
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
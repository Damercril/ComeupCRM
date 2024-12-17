import React, { useState } from 'react';
import { LayoutDashboard, Users, Building2 } from 'lucide-react';
import CreateWorkspaceForm from '../Workspace/CreateWorkspaceForm';
import PendingInvites from '../Workspace/PendingInvites';

export default function OnboardingLayout() {
  const [step, setStep] = useState<'choice' | 'create' | 'join'>('choice');

  const renderStep = () => {
    switch (step) {
      case 'choice':
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-text-primary text-center mb-8">
              Bienvenue sur SAGT CRM
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setStep('create')}
                className="glass-card p-6 hover:border-accent/50 transition-all text-left"
              >
                <Building2 className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Créer un workspace
                </h3>
                <p className="text-text-secondary text-sm">
                  Créez votre propre espace de travail et invitez votre équipe
                </p>
              </button>

              <button
                onClick={() => setStep('join')}
                className="glass-card p-6 hover:border-accent/50 transition-all text-left"
              >
                <Users className="w-8 h-8 text-accent mb-4" />
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Rejoindre un workspace
                </h3>
                <p className="text-text-secondary text-sm">
                  Rejoignez un workspace existant via une invitation
                </p>
              </button>
            </div>
          </div>
        );

      case 'create':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => setStep('choice')}
                className="glass-button"
              >
                Retour
              </button>
              <h2 className="text-xl font-semibold text-text-primary">
                Créer un nouveau workspace
              </h2>
            </div>
            <CreateWorkspaceForm />
          </div>
        );

      case 'join':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-4 mb-8">
              <button 
                onClick={() => setStep('choice')}
                className="glass-button"
              >
                Retour
              </button>
              <h2 className="text-xl font-semibold text-text-primary">
                Rejoindre un workspace
              </h2>
            </div>
            <PendingInvites />
            <div className="glass-card p-6 text-center">
              <p className="text-text-secondary mb-4">
                Vous n'avez pas encore reçu d'invitation ?
              </p>
              <p className="text-sm text-text-secondary">
                Demandez à l'administrateur du workspace de vous envoyer une invitation.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LayoutDashboard className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold bg-gradient-accent text-transparent bg-clip-text">
              SAGT CRM
            </h1>
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { LayoutDashboard } from 'lucide-react';
import SignInForm from '../Auth/SignInForm';
import SignUpForm from '../Auth/SignUpForm';

export default function AuthLayout() {
  const [isSignIn, setIsSignIn] = useState(true);

  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <LayoutDashboard className="w-8 h-8 text-accent" />
            <h1 className="text-2xl font-bold bg-gradient-accent text-transparent bg-clip-text">
              SAGT CRM
            </h1>
          </div>
          <p className="text-text-secondary">
            {isSignIn ? 'Connectez-vous à votre compte' : 'Créez votre compte'}
          </p>
        </div>

        <div className="glass-card p-6">
          {isSignIn ? <SignInForm /> : <SignUpForm />}
          
          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignIn(!isSignIn)}
              className="text-accent hover:text-accent-light transition-colors"
            >
              {isSignIn ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
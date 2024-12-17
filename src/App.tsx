import React, { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { useThemeStore } from './stores/themeStore';
import AuthLayout from './components/Layout/AuthLayout';
import AppLayout from './components/Layout/AppLayout';
import OnboardingLayout from './components/Layout/OnboardingLayout';
import { LayoutDashboard } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen bg-dark flex flex-col items-center justify-center p-4">
      <div className="flex items-center justify-center space-x-3 mb-8">
        <LayoutDashboard className="w-8 h-8 text-accent animate-pulse" />
        <h1 className="text-2xl font-bold bg-gradient-accent text-transparent bg-clip-text animate-pulse">
          SAGT CRM
        </h1>
      </div>
      <div className="glass-card p-8 flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
        <p className="text-text-secondary mt-4">Chargement en cours...</p>
      </div>
    </div>
  );
}

export default function App() {
  const { user, workspace, workspaceRole, initialize, isLoading } = useAuthStore();
  const isDark = useThemeStore(state => state.isDark);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark);
  }, [isDark]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthLayout />;
  }

  if (!workspace) {
    return <OnboardingLayout />;
  }

  return <AppLayout role={workspaceRole} />;
}
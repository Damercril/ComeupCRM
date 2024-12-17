import React from 'react';
import { LayoutDashboard, UserCog, Users, Settings } from 'lucide-react';
import type { ViewType } from '../../types';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  isOpen: boolean;
  onClose: () => void;
  role: 'admin' | 'operator' | null;
  isMobile: boolean;
}

export default function Sidebar({ 
  currentView, 
  setCurrentView, 
  isOpen, 
  onClose, 
  role,
  isMobile 
}: SidebarProps) {
  const handleViewChange = (view: ViewType) => {
    setCurrentView(view);
    if (isMobile) {
      onClose();
    }
  };

  return (
    <>
      {isOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity"
          onClick={onClose}
        />
      )}

      <aside className={`
        fixed lg:static inset-y-0 left-0 z-30
        w-72 bg-dark-lighter border-r border-white/10
        transform transition-transform duration-300 ease-in-out
        ${isOpen || !isMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          <div className="p-6">
            <div className="flex items-center space-x-3 mb-8">
              <LayoutDashboard className="w-8 h-8 text-accent" />
              <h1 className="text-2xl font-bold bg-gradient-accent text-transparent bg-clip-text">
                SAGT CRM
              </h1>
            </div>
            
            <nav className="space-y-2">
              <button
                onClick={() => handleViewChange('dashboard')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === 'dashboard'
                    ? 'glass-button active'
                    : 'glass-button'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span>Tableau de bord</span>
              </button>

              <button
                onClick={() => handleViewChange('operators')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === 'operators'
                    ? 'glass-button active'
                    : 'glass-button'
                }`}
              >
                <UserCog className="w-5 h-5 shrink-0" />
                <span>Opérateurs</span>
              </button>
              
              <button
                onClick={() => handleViewChange('drivers')}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                  currentView === 'drivers'
                    ? 'glass-button active'
                    : 'glass-button'
                }`}
              >
                <Users className="w-5 h-5 shrink-0" />
                <span>Chauffeurs</span>
              </button>

              {role === 'admin' && (
                <button
                  onClick={() => handleViewChange('workspace')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    currentView === 'workspace'
                      ? 'glass-button active'
                      : 'glass-button'
                  }`}
                >
                  <Settings className="w-5 h-5 shrink-0" />
                  <span>Workspace</span>
                </button>
              )}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}
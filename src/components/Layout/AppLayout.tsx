import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import DashboardView from '../Views/DashboardView';
import OperatorsView from '../Views/OperatorsView';
import DriversView from '../Views/DriversView';
import WorkspaceView from '../Views/WorkspaceView';
import OperatorLayout from './OperatorLayout';
import { ViewType } from '../../types';

interface AppLayoutProps {
  role: 'admin' | 'operator' | null;
}

export default function AppLayout({ role }: AppLayoutProps) {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  if (role === 'operator') {
    return <OperatorLayout />;
  }

  return (
    <div className="flex h-screen bg-dark overflow-hidden">
      <Sidebar 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
        isMobile={isMobile}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarOpen(true)} 
          isMobile={isMobile}
        />
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 max-w-7xl">
            {currentView === 'dashboard' && <DashboardView />}
            {currentView === 'operators' && <OperatorsView />}
            {currentView === 'drivers' && <DriversView />}
            {currentView === 'workspace' && <WorkspaceView />}
          </div>
        </main>
      </div>
    </div>
  );
}
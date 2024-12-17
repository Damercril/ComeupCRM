import React, { useState, useRef } from 'react';
import { Bell, Search, Settings, Menu, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useThemeStore } from '../../stores/themeStore';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';

interface HeaderProps {
  onMenuClick: () => void;
  isMobile: boolean;
}

export default function Header({ onMenuClick, isMobile }: HeaderProps) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const signOut = useAuthStore(state => state.signOut);
  const user = useAuthStore(state => state.user);
  const { isDark, toggleTheme } = useThemeStore();

  useOnClickOutside(menuRef, () => setProfileMenuOpen(false));

  const handleSignOut = async () => {
    await signOut();
  };

  const initials = user?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase() || 'U';

  return (
    <header className="sticky top-0 z-10 bg-dark-lighter/80 backdrop-blur-xl border-b border-white/10">
      <div className="px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-4">
          {isMobile && (
            <button 
              onClick={onMenuClick}
              className="glass-button shrink-0"
              aria-label="Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className={`relative flex-1 max-w-xl ${searchFocused ? 'z-20' : ''}`}>
            <input
              type="text"
              placeholder="Rechercher..."
              className="w-full pl-10 pr-4 py-2 glass-input"
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
            <Search className="w-5 h-5 text-white/50 absolute left-3 top-2.5" />
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button 
              onClick={toggleTheme}
              className="p-2 glass-button hidden sm:flex"
              title={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <button 
              className="p-2 glass-button relative hidden sm:flex"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
            </button>

            <button 
              className="p-2 glass-button hidden sm:flex"
              aria-label="Paramètres"
            >
              <Settings className="w-5 h-5" />
            </button>
            
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="h-10 w-10 glass-card flex items-center justify-center hover:border-accent/50 transition-colors"
                aria-label="Menu profil"
              >
                <span className="text-sm font-medium">{initials}</span>
              </button>

              {profileMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 sm:w-72 glass-card py-2">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-text-primary">{user?.full_name}</p>
                    <p className="text-xs text-text-secondary truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <button
                      onClick={handleSignOut}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-white/5 transition-colors flex items-center space-x-2 text-text-primary"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
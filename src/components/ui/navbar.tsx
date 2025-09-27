import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Users, Briefcase, User, LogOut, Sun, Moon, Code2 } from 'lucide-react';
import { Button } from './button';
import { GlassCard } from './glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Users, label: 'Feed', path: '/feed' },
    { icon: Briefcase, label: 'Projects', path: '/projects' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 p-4"
    >
      <GlassCard className="flex items-center justify-between" size="sm">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-primary rounded-lg">
            <Code2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            DevConnect
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "engineering" : "ghost"}
                  size="sm"
                  className={cn(
                    "flex items-center space-x-2",
                    isActive && "shadow-glass-active"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="hover:bg-glass"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>

          {/* User Info */}
          {user && (
            <div className="hidden md:flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                {user.profilePicUrl ? (
                  <img
                    src={user.profilePicUrl}
                    alt={user.username}
                    className="h-8 w-8 rounded-full border border-glass-border"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center">
                    <span className="text-xs font-medium text-primary-foreground">
                      {user.username.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="text-sm font-medium text-foreground">
                  {user.username}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={logout}
                className="hover:bg-destructive/10 hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </GlassCard>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 z-50">
        <GlassCard className="flex items-center justify-around" size="sm">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive ? "engineering" : "ghost"}
                  size="icon"
                  className={cn(
                    "flex flex-col items-center space-y-1 h-auto py-2 px-3",
                    isActive && "shadow-glass-active"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </GlassCard>
      </div>
    </motion.nav>
  );
};

export default Navbar;
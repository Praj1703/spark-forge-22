import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '@/components/ui/navbar';
import { useAuth } from '@/contexts/AuthContext';

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && <Navbar />}
      <main className={`${isAuthenticated ? 'pb-20 md:pb-8' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';

const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50">
      <Header />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;

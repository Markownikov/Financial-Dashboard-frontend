import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="layout-container">
      <Sidebar />
      <main className="main-content">
        <Navbar title={title} />
        <div className="page-container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;

import React, { useEffect, useState } from 'react';
import { Sun, Moon, Bell, Search } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC<{ title: string }> = ({ title }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>(
    (localStorage.getItem('theme') as 'dark' | 'light') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="navbar glass">
      <div className="navbar-left">
        <h1 className="page-title">{title}</h1>
      </div>

      <div className="navbar-right">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search transactions..." />
        </div>

        <div className="nav-actions">
          <button className="nav-btn theme-toggle" onClick={toggleTheme} title="Toggle Theme">
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <button className="nav-btn notification-btn" title="Notifications">
            <Bell size={20} />
            <span className="badge-dot"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

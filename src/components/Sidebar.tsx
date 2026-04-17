import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Receipt, 
  Users, 
  History, 
  Settings, 
  LogOut,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { name: 'Transactions', path: '/transactions', icon: Receipt, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
    { name: 'Users', path: '/users', icon: Users, roles: ['ADMIN'] },
    { name: 'Audit Logs', path: '/audit-logs', icon: History, roles: ['ADMIN'] },
    { name: 'Profile', path: '/profile', icon: Settings, roles: ['ADMIN', 'ANALYST', 'VIEWER'] },
  ];

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <aside className="sidebar glass">
      <div className="sidebar-header">
        <div className="logo-container">
          <TrendingUp size={32} className="logo-icon" />
          <span className="logo-text">FinancePro</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        <ul>
          {filteredNavItems.map((item) => (
            <li key={item.path}>
              <NavLink 
                to={item.path} 
                className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
              >
                <item.icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.name[0].toUpperCase()}</div>
          <div className="user-details">
            <p className="user-name">{user?.name}</p>
            <p className="user-role">{user?.role}</p>
          </div>
        </div>
        <button onClick={logout} className="logout-btn" title="Logout">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

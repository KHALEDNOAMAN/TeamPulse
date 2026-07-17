import { NavLink } from 'react-router-dom';
import { getInitials } from '../utils/helpers';

const navItems = [
  { path: '/', icon: '📊', label: 'Dashboard' },
  { path: '/okrs', icon: '🎯', label: 'OKRs' },
  { path: '/sprints', icon: '🏃', label: 'Sprints' },
  { path: '/team', icon: '👥', label: 'Team' },
  { path: '/meetings', icon: '📋', label: 'Meetings' },
  { path: '/retros', icon: '🔄', label: 'Retros' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="logo-icon">⚡</div>
        <h1>TeamPulse</h1>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-profile">
        <div
          className="profile-avatar"
          style={{ background: '#8b5cf6' }}
        >
          {getInitials('Khaled Baraya')}
        </div>
        <div className="profile-info">
          <span className="profile-name">Khaled Baraya</span>
          <span className="profile-role">Engineering Manager</span>
        </div>
      </div>
    </aside>
  );
}

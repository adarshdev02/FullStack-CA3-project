import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="app-nav">
      <Link className="logo" to="/dashboard">
        <span className="logo-badge">mb</span>
        <span className="logo-name">MealBridge</span>
      </Link>
      <nav className="app-navigation" aria-label="Main navigation">
        <NavLink to="/dashboard">Overview</NavLink>
        <NavLink to="/donations">{user?.role === 'donor' ? 'Donations' : 'Find food'}</NavLink>
        <NavLink to="/requests">{user?.role === 'donor' ? 'Requests' : 'My requests'}</NavLink>
      </nav>
      <div className="nav-right">
        <ThemeToggle />
        <span className="user-chip">{user?.name?.slice(0, 1).toUpperCase()}</span>
        <span className="user-name">{user?.name}</span>
        <button className="logout-button" onClick={logout}>Sign out</button>
      </div>
    </header>
  );
}

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="app-nav">
      <Link className="logo" to="/dashboard">food<span>rescue</span></Link>
      <div className="nav-right">
        <ThemeToggle />
        <span className="user-chip">{user?.name?.slice(0, 1).toUpperCase()}</span>
        <span className="user-name">{user?.name}</span>
        <button className="logout-button" onClick={logout}>Sign out</button>
      </div>
    </header>
  );
}

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ThemeToggle from '../components/ThemeToggle';

export default function AuthPage({ register = false }) {
  const { user, login, register: signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'donor', organizationName: '', city: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(location.state?.message || '');
  const update = (key) => (event) => setForm({ ...form, [key]: event.target.value });
  async function submit(event) {
    event.preventDefault(); setError('');
    try {
      if (register) {
        const data = await signUp(form);
        setSuccess(data.message);
        navigate('/login', { state: { message: data.message } });
        return;
      }
      const account = await login({ email: form.email, password: form.password });
      navigate('/dashboard');
    }
    catch (err) { setError(err.message); }
  }
  return <div className="auth-shell"><Link className="auth-back-link" to={user ? '/dashboard' : '/'}><span aria-hidden="true">←</span> Back to {user ? 'dashboard' : 'home'}</Link><div className="auth-theme-toggle"><ThemeToggle /></div><div className="auth-aside"><div className="brand-mark">fr</div><p className="eyebrow">FoodRescue</p><h1>Good food deserves a second chance.</h1><p>Connect surplus meals with the people and communities who need them most.</p></div><form className="auth-card" onSubmit={submit}><p className="eyebrow">Welcome to FoodRescue</p><h2>{register ? 'Create your account' : 'Welcome back'}</h2><p className="muted">{register ? 'Join the movement against food waste.' : 'Continue making an impact today.'}</p>{success && <div className="success-box">{success}</div>}{error && <div className="error-box">{error}</div>}{register && <><label>Full name<input required value={form.name} onChange={update('name')} placeholder="Your name" /></label><div className="role-picker"><button type="button" className={form.role === 'donor' ? 'selected' : ''} onClick={() => setForm({ ...form, role: 'donor' })}>I donate food</button><button type="button" className={form.role === 'ngo' ? 'selected' : ''} onClick={() => setForm({ ...form, role: 'ngo' })}>I receive food</button></div><label>Organization name<input value={form.organizationName} onChange={update('organizationName')} placeholder="Optional" /></label></>}<label>Email address<input required type="email" value={form.email} onChange={update('email')} placeholder="you@example.com" /></label><label>Password<input required minLength="6" type="password" value={form.password} onChange={update('password')} placeholder="At least 6 characters" /></label><button className="primary-button wide">{register ? 'Create account' : 'Sign in'} <span>→</span></button><p className="auth-link">{register ? 'Already have an account?' : 'New to FoodRescue?'} <Link to={register ? '/login' : '/register'}>{register ? 'Sign in' : 'Create one'}</Link></p></form></div>;
}

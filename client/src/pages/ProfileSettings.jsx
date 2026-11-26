import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    name: user.name || '',
    phone: user.phone || '',
    city: user.city || ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  function update(field) {
    return (event) => setForm({ ...form, [field]: event.target.value });
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      await updateProfile(form);
      setSuccess('Profile saved. Smart Matches will use your updated city.');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <Layout>
      <div className="page-heading">
        <div>
          <p className="eyebrow">Your account</p>
          <h1>Profile settings</h1>
          <p className="muted">Update your details and the city used for local food matches.</p>
        </div>
        <Link className="secondary-button" to="/dashboard">Back to overview</Link>
      </div>

      <form className="panel profile-settings-form" onSubmit={submit}>
        <div className="profile-settings-intro">
          <span className="profile-role">{user.role === 'ngo' ? 'NGO / Recipient' : 'Food donor'}</span>
          <h2>Personal details</h2>
        </div>
        {error && <div className="error-box">{error}</div>}
        {success && <div className="success-box">{success}</div>}

        <div className="profile-fields">
          <label>
            Full name
            <input required minLength="2" value={form.name} onChange={update('name')} autoComplete="name" />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={update('phone')} autoComplete="tel" />
          </label>
          <label className="profile-city-field">
            City {user.role === 'ngo' ? '(required for Smart Matches)' : '(optional)'}
            <input
              required={user.role === 'ngo'}
              value={form.city}
              onChange={update('city')}
              autoComplete="address-level2"
              placeholder="Your city"
            />
          </label>
        </div>

        {user.role === 'ngo' && (
          <p className="profile-city-help">MealBridge uses this city to rank local donations ahead of other listings. It does not use GPS.</p>
        )}
        <button className="primary-button" type="submit">Save changes</button>
      </form>
    </Layout>
  );
}

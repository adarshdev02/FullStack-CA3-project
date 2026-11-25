import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const initial = { title: '', description: '', category: 'Cooked Meals', quantity: 1, unit: 'meal boxes', preparedAt: '', pickupDeadline: '', pickupAddress: '', city: '', postalCode: '', allergens: '' };
export default function Donations() {
  const { user } = useAuth(); const [search] = useSearchParams(); const [items, setItems] = useState([]); const [form, setForm] = useState(initial); const [showForm, setShowForm] = useState(search.get('create') === 'true'); const [query, setQuery] = useState(''); const [error, setError] = useState(''); const [success, setSuccess] = useState(''); const [requestDonation, setRequestDonation] = useState(null); const [requestedQuantity, setRequestedQuantity] = useState(1);
  async function load() { const data = await api(user.role === 'donor' ? '/donations/my' : `/donations?city=${encodeURIComponent(query)}`); setItems(data); }
  useEffect(() => { load().catch((e) => setError(e.message)); }, [user.role]);
  async function submit(e) { e.preventDefault(); setError(''); try { await api('/donations', { method: 'POST', body: JSON.stringify(form) }); setForm(initial); setShowForm(false); load(); } catch (e) { setError(e.message); } }
  async function openRequest(item) {
    setRequestDonation(item);
    setRequestedQuantity(Math.min(1, item.remainingQuantity));
    setError('');
    setSuccess('');
  }
  async function submitRequest(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const quantity = Number(requestedQuantity);
    if (!requestDonation || quantity < 1 || quantity > requestDonation.remainingQuantity) {
      setError(`Enter a quantity between 1 and ${requestDonation?.remainingQuantity || 0}.`);
      return;
    }
    try {
      await api('/requests', {
        method: 'POST',
        body: JSON.stringify({
          donationId: requestDonation._id,
          requestedQuantity: quantity,
          beneficiaries: quantity,
          message: 'We would be grateful to collect this donation.'
        })
      });
      setRequestDonation(null);
      setSuccess('Food request submitted. Track it under My requests.');
      await load();
    } catch (e) {
      setError(e.message);
    }
  }
  return <Layout>
    <div className="page-heading">
      <div><p className="eyebrow">{user.role === 'donor' ? 'Your food listings' : 'Discover surplus food'}</p><h1>{user.role === 'donor' ? 'My donations' : 'Available near you'}</h1></div>
      {user.role === 'donor'
        ? <button className="primary-button" onClick={() => setShowForm(!showForm)}>+ Add donation</button>
        : <div className="search-box"><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by city..." /><button onClick={() => load()}>Search</button></div>}
    </div>
    {success && <div className="success-box">{success}</div>}
    {showForm && <form className="panel donation-form" onSubmit={submit}>
      <h2>List surplus food</h2>{error && <div className="error-box">{error}</div>}
      <div className="form-grid">
        {[['title','Food title','text'],['quantity','Quantity','number'],['unit','Unit','text'],['city','City','text'],['pickupAddress','Pickup address','text'],['preparedAt','Prepared at','datetime-local'],['pickupDeadline','Pickup deadline','datetime-local']].map(([key,label,type]) =>
          <label key={key}>{label}<input required type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} /></label>)}
        <label>Category<select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{['Cooked Meals','Bakery Items','Fruits','Vegetables','Packaged Food','Dairy Products','Other'].map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="span-two">Description<textarea required value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
      </div>
      <button className="primary-button">Publish donation →</button>
    </form>}
    {requestDonation && <form className="panel donation-form" onSubmit={submitRequest}>
      <h2>Request {requestDonation.title}</h2>
      {error && <div className="error-box">{error}</div>}
      <div className="form-grid">
        <label>Quantity<input required type="number" min="1" max={requestDonation.remainingQuantity} value={requestedQuantity} onChange={e => setRequestedQuantity(e.target.value)} /></label>
        <label>Available<strong>{requestDonation.remainingQuantity} {requestDonation.unit}</strong></label>
      </div>
      <button className="primary-button" type="submit">Submit request →</button>{' '}
      <button className="secondary-button" type="button" onClick={() => setRequestDonation(null)}>Cancel</button>
    </form>}
    <div className="donation-grid">
      {items.map((item) => <article className="donation-card" key={item._id}>
        <div className="donation-image">{item.category === 'Fruits' ? '🍎' : item.category === 'Bakery Items' ? '🥐' : '🥗'}<span className={`status ${item.status}`}>{item.status}</span></div>
        <div className="donation-content">
          <p className="eyebrow">{item.category}</p><h3>{item.title}</h3><p className="muted">{item.description}</p>
          <div className="donation-meta"><span>◷ {item.remainingQuantity} {item.unit} left</span><span>⌖ {item.city}</span></div>
          {user.role === 'ngo' && <button className="primary-button small" onClick={() => openRequest(item)}>Request food</button>}
        </div>
      </article>)}
    </div>
    {!items.length && !showForm && <div className="empty panel">No donations found. Try another city or check back soon.</div>}
  </Layout>;
}

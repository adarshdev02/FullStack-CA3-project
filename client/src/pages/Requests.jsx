import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
export default function Requests() {
  const { user } = useAuth(); const [requests, setRequests] = useState([]); const [error, setError] = useState('');
  async function load() { setRequests(await api(user.role === 'donor' ? '/requests/received' : '/requests/my')); }
  useEffect(() => { load().catch(e => setError(e.message)); }, []);
  async function status(id, value) { try { await api(`/requests/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: value }) }); load(); } catch (e) { setError(e.message); } }
  return <Layout><div className="page-heading"><div><p className="eyebrow">Track the handoff</p><h1>{user.role === 'donor' ? 'Donation requests' : 'My food requests'}</h1></div></div>{error && <div className="error-box">{error}</div>}<section className="panel request-list">{requests.map(r => <div className="request-row" key={r._id}><div><strong>{r.donation?.title || 'Donation'}</strong><p className="muted">{user.role === 'donor' ? `${r.ngo?.organizationName || r.ngo?.name} · ${r.requestedQuantity} ${r.donation?.unit || 'items'}` : `${r.donation?.city} · ${r.requestedQuantity} ${r.donation?.unit || 'items'}`}</p></div><span className={`status ${r.status}`}>{r.status}</span><div className="request-actions">{user.role === 'donor' && r.status === 'pending' && <><button onClick={() => status(r._id, 'approved')}>Approve</button><button onClick={() => status(r._id, 'rejected')}>Reject</button></>}{user.role === 'donor' && r.status === 'approved' && <button onClick={() => status(r._id, 'completed')}>Mark collected</button>}{user.role === 'ngo' && r.status === 'pending' && <button onClick={() => status(r._id, 'cancelled')}>Cancel</button>}</div></div>)}{!requests.length && <p className="empty">No requests yet.</p>}</section></Layout>;
}

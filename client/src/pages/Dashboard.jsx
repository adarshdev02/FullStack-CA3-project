import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import { api } from '../services/api';

export default function Dashboard() {
  const { user } = useAuth(); const [items, setItems] = useState([]); const [requests, setRequests] = useState([]);
  useEffect(() => { Promise.all([api(user.role === 'donor' ? '/donations/my' : '/donations'), api(user.role === 'donor' ? '/requests/received' : '/requests/my')]).then(([d, r]) => { setItems(d); setRequests(r); }).catch(() => {}); }, [user.role]);
  const completed = requests.filter((r) => r.status === 'completed').length;
  const greeting = 'Welcome back';
  const firstName = user.name.split(' ')[0];
  const actionHref = user.role === 'donor' ? '/donations?create=true' : '/donations';

  return (
    <Layout>
      <div className="overview">
        <section className="overview-hero">
          <div className="overview-copy">
            <p className="overview-kicker">MEALBRIDGE / COMMUNITY EXCHANGE</p>
            <p className="overview-greeting">{greeting}, {firstName}</p>
            <h1>{user.role === 'donor' ? 'Good food has somewhere to go.' : 'Find good food close to home.'}</h1>
            <p>{user.role === 'donor'
              ? 'Share what you have. Your neighborhood can put it to good use.'
              : 'Explore available food and connect with nearby donors.'}</p>
            <Link className="overview-action" to={actionHref}>
              {user.role === 'donor' ? 'List surplus food' : 'Browse available food'} <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="overview-stamp" aria-hidden="true">
            <span>GOOD FOOD</span>
            <strong>↗</strong>
            <span>KEEPS MOVING</span>
          </div>
        </section>

        <section className="overview-snapshot" aria-label="Community activity">
          <div className="snapshot-heading">
            <p>YOUR COMMUNITY, AT A GLANCE</p>
            <span>Activity snapshot</span>
          </div>
          <div className="snapshot-metrics">
            <div className="snapshot-metric">
              <strong>{items.length}</strong>
              <span>{user.role === 'donor' ? 'Your listings' : 'Food available'}</span>
            </div>
            <div className="snapshot-metric">
              <strong>{requests.length}</strong>
              <span>{user.role === 'donor' ? 'Requests received' : 'Your requests'}</span>
            </div>
            <div className="snapshot-metric">
              <strong>{completed * 4}</strong>
              <span>Meals estimated rescued</span>
            </div>
          </div>
        </section>

        <div className="overview-columns">
          <section className="overview-feed">
            <div className="overview-section-heading">
              <div>
                <p className="overview-kicker">ON THE MOVE</p>
                <h2>{user.role === 'donor' ? 'Your latest listings' : 'Food near you'}</h2>
              </div>
              <Link to="/donations">All listings <span aria-hidden="true">→</span></Link>
            </div>
            {items.slice(0, 4).map((item) => (
              <article className="overview-food-row" key={item._id}>
                <span className="overview-food-icon" aria-hidden="true">
                  {item.category === 'Fruits' ? '🍎' : item.category === 'Bakery Items' ? '🥐' : '🥗'}
                </span>
                <div className="overview-food-detail">
                  <strong>{item.title}</strong>
                  <span>{item.city} · {item.quantity} {item.unit}</span>
                </div>
                <span className={`overview-status ${item.status}`}>{item.status}</span>
              </article>
            ))}
            {!items.length && (
              <p className="overview-empty">
                {user.role === 'ngo' ? 'No food listings yet. Check back soon.' : 'Your first listing can start a local food connection.'}
              </p>
            )}
          </section>

          <aside className="overview-requests">
            <div className="overview-section-heading">
              <div>
                <p className="overview-kicker">HANDOFFS</p>
                <h2>Request pulse</h2>
              </div>
              <Link to="/requests" aria-label="View all requests">→</Link>
            </div>
            {requests.slice(0, 3).map((request) => (
              <div className="overview-request-row" key={request._id}>
                <span className={`request-indicator ${request.status}`} />
                <div>
                  <strong>{request.donation?.title || 'Food request'}</strong>
                  <span>{request.status}</span>
                </div>
              </div>
            ))}
            {!requests.length && <p className="overview-empty">No requests yet. New activity will show up here.</p>}
            <Link className="overview-request-link" to="/requests">Open request center <span aria-hidden="true">↗</span></Link>
          </aside>
        </div>
      </div>
    </Layout>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/users')
      .then((res) => setUsers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load students'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center">Loading…</div>;

  return (
    <div className="page">
      <h2>Browse students</h2>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {users.map((u) => (
          <div className="user-card" key={u._id}>
            {u.profile?.pictureUrl ? (
              <img className="avatar" src={u.profile.pictureUrl} alt={u.fullname} />
            ) : (
              <div className="avatar avatar-fallback">{u.fullname?.[0]}</div>
            )}
            <h3>{u.fullname}</h3>
            <p>
              {u.personalInfo?.department} · Year {u.personalInfo?.yearOfStudy}
            </p>
            <p className="muted">{u.roomPreferences?.preferredLocation}</p>
          </div>
        ))}
        {users.length === 0 && (
          <p className="muted">No other students have finished setting up their profile yet.</p>
        )}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Matches() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/matches')
      .then((res) => setMatches(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load matches'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="page-center">Loading…</div>;

  return (
    <div className="page">
      <h2>Your best matches</h2>
      <p className="muted small">
        Scored against your room and roommate preferences — the closer to
        100%, the more you have in common.
      </p>
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {matches.map(({ user, score }) => (
          <div className="user-card" key={user._id}>
            <div className={`score-badge score-${scoreTier(score)}`}>{score}% match</div>
            {user.profile?.pictureUrl ? (
              <img className="avatar" src={user.profile.pictureUrl} alt={user.fullname} />
            ) : (
              <div className="avatar avatar-fallback">{user.fullname?.[0]}</div>
            )}
            <h3>{user.fullname}</h3>
            <p>
              {user.personalInfo?.department} · Year {user.personalInfo?.yearOfStudy}
            </p>
            <p className="muted">{user.roommatePreferences?.sleepSchedule}</p>
            {user.profile?.introduction && <p className="bio">{user.profile.introduction}</p>}
          </div>
        ))}
        {matches.length === 0 && (
          <p className="muted">No matches yet — check back once more students join.</p>
        )}
      </div>
    </div>
  );
}

function scoreTier(score) {
  if (score >= 70) return 'high';
  if (score >= 40) return 'mid';
  return 'low';
}

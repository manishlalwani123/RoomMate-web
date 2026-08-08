import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MyProfile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="page">
      <h2>My profile</h2>
      <div className="card profile-card">
        {user.profile?.pictureUrl ? (
          <img className="avatar avatar-lg" src={user.profile.pictureUrl} alt={user.fullname} />
        ) : (
          <div className="avatar avatar-lg avatar-fallback">{user.fullname?.[0]}</div>
        )}
        <h3>{user.fullname}</h3>
        <p className="muted">{user.email}</p>
        {user.profile?.introduction && <p className="bio">{user.profile.introduction}</p>}

        <hr />

        <h4>Personal info</h4>
        <p>
          {user.personalInfo?.department}, Year {user.personalInfo?.yearOfStudy}
        </p>
        <p>
          {user.personalInfo?.phone} · {user.personalInfo?.gender}
        </p>
        <p>
          {user.personalInfo?.district}, {user.personalInfo?.state}
        </p>

        <h4>Room preferences</h4>
        <p>
          {user.roomPreferences?.accommodationType} in {user.roomPreferences?.preferredLocation}
        </p>
        <p>
          Budget: ₹{user.roomPreferences?.rentBudget} · BHK: {user.roomPreferences?.bhk} ·
          Roommates: {user.roomPreferences?.numRoommates}
        </p>
        <p>Amenities: {(user.roomPreferences?.amenities || []).join(', ') || '—'}</p>

        <h4>My habits (used for matching)</h4>
        <p>
          {user.roommatePreferences?.department}, Year {user.roommatePreferences?.yearOfStudy}
        </p>
        <p>
          Sleep schedule: {user.roommatePreferences?.sleepSchedule} · Looking for:{' '}
          {user.roommatePreferences?.gender}
        </p>

        <Link to="/personal-info" className="btn-outline edit-link">
          Edit details
        </Link>
      </div>
    </div>
  );
}

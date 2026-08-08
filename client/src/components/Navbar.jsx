import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        <span className="brand-mark">RH</span> RoomMateHub
      </Link>
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Browse</Link>
            <Link to="/matches">Matches</Link>
            <Link to="/my-profile">My profile</Link>
            <button className="link-btn" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Log in</Link>
            <Link to="/signup" className="btn-small">
              Sign up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

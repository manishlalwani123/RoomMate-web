import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <p className="eyebrow">Campus housing, sorted</p>
      <h1>Find a roommate who actually fits your routine.</h1>
      <p className="landing-sub">
        Set your room budget and habits once. RoomMateHub scores every other
        student on campus against them, so you spend less time messaging
        strangers and more time moving in.
      </p>
      <div className="landing-actions">
        <Link to="/signup" className="btn-primary">
          Create your profile
        </Link>
        <Link to="/login" className="btn-outline">
          I already have an account
        </Link>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StepProgress from '../components/StepProgress';

export default function RoommatePreferences() {
  const { user, updateUser } = useAuth();
  const existing = user?.roommatePreferences || {};
  const [form, setForm] = useState({
    department: existing.department || '',
    yearOfStudy: existing.yearOfStudy || '',
    sleepSchedule: existing.sleepSchedule || '',
    gender: existing.gender || 'Any',
    state: existing.state || '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put('/users/roommate-preferences', form);
      updateUser(res.data);
      navigate('/profile-setup');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="form-page">
      <StepProgress step={3} />
      <form className="card" onSubmit={handleSubmit}>
        <h2>Your own habits</h2>
        <p className="muted small">
          These are used to match you with roommates who fit — fill them in
          about yourself, not who you're looking for.
        </p>
        {error && <p className="error">{error}</p>}

        <label>Department</label>
        <input name="department" value={form.department} onChange={handleChange} required />

        <label>Year of study</label>
        <input
          type="number"
          name="yearOfStudy"
          min="1"
          max="6"
          value={form.yearOfStudy}
          onChange={handleChange}
          required
        />

        <label>Sleep schedule</label>
        <select name="sleepSchedule" value={form.sleepSchedule} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Early bird</option>
          <option>Night owl</option>
          <option>Flexible</option>
        </select>

        <label>Preferred roommate gender</label>
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option>Any</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>Home state</label>
        <input name="state" value={form.state} onChange={handleChange} required />

        <button className="btn-primary">Continue</button>
      </form>
    </div>
  );
}

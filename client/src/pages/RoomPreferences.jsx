import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StepProgress from '../components/StepProgress';

const AMENITIES = ['WiFi', 'Air conditioning', 'Furnished', 'Laundry', 'Parking'];

export default function RoomPreferences() {
  const { user, updateUser } = useAuth();
  const existing = user?.roomPreferences || {};
  const [form, setForm] = useState({
    accommodationType: existing.accommodationType || '',
    preferredLocation: existing.preferredLocation || '',
    rentBudget: existing.rentBudget || '',
    numRoommates: existing.numRoommates || '',
    bhk: existing.bhk || '',
    amenities: existing.amenities || [],
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a)
        ? f.amenities.filter((x) => x !== a)
        : [...f.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put('/users/room-preferences', form);
      updateUser(res.data);
      navigate('/roommate-preferences');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="form-page">
      <StepProgress step={2} />
      <form className="card" onSubmit={handleSubmit}>
        <h2>Room preferences</h2>
        {error && <p className="error">{error}</p>}

        <label>Accommodation type</label>
        <select
          name="accommodationType"
          value={form.accommodationType}
          onChange={handleChange}
          required
        >
          <option value="">Select</option>
          <option>Hostel</option>
          <option>PG</option>
          <option>Apartment</option>
        </select>

        <label>Preferred location</label>
        <input
          name="preferredLocation"
          value={form.preferredLocation}
          onChange={handleChange}
          required
        />

        <label>Rent budget (per month)</label>
        <input
          type="number"
          name="rentBudget"
          value={form.rentBudget}
          onChange={handleChange}
          required
        />

        <label>Number of roommates</label>
        <input
          type="number"
          name="numRoommates"
          min="1"
          value={form.numRoommates}
          onChange={handleChange}
          required
        />

        <label>BHK</label>
        <input type="number" name="bhk" min="1" value={form.bhk} onChange={handleChange} required />

        <label>Amenities</label>
        <div className="checkbox-row">
          {AMENITIES.map((a) => (
            <label key={a} className="checkbox-pill">
              <input
                type="checkbox"
                checked={form.amenities.includes(a)}
                onChange={() => toggleAmenity(a)}
              />
              {a}
            </label>
          ))}
        </div>

        <button className="btn-primary">Continue</button>
      </form>
    </div>
  );
}

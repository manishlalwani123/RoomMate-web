import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StepProgress from '../components/StepProgress';

export default function PersonalInfo() {
  const { user, updateUser } = useAuth();
  const existing = user?.personalInfo || {};
  const [form, setForm] = useState({
    department: existing.department || '',
    yearOfStudy: existing.yearOfStudy || '',
    phone: existing.phone || '',
    gender: existing.gender || '',
    dob: existing.dob ? existing.dob.slice(0, 10) : '',
    district: existing.district || '',
    state: existing.state || '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.put('/users/personal-info', form);
      updateUser(res.data);
      navigate('/room-preferences');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="form-page">
      <StepProgress step={1} />
      <form className="card" onSubmit={handleSubmit}>
        <h2>Personal information</h2>
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

        <label>Phone number</label>
        <input name="phone" value={form.phone} onChange={handleChange} required />

        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={handleChange} required>
          <option value="">Select</option>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>

        <label>Date of birth</label>
        <input type="date" name="dob" value={form.dob} onChange={handleChange} required />

        <label>District</label>
        <input name="district" value={form.district} onChange={handleChange} required />

        <label>State</label>
        <input name="state" value={form.state} onChange={handleChange} required />

        <button className="btn-primary">Continue</button>
      </form>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StepProgress from '../components/StepProgress';

export default function ProfileSetup() {
  const { user, updateUser } = useAuth();
  const [introduction, setIntroduction] = useState(user?.profile?.introduction || '');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('introduction', introduction);
      if (file) fd.append('profilePicture', file);

      const res = await api.put('/users/profile', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      updateUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-page">
      <StepProgress step={4} />
      <form className="card" onSubmit={handleSubmit}>
        <h2>Introduce yourself</h2>
        {error && <p className="error">{error}</p>}

        <label>Short bio</label>
        <textarea
          rows={4}
          value={introduction}
          onChange={(e) => setIntroduction(e.target.value)}
          placeholder="What should a future roommate know about you?"
          required
        />

        <label>Profile picture (optional)</label>
        <input
          type="file"
          accept="image/png, image/jpeg, image/gif"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button className="btn-primary" disabled={loading}>
          {loading ? 'Saving…' : 'Finish setup'}
        </button>
      </form>
    </div>
  );
}

import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import PersonalInfo from './pages/PersonalInfo';
import RoomPreferences from './pages/RoomPreferences';
import RoommatePreferences from './pages/RoommatePreferences';
import ProfileSetup from './pages/ProfileSetup';
import Dashboard from './pages/Dashboard';
import Matches from './pages/Matches';
import MyProfile from './pages/MyProfile';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/personal-info"
            element={
              <ProtectedRoute>
                <PersonalInfo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/room-preferences"
            element={
              <ProtectedRoute>
                <RoomPreferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roommate-preferences"
            element={
              <ProtectedRoute>
                <RoommatePreferences />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile-setup"
            element={
              <ProtectedRoute>
                <ProfileSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/matches"
            element={
              <ProtectedRoute>
                <Matches />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-profile"
            element={
              <ProtectedRoute>
                <MyProfile />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </>
  );
}

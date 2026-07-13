import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <main className="dashboard-page">
      <section className="dashboard-card">
        <h1>Welcome, {user?.displayName}</h1>
        <p>You are logged in as {user?.email}</p>
        <p className="dashboard-role">Role: {user?.roles.join(', ')}</p>
        <button type="button" className="auth-submit dashboard-logout" onClick={handleLogout}>
          Logout
        </button>
      </section>
    </main>
  );
}

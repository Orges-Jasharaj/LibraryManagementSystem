import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/dashboard.css';

export function DashboardLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <div className="dash-brand">
          <span className="dash-brand-icon">📚</span>
          <div>
            <strong>Library Management System</strong>
            <small>Personal Library</small>
          </div>
        </div>

        <nav className="dash-nav">
          {!isAdmin && (
            <NavLink to="/library" className="dash-nav-link">
              My Shelf
            </NavLink>
          )}
          {isAdmin && (
            <>
              <NavLink to="/admin" end className="dash-nav-link">
                Overview
              </NavLink>
              <NavLink to="/admin/users" className="dash-nav-link">
                Users
              </NavLink>
              <NavLink to="/admin/books" className="dash-nav-link">
                All Books
              </NavLink>
            </>
          )}
          <NavLink to="/profile" className="dash-nav-link">
            My Account
          </NavLink>
        </nav>

        <div className="dash-sidebar-footer">
          <div className="dash-user-chip">
            <span className="dash-avatar">{user?.displayName.charAt(0)}</span>
            <div>
              <strong>{user?.displayName}</strong>
              <small>{isAdmin ? 'Administrator' : 'Reader'}</small>
            </div>
          </div>
          <button type="button" className="dash-logout" onClick={handleLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="dash-main">
        <Outlet />
      </div>
    </div>
  );
}

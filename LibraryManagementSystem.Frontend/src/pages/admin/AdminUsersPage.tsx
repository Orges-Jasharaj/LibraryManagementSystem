import { useEffect, useState } from 'react';
import {
  deactivateUser,
  getUsers,
  reactivateUser,
  updateUserRole,
} from '../../api/userApi';
import { Pagination } from '../../components/Pagination';
import type { User } from '../../types/api';
import { PAGE_SIZE } from '../../utils/pagination';

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadUsers = async (page = pageNumber) => {
    setLoading(true);
    const result = await getUsers(page, PAGE_SIZE);
    if (result.success && result.data) {
      setUsers(result.data.data);
      setPageNumber(result.data.pageNumber);
      setTotalPages(result.data.totalPages);
      setTotalCount(result.data.totalCount);
      setError('');
    } else {
      setError(result.message ?? 'Failed to load users');
    }
    setLoading(false);
  };

  useEffect(() => {
    void loadUsers(pageNumber);
  }, [pageNumber]);

  const handleDeactivate = async (userId: string) => {
    if (!confirm('Deactivate this user?')) return;
    const result = await deactivateUser(userId);
    if (!result.success) {
      setError(result.message ?? 'Failed');
      return;
    }
    setMessage('User deactivated');
    void loadUsers(pageNumber);
  };

  const handleReactivate = async (userId: string) => {
    const result = await reactivateUser(userId);
    if (!result.success) {
      setError(result.message ?? 'Failed');
      return;
    }
    setMessage('User reactivated');
    void loadUsers(pageNumber);
  };

  const handleRoleChange = async (userId: string, role: string) => {
    const result = await updateUserRole(userId, role);
    if (!result.success) {
      setError(result.message ?? 'Role update failed');
      return;
    }
    setMessage(`Role updated to ${role}`);
    void loadUsers(pageNumber);
  };

  return (
    <div className="dash-content">
      <header className="dash-header">
        <div>
          <h1>Users</h1>
          <p>Manage accounts and roles</p>
        </div>
      </header>

      {message && <p className="dash-msg success">{message}</p>}
      {error && <p className="dash-msg error">{error}</p>}

      {loading ? (
        <p className="dash-empty">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="dash-empty">No users found.</p>
      ) : (
        <>
          <section className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.firstName} {user.lastName}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.roles[0] ?? 'User'}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      >
                        <option value="User">User</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <span className={user.isActive ? 'badge-active' : 'badge-inactive'}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="table-actions">
                      {user.isActive ? (
                        <button type="button" className="danger" onClick={() => handleDeactivate(user.id)}>
                          Deactivate
                        </button>
                      ) : (
                        <button type="button" onClick={() => handleReactivate(user.id)}>
                          Reactivate
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
          <Pagination
            pageNumber={pageNumber}
            pageSize={PAGE_SIZE}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </>
      )}
    </div>
  );
}

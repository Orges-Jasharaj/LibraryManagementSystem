import { useEffect, useRef, useState, type FormEvent } from 'react';
import { registerUserWithRole } from '../../api/authApi';
import {
  deactivateUser,
  getUsers,
  reactivateUser,
  updateUserRole,
} from '../../api/userApi';
import { Pagination } from '../../components/Pagination';
import { SearchBar } from '../../components/SearchBar';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import type { User } from '../../types/api';
import { USER_PAGE_SIZE } from '../../utils/pagination';

const emptyForm = {
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  email: '',
  password: '',
  role: 'User',
};

export function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput, 400);
  const [roleFilter, setRoleFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const hasLoadedRef = useRef(false);

  const loadUsers = async (
    page = pageNumber,
    term = debouncedSearch,
    role = roleFilter,
    sort = sortOrder,
  ) => {
    if (!hasLoadedRef.current) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    const roleParam = role === 'all' ? '' : role;
    const result = await getUsers(page, USER_PAGE_SIZE, term, roleParam, sort);
    if (result.success && result.data) {
      setUsers(result.data.data);
      setPageNumber(result.data.pageNumber);
      setTotalPages(result.data.totalPages);
      setTotalCount(result.data.totalCount);
      setError('');
    } else {
      setError(result.message ?? 'Failed to load users');
    }

    hasLoadedRef.current = true;
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    void loadUsers(pageNumber, debouncedSearch, roleFilter, sortOrder);
  }, [pageNumber, debouncedSearch, roleFilter, sortOrder]);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    setPageNumber(1);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setPageNumber(1);
  };

  const handleSortOrderChange = (value: 'newest' | 'oldest') => {
    setSortOrder(value);
    setPageNumber(1);
  };

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');

    const result = await registerUserWithRole(
      {
        firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: new Date(form.dateOfBirth).toISOString(),
        email: form.email,
        password: form.password,
      },
      form.role,
    );

    if (!result.success) {
      const validationError = result.errors?.[0]?.errorMessage;
      setError(validationError ?? result.message ?? 'Failed to create user');
      return;
    }

    setMessage(`User created as ${form.role}`);
    setForm(emptyForm);
    setShowForm(false);
    setPageNumber(1);
    void loadUsers(1);
  };

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
        <button
          type="button"
          className="dash-btn-primary"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? 'Cancel' : '+ Add User'}
        </button>
      </header>

      {message && <p className="dash-msg success">{message}</p>}
      {error && <p className="dash-msg error">{error}</p>}

      <section className="dash-toolbar">
        <SearchBar
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search by name or email..."
        />
        <label>
          Role
          <select value={roleFilter} onChange={(e) => handleRoleFilterChange(e.target.value)}>
            <option value="all">All roles</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </label>
        <label>
          Registered
          <select
            value={sortOrder}
            onChange={(e) => handleSortOrderChange(e.target.value as 'newest' | 'oldest')}
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </section>

      {showForm && (
        <section className="dash-panel">
          <h2>Create User</h2>
          <form className="dash-form admin-user-form" onSubmit={handleCreateUser}>
            <input
              placeholder="First name"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
            <input
              placeholder="Last name"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            <select
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="dash-form-actions">
              <button type="submit" className="dash-btn-primary">Create user</button>
            </div>
          </form>
        </section>
      )}

      {loading ? (
        <p className="dash-empty">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="dash-empty">
          {debouncedSearch || roleFilter !== 'all'
            ? 'No users match your filters.'
            : 'No users found.'}
        </p>
      ) : (
        <div className={`list-area${refreshing ? ' is-refreshing' : ''}`}>
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
            pageSize={USER_PAGE_SIZE}
            totalCount={totalCount}
            totalPages={totalPages}
            onPageChange={setPageNumber}
          />
        </div>
      )}
    </div>
  );
}

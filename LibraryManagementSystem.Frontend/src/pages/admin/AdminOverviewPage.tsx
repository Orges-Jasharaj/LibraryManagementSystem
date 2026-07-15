import { useEffect, useState } from 'react';
import { getBooks } from '../../api/bookApi';
import { getUsers } from '../../api/userApi';

export function AdminOverviewPage() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalBooks, setTotalBooks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [usersRes, booksRes] = await Promise.all([
        getUsers(1, 1),
        getBooks(1, 1),
      ]);
      if (usersRes.success && usersRes.data) setTotalUsers(usersRes.data.totalCount);
      if (booksRes.success && booksRes.data) setTotalBooks(booksRes.data.totalCount);
      setLoading(false);
    };
    void load();
  }, []);

  return (
    <div className="dash-content">
      <header className="dash-header">
        <div>
          <h1>Admin Overview</h1>
          <p>System-wide library statistics</p>
        </div>
      </header>

      {loading ? (
        <p className="dash-empty">Loading overview...</p>
      ) : (
        <section className="dash-stats admin-stats">
          <article className="stat-card accent">
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
          </article>
          <article className="stat-card">
            <span>Total Books</span>
            <strong>{totalBooks}</strong>
          </article>
        </section>
      )}
    </div>
  );
}

import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/authApi';
import { AuthLayout } from '../components/auth/AuthLayout';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    const result = await register({
      ...form,
      dateOfBirth: new Date(form.dateOfBirth).toISOString(),
    });

    if (result.success) {
      navigate('/login');
      return;
    }

    const validationError = result.errors?.[0]?.errorMessage;
    setError(validationError ?? result.message ?? 'Registration failed.');
    setLoading(false);
  };

  return (
    <AuthLayout>
      <div className="auth-header">
        <h1>Create Account</h1>
        <p>Start building your personal library</p>
      </div>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="auth-grid">
          <label className="auth-field">
            <span>First name</span>
            <input
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              required
            />
          </label>

          <label className="auth-field">
            <span>Last name</span>
            <input
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              required
            />
          </label>
        </div>

        <label className="auth-field">
          <span>Date of birth</span>
          <input
            type="date"
            value={form.dateOfBirth}
            onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
            required
          />
        </label>

        <label className="auth-field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>

        <label className="auth-field">
          <span>Password</span>
          <input
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button type="submit" className="auth-submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span>
        <Link to="/login">Login</Link>
      </div>
    </AuthLayout>
  );
}

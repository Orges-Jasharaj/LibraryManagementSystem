import { useEffect, useState, type FormEvent } from 'react';
import { saveAuth } from '../api/client';
import { changePassword, getMyProfile, updateMyProfile } from '../api/userApi';
import { useAuth } from '../context/AuthContext';

function toDateInputValue(iso: string) {
  return iso.split('T')[0];
}

export function ProfilePage() {
  const { user, setUser } = useAuth();
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    email: '',
  });
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [profileMessage, setProfileMessage] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const result = await getMyProfile();
      if (result.success && result.data) {
        setProfileForm({
          firstName: result.data.firstName,
          lastName: result.data.lastName,
          dateOfBirth: toDateInputValue(result.data.dateOfBirth),
          email: result.data.email,
        });
      } else {
        setProfileError(result.message ?? 'Failed to load profile');
      }
      setLoading(false);
    };
    void load();
  }, []);

  const handleProfileSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setProfileMessage('');
    setProfileError('');

    const result = await updateMyProfile({
      firstName: profileForm.firstName,
      lastName: profileForm.lastName,
      dateOfBirth: new Date(profileForm.dateOfBirth).toISOString(),
    });

    if (!result.success) {
      setProfileError(result.message ?? 'Update failed');
      return;
    }

    if (user) {
      const updated = {
        ...user,
        displayName: `${profileForm.firstName} ${profileForm.lastName}`,
      };
      saveAuth(updated);
      setUser(updated);
    }

    setProfileMessage('Profile updated successfully');
  };

  const handlePasswordSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setPasswordMessage('');
    setPasswordError('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    const result = await changePassword({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    });

    if (!result.success) {
      const validationError = result.errors?.[0]?.errorMessage;
      setPasswordError(validationError ?? result.message ?? 'Password change failed');
      return;
    }

    setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordMessage('Password changed successfully');
  };

  if (loading) {
    return (
      <div className="dash-content">
        <p className="dash-empty">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="dash-content">
      <header className="dash-header">
        <div>
          <h1>My Account</h1>
          <p>Manage your personal information and password</p>
        </div>
      </header>

      <div className="profile-layout">
        <section className="dash-panel profile-panel">
          <h2>Profile</h2>
          <form className="profile-form" onSubmit={handleProfileSubmit}>
          <label className="profile-field">
            <span>First name</span>
            <input
              value={profileForm.firstName}
              onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
              required
            />
          </label>
          <label className="profile-field">
            <span>Last name</span>
            <input
              value={profileForm.lastName}
              onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
              required
            />
          </label>
          <label className="profile-field">
            <span>Date of birth</span>
            <input
              type="date"
              value={profileForm.dateOfBirth}
              onChange={(e) => setProfileForm({ ...profileForm, dateOfBirth: e.target.value })}
              required
            />
          </label>
          <label className="profile-field">
            <span>Email</span>
            <input value={profileForm.email} disabled />
          </label>
          {profileMessage && <p className="dash-msg success">{profileMessage}</p>}
          {profileError && <p className="dash-msg error">{profileError}</p>}
          <button type="submit" className="dash-btn-primary">Save profile</button>
        </form>
        </section>

        <section className="dash-panel profile-panel">
          <h2>Change password</h2>
          <p className="profile-hint">You must enter your current password to set a new one.</p>
          <form className="profile-form" onSubmit={handlePasswordSubmit}>
          <label className="profile-field">
            <span>Current password</span>
            <input
              type="password"
              value={passwordForm.oldPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })}
              required
            />
          </label>
          <label className="profile-field">
            <span>New password</span>
            <input
              type="password"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              required
            />
          </label>
          <label className="profile-field">
            <span>Confirm new password</span>
            <input
              type="password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              required
            />
          </label>
          {passwordMessage && <p className="dash-msg success">{passwordMessage}</p>}
          {passwordError && <p className="dash-msg error">{passwordError}</p>}
          <button type="submit" className="dash-btn-primary">Change password</button>
        </form>
        </section>
      </div>
    </div>
  );
}

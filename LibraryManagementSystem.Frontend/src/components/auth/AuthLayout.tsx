import type { ReactNode } from 'react';
import heroImage from '../../assets/hero.png';
import '../../styles/auth.css';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="auth-page">
      <div className="auth-shell">
        <div className="auth-illustration" aria-hidden="true">
          <img src={heroImage} alt="" />
        </div>
        <div className="auth-card">{children}</div>
      </div>
    </div>
  );
}

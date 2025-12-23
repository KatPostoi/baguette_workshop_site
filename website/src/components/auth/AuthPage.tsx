import type { ReactNode } from 'react';
import './AuthPage.css';

export const AuthPage = ({ children }: { children: ReactNode }) => {
  return <div className="auth-page">{children}</div>;
};

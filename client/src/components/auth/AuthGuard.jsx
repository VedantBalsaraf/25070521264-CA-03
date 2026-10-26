import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';
import { LoadingState } from '../layout/PageWrapper';

export function AuthGuard({ children, redirectTo = '/login' }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

export function GuestGuard({ children, redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState size="lg" text="Checking authentication..." />
      </div>
    );
  }

  if (user) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}

export function RoleGuard({ children, allowedRoles, redirectTo = '/dashboard' }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState size="lg" text="Checking permissions..." />
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role || '')) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
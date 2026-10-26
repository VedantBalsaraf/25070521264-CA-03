import { createBrowserRouter } from 'react-router-dom';
import { AuthGuard, GuestGuard } from '@components/auth';
import { PageWrapper } from '@components/layout/PageWrapper';
import {
  LandingPage,
  ExplorePage,
  ShareItemPage,
  BorrowDashboardPage,
  ImpactDashboardPage,
  LoginPage,
  SignupPage,
  ItemDetailPage
} from '@pages';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <PageWrapper>
        <LandingPage />
      </PageWrapper>
    )
  },
  {
    path: '/explore',
    element: (
      <PageWrapper>
        <ExplorePage />
      </PageWrapper>
    )
  },
  {
    path: '/item/:itemId',
    element: (
      <PageWrapper>
        <ItemDetailPage />
      </PageWrapper>
    )
  },
  {
    path: '/login',
    element: (
      <GuestGuard>
        <LoginPage />
      </GuestGuard>
    )
  },
  {
    path: '/signup',
    element: (
      <GuestGuard>
        <SignupPage />
      </GuestGuard>
    )
  },
  {
    path: '/share',
    element: (
      <AuthGuard>
        <PageWrapper>
          <ShareItemPage />
        </PageWrapper>
      </AuthGuard>
    )
  },
  {
    path: '/dashboard',
    element: (
      <AuthGuard>
        <PageWrapper>
          <BorrowDashboardPage />
        </PageWrapper>
      </AuthGuard>
    )
  },
  {
    path: '/impact',
    element: (
      <AuthGuard>
        <PageWrapper>
          <ImpactDashboardPage />
        </PageWrapper>
      </AuthGuard>
    )
  }
]);
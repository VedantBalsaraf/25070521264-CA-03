import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from './context';
import { ItemProvider } from './context';
import { ToastProvider } from './components/common/Toast';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { router } from './routes';
import './styles/index.css';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ItemProvider>
          <ToastProvider>
            <RouterProvider router={router} fallbackElement={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin w-10 h-10 border-3 border-primary-500 border-t-transparent rounded-full" /></div>} />
          </ToastProvider>
        </ItemProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
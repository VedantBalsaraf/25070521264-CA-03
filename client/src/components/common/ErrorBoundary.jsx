import { Component } from 'react';
import { Button } from './Button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { cn } from '../../utils/formatters';

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error,
      errorInfo
    });
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
          <div className="max-w-md w-full text-center">
            <div className={cn('p-3 rounded-full bg-error-100 text-error-600 inline-flex mb-6')}>
              <AlertTriangle size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h1>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Our team has been notified.
            </p>
            {this.state.error && (
              <details className="text-left mb-6 p-4 bg-gray-100 rounded-lg text-sm">
                <summary className="font-medium text-gray-700 cursor-pointer">Error Details</summary>
                <pre className="mt-2 text-gray-600 overflow-auto max-h-40">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={this.handleRetry} leftIcon={<RefreshCw size={18} />}>
                Try Again
              </Button>
              <Button variant="outline" onClick={this.handleGoHome} leftIcon={<Home size={18} />}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
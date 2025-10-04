import React, { Component, ErrorInfo, ReactNode } from 'react';
import Card from './Card';
import Button from './Button';
import { FaExclamationTriangle, FaRedo, FaHome } from 'react-icons/fa';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service in production
    if (process.env.NODE_ENV === 'production') {
      // Here you would typically send to error reporting service
      console.error('Production error:', {
        error: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack
      });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md text-center">
            <div className="mb-6">
              <div className="bg-red-100 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                <FaExclamationTriangle className="text-red-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                אופס! משהו השתבש
              </h2>
              <p className="text-gray-600 mb-4">
                קרתה שגיאה לא צפויה. אנא נסו שוב או פנו לתמיכה.
              </p>
              
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="text-left text-sm text-gray-500 bg-gray-100 p-3 rounded-lg mb-4">
                  <summary className="cursor-pointer font-medium">
                    פרטי השגיאה (פיתוח)
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap">
                    {this.state.error.message}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
            </div>

            <div className="space-y-3">
              <Button
                variant="primary"
                fullWidth
                onClick={this.handleRetry}
                className="h-12"
              >
                <FaRedo size={16} />
                נסה שוב
              </Button>
              
              <Button
                variant="secondary"
                fullWidth
                onClick={this.handleGoHome}
                className="h-12"
              >
                <FaHome size={16} />
                חזרה לעמוד הבית
              </Button>
            </div>

            <div className="mt-6 text-xs text-gray-500">
              <p>אם הבעיה נמשכת, אנא צרו קשר עם התמיכה הטכנית</p>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

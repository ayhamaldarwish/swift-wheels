import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary component to catch JavaScript errors anywhere in the child component tree,
 * log those errors, and display a fallback UI instead of crashing the whole app.
 */
class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
    
    // Filter out errors from contentscript.js
    if (error.stack && error.stack.includes('contentscript.js')) {
      console.warn('Caught error from contentscript.js (likely a browser extension)');
      // Optionally reset the error state to prevent showing the fallback UI
      // this.setState({ hasError: false });
      return;
    }
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  render() {
    if (this.state.hasError) {
      // Check if a custom fallback was provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="p-6 max-w-4xl mx-auto my-8">
          <Alert variant="destructive" className="mb-6">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <AlertTitle className="text-lg font-semibold mb-2">
              Something went wrong
            </AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-4">
                An error occurred in the application. This might be temporary or due to an external script.
              </p>
              <div className="bg-muted p-4 rounded-md mb-4 overflow-auto max-h-40">
                <p className="font-mono text-sm text-destructive">
                  {this.state.error?.toString()}
                </p>
              </div>
              <Button 
                onClick={() => window.location.reload()} 
                className="mr-2"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reload Page
              </Button>
              <Button 
                variant="outline" 
                onClick={this.handleReset}
              >
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
          {this.props.children}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

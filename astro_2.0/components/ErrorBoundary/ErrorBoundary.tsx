import React, { ErrorInfo, ReactNode } from 'react';

// Styles
import styles from './ErrorBoundary.module.scss';

// Types
type ErrorBoundaryProps = {
  children: ReactNode;
  hidden?: boolean;
  message?: string;
};

type ErrorBoundaryState = {
  hasError: boolean;
  error?: string;
};

const DEFAULT_MESSAGE = 'Error rendering component';

/**
 * Error boundary wrapper
 */
class ErrorBoundary extends React.PureComponent<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  /**
   * Update state with error details
   */
  static getDerivedStateFromError(error: Error): {
    hasError: boolean;
    error: Error;
  } {
    return { hasError: true, error };
  }

  // eslint-disable-next-line react/state-in-constructor
  state = {
    hasError: false,
    error: undefined,
  };

  /**
   * Log error
   */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    // Todo - log the error to an error reporting service
    // eslint-disable-next-line
    console.log(error, info, this.state.error);
  }

  /**
   * Render fallback UI
   */
  render(): ReactNode {
    const { hasError } = this.state;
    const { hidden, message, children } = this.props;

    if (hasError && hidden) {
      return null;
    }

    if (hasError) {
      return (
        <div className={styles.message} title={message || DEFAULT_MESSAGE}>
          {message || DEFAULT_MESSAGE}
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;

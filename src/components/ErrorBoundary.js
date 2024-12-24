import React from 'react';
import { Container, Alert, Button } from 'react-bootstrap';
import { theme } from '../theme';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    // You can also log the error to an error reporting service here
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="mt-5" style={{ fontFamily: 'Poppins' }}>
          <Alert variant="danger">
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>
              We're sorry for the inconvenience. Please try refreshing the page or contact support if the problem persists.
            </p>
            <hr />
            <div className="d-flex justify-content-end">
              <Button
                onClick={() => window.location.reload()}
                style={{
                  backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                  border: 'none'
                }}
              >
                Refresh Page
              </Button>
            </div>
          </Alert>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
          )}
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 
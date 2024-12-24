import React from 'react';
import { Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { theme } from '../theme';

export const RouteErrorBoundary = ({ error }) => {
  const navigate = useNavigate();

  return (
    <Alert variant="danger" className="m-4">
      <Alert.Heading>Something went wrong</Alert.Heading>
      <p>{error?.message || 'An unexpected error occurred'}</p>
      <div className="d-flex justify-content-end">
        <Button 
          onClick={() => navigate(-1)}
          style={{
            backgroundImage: `linear-gradient(45deg, #2C3E50, ${theme.colors.primary})`,
            border: 'none'
          }}
        >
          Go Back
        </Button>
      </div>
    </Alert>
  );
}; 
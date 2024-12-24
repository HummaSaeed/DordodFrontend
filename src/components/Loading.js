import React from 'react';
import { Spinner, Container } from 'react-bootstrap';
import { theme } from '../theme';

const Loading = ({ fullScreen }) => {
  const loadingStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  } : {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '2rem'
  };

  return (
    <div style={loadingStyle}>
      <Spinner
        animation="border"
        role="status"
        style={{ 
          color: theme.colors.primary,
          width: '3rem',
          height: '3rem'
        }}
      />
      <div 
        style={{ 
          marginTop: '1rem',
          fontFamily: 'Poppins',
          color: theme.colors.text.primary
        }}
      >
        Loading...
      </div>
    </div>
  );
};

export default Loading; 
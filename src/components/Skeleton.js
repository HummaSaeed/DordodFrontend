import React from 'react';
import { Card } from 'react-bootstrap';
import { theme } from '../theme';

export const CardSkeleton = () => (
  <Card style={{ 
    height: '100%', 
    boxShadow: theme.shadows.sm,
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.5s infinite',
  }}>
    <Card.Body>
      <div style={{ height: '24px', background: '#e0e0e0', marginBottom: '10px' }} />
      <div style={{ height: '16px', background: '#e0e0e0', width: '60%' }} />
    </Card.Body>
  </Card>
); 
// Common components used across screens
import React from 'react';
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

export const DashboardCard = ({ title, children, headerAction }) => {
  const { theme } = useTheme();
  
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="shadow-sm mb-4" style={{ 
        backgroundColor: theme.colors.background,
        boxShadow: theme.shadows.sm,
        borderRadius: '8px',
        marginBottom: '1rem'
      }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
          className="d-flex justify-content-between align-items-center"
        >
          <h5 className="mb-0">{title}</h5>
          {headerAction}
        </Card.Header>
        <Card.Body>{children}</Card.Body>
      </Card>
    </motion.div>
  );
};

export const ActionButton = ({ icon: Icon, label, ...props }) => (
  <Button
    {...props}
    style={{
      backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
      border: 'none',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    }}
  >
    {Icon && <Icon />} {label}
  </Button>
);

export const StatusBadge = ({ status, ...props }) => {
  const colors = {
    completed: 'success',
    'in-progress': 'warning',
    pending: 'info',
    failed: 'danger'
  };

  return (
    <Badge bg={colors[status] || 'secondary'} {...props}>
      {status}
    </Badge>
  );
};

export const ProgressIndicator = ({ value, label }) => (
  <div className="mb-3">
    <div className="d-flex justify-content-between mb-1">
      <span>{label}</span>
      <span>{value}%</span>
    </div>
    <ProgressBar 
      now={value} 
      variant={value > 75 ? 'success' : value > 50 ? 'info' : 'warning'} 
    />
  </div>
); 
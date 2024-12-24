import React from 'react';
import { Toast as BootstrapToast } from 'react-bootstrap';
import { theme } from '../theme';

export const Toast = ({ show, onClose, title, message, variant = 'success' }) => (
  <div
    style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
    }}
  >
    <BootstrapToast 
      show={show} 
      onClose={onClose}
      delay={3000} 
      autohide
      bg={variant}
    >
      <BootstrapToast.Header>
        <strong className="me-auto">{title}</strong>
      </BootstrapToast.Header>
      <BootstrapToast.Body>{message}</BootstrapToast.Body>
    </BootstrapToast>
  </div>
); 
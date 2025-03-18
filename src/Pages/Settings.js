import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { theme } from '../theme';
import InputField from '../components/InputField';
import { Toast } from '../components/Toast';

const Settings = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    emailNotifications: true,
    pushNotifications: true,
    reminderTime: '09:00',
    darkMode: false
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setToast({
        show: true,
        message: 'New passwords do not match!',
        variant: 'danger'
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://dordod.com/api/change-password/',
        {
          current_password: formData.currentPassword,
          new_password: formData.newPassword,
          confirm_password: formData.confirmPassword
        },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (response.status === 200) {
        setToast({
          show: true,
          message: 'Password updated successfully!',
          variant: 'success'
        });
        
        // Clear password fields
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      let errorMessage = 'Failed to update password. Please try again.';
      
      if (error.response) {
        if (error.response.data.current_password) {
          errorMessage = 'Current password is incorrect';
        } else if (error.response.data.new_password) {
          errorMessage = error.response.data.new_password.join('\n');
        }
      } else {
        errorMessage = 'Network error. Please check your connection.';
      }

      setToast({
        show: true,
        message: errorMessage,
        variant: 'danger'
      });
      
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationSettings = async (e) => {
    e.preventDefault();
    try {
      // Add notification settings API call here
      alert('Notification settings updated successfully!');
    } catch (error) {
      console.error('Error updating notification settings:', error);
      alert('Failed to update notification settings. Please try again.');
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Settings
      </h2>

      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <h5 className="mb-0">Change Password</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handlePasswordChange}>
            <InputField
              label="Current Password"
              name="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
              required
            />

            <InputField
              label="New Password"
              name="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
            />

            <InputField
              label="Confirm New Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <div className="d-flex justify-content-end mt-4">
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                  border: 'none',
                  minWidth: '150px'
                }}
              >
                {loading ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings;
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { theme } from '../theme';
import InputField from '../components/InputField';

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
      alert('New passwords do not match!');
      return;
    }

    try {
      // Add password change API call here
      alert('Password updated successfully!');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password. Please try again.');
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
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Settings
      </h2>

      <Row>
        <Col md={6}>
          <Card className="mb-4" style={{ boxShadow: theme.shadows.sm }}>
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
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="New Password"
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  required
                />
                <InputField
                  label="Confirm New Password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="submit"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none',
                    width: '100%'
                  }}
                >
                  Update Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Notification Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleNotificationSettings}>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Email Notifications"
                    name="emailNotifications"
                    checked={formData.emailNotifications}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Push Notifications"
                    name="pushNotifications"
                    checked={formData.pushNotifications}
                    onChange={handleChange}
                  />
                </Form.Group>
                <InputField
                  label="Daily Reminder Time"
                  type="time"
                  name="reminderTime"
                  value={formData.reminderTime}
                  onChange={handleChange}
                />
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Dark Mode"
                    name="darkMode"
                    checked={formData.darkMode}
                    onChange={handleChange}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none',
                    width: '100%'
                  }}
                >
                  Save Settings
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings;
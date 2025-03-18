import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { theme } from '../theme';
import InputField from '../components/InputField';
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';
import { API_BASE_URL } from '../config/api';

const GlobalInformation = () => {
  const [formData, setFormData] = useState({
    nationality: '',
    current_location: '',
    languages: [],
    time_zone: '',
    availability: '',
    preferred_communication: '',
    social_media_links: {},
    hobbies_interests: '',
    volunteer_work: '',
    travel_experience: '',
    cultural_background: '',
    dietary_preferences: ''
  });

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchGlobalInfo();
  }, []);

  const fetchGlobalInfo = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/global-info/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      
      if (response.data) {
        setFormData({
          ...response.data,
          languages: response.data.languages || [],
          social_media_links: response.data.social_media_links || {}
        });
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        setToast({
          show: true,
          message: handleApiError(error),
          variant: 'danger'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLanguageChange = (e) => {
    const languages = e.target.value ? 
      e.target.value.split(',').map(lang => lang.trim()).filter(Boolean) : 
      [];
    setFormData(prev => ({
      ...prev,
      languages
    }));
  };

  const handleSocialMediaChange = (platform, value) => {
    setFormData(prev => ({
      ...prev,
      social_media_links: {
        ...prev.social_media_links,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const method = formData.id ? 'put' : 'post';
      const url = formData.id 
        ? `http://dordod.com/api/global-info/${formData.id}/`
        : `http://dordod.com/api/global-info/`;

      const response = await axios[method](url, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      setFormData(response.data);
      setToast({
        show: true,
        message: 'Global information saved successfully!',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Global Information
      </h2>

      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <h5 className="mb-0">Your Global Profile</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <InputField
                  label="Nationality"
                  name="nationality"
                  value={formData.nationality}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Current Location"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <InputField
                  label="Languages"
                  name="languages"
                  value={(formData.languages || []).join(', ')}
                  onChange={handleLanguageChange}
                  placeholder="e.g., English, Spanish, French"
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Time Zone"
                  name="time_zone"
                  value={formData.time_zone}
                  onChange={handleChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <InputField
                  label="Availability"
                  name="availability"
                  value={formData.availability}
                  onChange={handleChange}
                  placeholder="e.g., Weekdays 9 AM - 5 PM EST"
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Preferred Communication"
                  name="preferred_communication"
                  value={formData.preferred_communication}
                  onChange={handleChange}
                  placeholder="e.g., Email, Phone, Slack"
                />
              </Col>
            </Row>

            <InputField
              label="Social Media Links"
              name="social_media_links"
              value={formData.social_media_links}
              onChange={handleSocialMediaChange}
              as="textarea"
              rows={2}
              placeholder="LinkedIn, Twitter, etc."
            />

            <InputField
              label="Hobbies & Interests"
              name="hobbies_interests"
              value={formData.hobbies_interests}
              onChange={handleChange}
              as="textarea"
              rows={2}
            />

            <InputField
              label="Volunteer Work"
              name="volunteer_work"
              value={formData.volunteer_work}
              onChange={handleChange}
              as="textarea"
              rows={2}
            />

            <InputField
              label="Travel Experience"
              name="travel_experience"
              value={formData.travel_experience}
              onChange={handleChange}
              as="textarea"
              rows={2}
            />

            <Row>
              <Col md={6}>
                <InputField
                  label="Cultural Background"
                  name="cultural_background"
                  value={formData.cultural_background}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Dietary Preferences"
                  name="dietary_preferences"
                  value={formData.dietary_preferences}
                  onChange={handleChange}
                />
              </Col>
            </Row>

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
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default GlobalInformation;

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { theme } from '../theme';
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';

const SWOTAnalysis = () => {
  const [swotData, setSwotData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });

  const [newItems, setNewItems] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [strengths, weaknesses, opportunities, threats] = await Promise.all([
        axios.get('http://dordod.com/api/strengths/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        axios.get('http://dordod.com/api/weaknesses/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        axios.get('http://dordod.com/api/opportunities/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        }),
        axios.get('http://dordod.com/api/threats/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
        })
      ]);

      setSwotData({
        strengths: strengths.data || [],
        weaknesses: weaknesses.data || [],
        opportunities: opportunities.data || [],
        threats: threats.data || []
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

  const getEndpoint = (category) => {
    const endpoints = {
      strengths: 'strengths',
      weaknesses: 'weaknesses',
      opportunities: 'opportunities',
      threats: 'threats'
    };
    return endpoints[category];
  };

  const handleInputChange = (category, value) => {
    setNewItems(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleAddItem = async (category) => {
    if (!newItems[category].trim()) return;

    try {
      const endpoint = getEndpoint(category);
      const response = await axios.post(
        `http://dordod.com/api/${endpoint}/`,
        { description: newItems[category] },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSwotData(prev => ({
        ...prev,
        [category]: [...(prev[category] || []), response.data]
      }));

      setNewItems(prev => ({
        ...prev,
        [category]: ''
      }));

      setToast({
        show: true,
        message: `Added to ${category} successfully!`,
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const handleRemoveItem = async (category, id) => {
    try {
      const endpoint = getEndpoint(category);
      await axios.delete(`http://dordod.com/api/${endpoint}/${id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setSwotData(prev => ({
        ...prev,
        [category]: prev[category].filter(item => item.id !== id)
      }));

      setToast({
        show: true,
        message: `Removed from ${category} successfully!`,
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const renderSWOTSection = (title, category, bgColor) => (
    <Card className="h-100" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Header style={{ 
        background: bgColor,
        color: 'white',
        fontWeight: 'bold'
      }}>
        {title}
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <Form.Group className="d-flex">
            <Form.Control
              type="text"
              value={newItems[category]}
              onChange={(e) => handleInputChange(category, e.target.value)}
              placeholder={`Add new ${title.toLowerCase()}`}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddItem(category);
                }
              }}
            />
            <Button
              onClick={() => handleAddItem(category)}
              className="ms-2"
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                border: 'none'
              }}
            >
              Add
            </Button>
          </Form.Group>
        </div>
        <ul className="list-unstyled">
          {(swotData[category] || []).map((item) => (
            <li key={item.id} className="d-flex justify-content-between align-items-center mb-2">
              <span>{item.description}</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleRemoveItem(category, item.id)}
              >
                ×
              </Button>
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        SWOT Analysis
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row className="g-4">
          <Col md={6}>
            {renderSWOTSection('Strengths', 'strengths', '#28a745')}
          </Col>
          <Col md={6}>
            {renderSWOTSection('Weaknesses', 'weaknesses', '#dc3545')}
          </Col>
          <Col md={6}>
            {renderSWOTSection('Opportunities', 'opportunities', '#17a2b8')}
          </Col>
          <Col md={6}>
            {renderSWOTSection('Threats', 'threats', '#ffc107')}
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default SWOTAnalysis;
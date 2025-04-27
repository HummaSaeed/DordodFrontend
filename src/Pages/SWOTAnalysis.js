import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ListGroup } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../theme';
import { API_BASE_URL } from '../config/api';

const SWOTAnalysis = () => {
  const [swotData, setSWOTData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [localData, setLocalData] = useState({
    strengths: [],
    weaknesses: [],
    opportunities: [],
    threats: []
  });
  const [loading, setLoading] = useState({
    strengths: false,
    weaknesses: false,
    opportunities: false,
    threats: false,
    all: false
  });

  const [newItems, setNewItems] = useState({
    strengths: '',
    weaknesses: '',
    opportunities: '',
    threats: ''
  });

  useEffect(() => {
    fetchSWOTData();
  }, []);

  const fetchSWOTData = async () => {
    try {
      const response = await axios.get(`http://dordod.com/api/swot/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      // Get the latest SWOT analysis (last item in the array)
      const latestSwot = response.data[response.data.length - 1];
      
      // Transform the data to keep descriptions in array format
      const transformedData = {
        strengths: latestSwot?.strengths?.map(s => s.description) || [],
        weaknesses: latestSwot?.weaknesses?.map(w => w.description) || [],
        opportunities: latestSwot?.opportunities?.map(o => o.description) || [],
        threats: latestSwot?.threats?.map(t => t.description) || []
      };

      setSWOTData(transformedData);
      setLocalData(transformedData);
    } catch (error) {
      console.error('Error fetching SWOT data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(prev => ({ ...prev, all: true }));
    try {
      const formattedData = {
        strengths: swotData.strengths.map(desc => ({ description: desc })),
        weaknesses: swotData.weaknesses.map(desc => ({ description: desc })),
        opportunities: swotData.opportunities.map(desc => ({ description: desc })),
        threats: swotData.threats.map(desc => ({ description: desc }))
      };

      await axios.post(`http://dordod.com/api/swot/`, formattedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setSWOTData(localData);
      fetchSWOTData();
    } catch (error) {
      console.error('Error saving SWOT analysis:', error);
    } finally {
      setLoading(prev => ({ ...prev, all: false }));
    }
  };

  const handleSectionSave = async (section) => {
    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      const formattedData = {
        [section]: [{ description: localData[section] }]
      };

      await axios.post(`http://dordod.com/api/swot/`, formattedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      setSWOTData(prev => ({
        ...prev,
        [section]: localData[section]
      }));
    } catch (error) {
      console.error(`Error saving ${section}:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleNewItemChange = (e, section) => {
    setNewItems(prev => ({
      ...prev,
      [section]: e.target.value
    }));
  };

  const handleAddItem = async (section) => {
    if (!newItems[section].trim()) return;

    setLoading(prev => ({ ...prev, [section]: true }));
    try {
      const formattedData = {
        [section]: [
          ...swotData[section].map(item => ({ description: item })),
          { description: newItems[section] }
        ]
      };

      await axios.post(`http://dordod.com/api/swot/`, formattedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      // Update local state without re-fetching
      setSWOTData(prev => ({
        ...prev,
        [section]: [...prev[section], newItems[section]]
      }));

      // Clear input
      setNewItems(prev => ({
        ...prev,
        [section]: ''
      }));

      // Remove the fetchSWOTData() call
    } catch (error) {
      console.error(`Error adding ${section} item:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [section]: false }));
    }
  };

  const handleDeleteItem = async (section, index) => {
    try {
      const updatedItems = swotData[section].filter((_, i) => i !== index);
      const formattedData = {
        [section]: updatedItems.map(item => ({ description: item }))
      };

      await axios.post(`http://dordod.com/api/swot/`, formattedData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      setSWOTData(prev => ({
        ...prev,
        [section]: updatedItems
      }));
    } catch (error) {
      console.error(`Error deleting ${section} item:`, error);
    }
  };

  const SWOTCard = ({ title, name, color }) => {
    const inputRef = React.useRef(null);

    const handleAdd = () => {
      handleAddItem(name);
      // Focus back on the input after adding
      inputRef.current?.focus();
    };

    return (
      <Col md={6} className="mb-4">
        <Card style={{ boxShadow: theme.shadows.sm, height: '100%' }}>
          <Card.Header
            style={{
              backgroundImage: `linear-gradient(45deg, #2C3E50, ${color})`,
              color: 'white',
              padding: '15px'
            }}
          >
            <h5 className="mb-0">{title}</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <div className="d-flex">
                <Form.Control
                  ref={inputRef}
                  type="text"
                  value={newItems[name]}
                  onChange={(e) => handleNewItemChange(e, name)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                  placeholder={`Add new ${title.toLowerCase()}`}
                  style={{ 
                    borderRadius: '4px 0 0 4px',
                    fontFamily: 'Poppins',
                    width: '100%'
                  }}
                  autoComplete="off"
                />
                <Button
                  onClick={handleAdd}
                  disabled={loading[name]}
                  style={{
                    backgroundImage: `linear-gradient(45deg, #2C3E50, ${color})`,
                    border: 'none',
                    borderRadius: '0 4px 4px 0'
                  }}
                >
                  <FaPlus />
                </Button>
              </div>
            </div>

            <ListGroup>
              {swotData[name].map((item, index) => (
                <ListGroup.Item
                  key={index}
                  className="d-flex justify-content-between align-items-center"
                  style={{ fontFamily: 'Poppins' }}
                >
                  <span>{item}</span>
                  <Button
                    variant="link"
                    className="text-danger p-0"
                    onClick={() => handleDeleteItem(name, index)}
                  >
                    <FaTrash />
                  </Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>SWOT Analysis</h2>
        <Button
          onClick={handleSubmit}
          disabled={loading.all}
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            border: 'none',
            padding: '10px 20px'
          }}
        >
          {loading.all ? 'Saving...' : 'Save All'}
        </Button>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row>
          <SWOTCard
            title="Strengths"
            name="strengths"
            color="#28a745"
          />
          <SWOTCard
            title="Weaknesses"
            name="weaknesses"
            color="#dc3545"
          />
          <SWOTCard
            title="Opportunities"
            name="opportunities"
            color="#17a2b8"
          />
          <SWOTCard
            title="Threats"
            name="threats"
            color="#ffc107"
          />
        </Row>
      </Form>

      <Card className="mt-4" style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <h5 className="mb-0">SWOT Analysis Tips</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <h6 className="text-success">Strengths Tips:</h6>
              <ul>
                <li>What do you do well?</li>
                <li>What unique skills do you possess?</li>
                <li>What relevant resources do you have?</li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="text-danger">Weaknesses Tips:</h6>
              <ul>
                <li>What could you improve?</li>
                <li>Where do you lack resources?</li>
                <li>What do others likely see as weaknesses?</li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="text-info">Opportunities Tips:</h6>
              <ul>
                <li>What opportunities are available?</li>
                <li>What trends could you take advantage of?</li>
                <li>How can you turn strengths into opportunities?</li>
              </ul>
            </Col>
            <Col md={3}>
              <h6 className="text-warning">Threats Tips:</h6>
              <ul>
                <li>What threats could harm you?</li>
                <li>What competition do you face?</li>
                <li>What could impact your career negatively?</li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SWOTAnalysis;

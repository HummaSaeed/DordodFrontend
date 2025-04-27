import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Form, InputGroup } from 'react-bootstrap';
import { FaSearch, FaUserPlus, FaEnvelope, FaEllipsisH } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const MyConnections = () => {
  const [connections, setConnections] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Required APIs:
  // GET /api/connections/ - Get user's connections
  // GET /api/connections/suggestions - Get connection suggestions
  // POST /api/connections/request/:id - Send connection request
  // PUT /api/connections/accept/:id - Accept connection request
  // DELETE /api/connections/:id - Remove connection

  const ConnectionCard = ({ connection, isSuggestion }) => (
    <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Body className="d-flex align-items-center">
        <img
          src={connection.avatar || 'default-avatar.png'}
          alt={connection.name}
          style={{ width: 60, height: 60, borderRadius: '50%', marginRight: 15 }}
        />
        <div className="flex-grow-1">
          <h5 className="mb-1">{connection.name}</h5>
          <p className="text-muted mb-1">{connection.title}</p>
          <p className="small mb-0">{connection.company}</p>
        </div>
        <div>
          {isSuggestion ? (
            <Button
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                border: 'none'
              }}
            >
              <FaUserPlus className="me-2" /> Connect
            </Button>
          ) : (
            <>
              <Button variant="outline-primary" className="me-2">
                <FaEnvelope /> Message
              </Button>
              <Button variant="outline-secondary">
                <FaEllipsisH />
              </Button>
            </>
          )}
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>My Connections</h2>

      <Row>
        <Col md={8}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">My Network</h5>
                <InputGroup style={{ width: '300px' }}>
                  <Form.Control
                    placeholder="Search connections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button variant="outline-light">
                    <FaSearch />
                  </Button>
                </InputGroup>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div>Loading...</div>
              ) : connections.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No connections yet</h5>
                  <p>Start building your network by connecting with others</p>
                </div>
              ) : (
                connections.map(connection => (
                  <ConnectionCard key={connection.id} connection={connection} isSuggestion={false} />
                ))
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">People You May Know</h5>
            </Card.Header>
            <Card.Body>
              {suggestions.map(suggestion => (
                <ConnectionCard key={suggestion.id} connection={suggestion} isSuggestion={true} />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default MyConnections; 
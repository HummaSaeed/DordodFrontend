import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { theme } from '../../theme';

const MyCoach = () => {
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch coaches data when API is available
    setLoading(false);
  }, []);

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>My Coach</h2>
      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <h5 className="mb-0">Assigned Coaches</h5>
        </Card.Header>
        <Card.Body>
          {/* Coach list will be displayed here */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyCoach; 
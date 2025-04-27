import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, ProgressBar, Form, Table, Badge, ListGroup } from 'react-bootstrap';
import { FaChartLine, FaExclamationTriangle, FaCheckCircle, FaHistory } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Cibil = () => {
  const [cibilScore, setCibilScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [creditHistory, setCreditHistory] = useState([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: '',
    dob: '',
    pan: '',
    address: ''
  });

  // Required APIs:
  // GET /api/cibil/score - Get CIBIL score
  // GET /api/cibil/history - Get credit history
  // GET /api/cibil/personal-info - Get personal information
  // POST /api/cibil/dispute - File a dispute
  // GET /api/cibil/recommendations - Get credit improvement recommendations

  const getScoreColor = (score) => {
    if (score >= 750) return '#28a745';
    if (score >= 650) return '#ffc107';
    return '#dc3545';
  };

  const ScoreIndicator = () => (
    <div className="text-center mb-4">
      <div
        style={{
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          border: `20px solid ${getScoreColor(cibilScore)}`,
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          <h2 style={{ color: getScoreColor(cibilScore) }}>{cibilScore}</h2>
          <p className="mb-0">CIBIL Score</p>
        </div>
      </div>
      <h5>{cibilScore >= 750 ? 'Excellent' : cibilScore >= 650 ? 'Good' : 'Poor'}</h5>
    </div>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>CIBIL Score & Report</h2>

      <Row>
        <Col md={8}>
          <Card className="mb-4" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Credit Score Overview</h5>
            </Card.Header>
            <Card.Body>
              <ScoreIndicator />
              <Row className="text-center">
                <Col md={4}>
                  <h6>Payment History</h6>
                  <ProgressBar now={85} variant="success" />
                  <small className="text-muted">Excellent</small>
                </Col>
                <Col md={4}>
                  <h6>Credit Utilization</h6>
                  <ProgressBar now={60} variant="warning" />
                  <small className="text-muted">Good</small>
                </Col>
                <Col md={4}>
                  <h6>Credit Age</h6>
                  <ProgressBar now={75} variant="info" />
                  <small className="text-muted">Very Good</small>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Credit History</h5>
            </Card.Header>
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Lender</th>
                    <th>Account Type</th>
                    <th>Status</th>
                    <th>Balance</th>
                    <th>Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  {creditHistory.map(item => (
                    <tr key={item.id}>
                      <td>{item.lender}</td>
                      <td>{item.accountType}</td>
                      <td>
                        <Badge bg={item.status === 'Active' ? 'success' : 'secondary'}>
                          {item.status}
                        </Badge>
                      </td>
                      <td>₹{item.balance}</td>
                      <td>
                        {item.paymentStatus === 'On Time' ? (
                          <FaCheckCircle className="text-success" />
                        ) : (
                          <FaExclamationTriangle className="text-warning" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Personal Information</h5>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" value={personalInfo.name} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control type="text" value={personalInfo.dob} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>PAN Number</Form.Label>
                  <Form.Control type="text" value={personalInfo.pan} readOnly />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control as="textarea" rows={3} value={personalInfo.address} readOnly />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>

          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Recommendations</h5>
            </Card.Header>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <FaChartLine className="text-success me-2" />
                Keep credit utilization below 30%
              </ListGroup.Item>
              <ListGroup.Item>
                <FaHistory className="text-info me-2" />
                Make all payments on time
              </ListGroup.Item>
              <ListGroup.Item>
                <FaExclamationTriangle className="text-warning me-2" />
                Avoid multiple credit inquiries
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cibil; 
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, Badge, Modal, Form, ProgressBar, ListGroup } from 'react-bootstrap';
import { FaTrophy, FaMedal, FaStar, FaGift, FaAward } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const RewardsRecognition = () => {
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [points, setPoints] = useState(0);
  const [recentRewards, setRecentRewards] = useState([]);

  // Required APIs:
  // GET /api/rewards - Get available rewards
  // GET /api/rewards/my-rewards - Get user's earned rewards
  // POST /api/rewards/:id/redeem - Redeem a reward
  // GET /api/points - Get user's points balance
  // GET /api/achievements - Get user's achievements

  const RewardCard = ({ reward }) => (
    <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className="reward-icon me-3">
            {reward.type === 'trophy' && <FaTrophy size={30} color="#FFD700" />}
            {reward.type === 'medal' && <FaMedal size={30} color="#C0C0C0" />}
            {reward.type === 'badge' && <FaAward size={30} color="#CD7F32" />}
          </div>
          <div className="flex-grow-1">
            <h5>{reward.title}</h5>
            <p className="text-muted mb-2">{reward.description}</p>
            <div>
              <Badge bg="primary" className="me-2">{reward.category}</Badge>
              <Badge bg="info">{reward.points} Points</Badge>
            </div>
          </div>
          <Button
            onClick={() => {
              setSelectedReward(reward);
              setShowModal(true);
            }}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            Redeem
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  useEffect(() => {
    // Mock data for recentRewards
    setRecentRewards([
      { id: 1, title: 'Achievement 1', redeemedAt: new Date() },
      { id: 2, title: 'Achievement 2', redeemedAt: new Date() }
    ]);
  }, []);

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Row className="mb-4">
        <Col>
          <h2 style={{ color: theme.colors.primary }}>Rewards & Recognition</h2>
        </Col>
        <Col xs="auto">
          <Card style={{ backgroundColor: '#28a745', color: 'white' }}>
            <Card.Body className="d-flex align-items-center">
              <FaStar className="me-2" />
              <div>
                <small>Available Points</small>
                <h4 className="mb-0">{points}</h4>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

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
              <h5 className="mb-0">Available Rewards</h5>
            </Card.Header>
            <Card.Body>
              {rewards.map(reward => (
                <RewardCard key={reward.id} reward={reward} />
              ))}
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
              <h5 className="mb-0">Your Achievements</h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <FaTrophy size={50} color="#FFD700" />
                <h3 className="mt-3">Level 5</h3>
                <p className="text-muted">Achievement Hunter</p>
              </div>
              <ProgressBar now={75} variant="success" className="mb-3" />
              <p className="text-center text-muted">
                125 more points to reach Level 6
              </p>
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
              <h5 className="mb-0">Recent Rewards</h5>
            </Card.Header>
            <Card.Body>
              <ListGroup>
                {recentRewards.map(reward => (
                  <ListGroup.Item key={reward.id}>
                    <div className="d-flex align-items-center">
                      <FaGift className="me-3" color="#28a745" />
                      <div>
                        <h6 className="mb-0">{reward.title}</h6>
                        <small className="text-muted">
                          Redeemed on {new Date(reward.redeemedAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>Redeem Reward</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedReward && (
            <>
              <h5>{selectedReward.title}</h5>
              <p>{selectedReward.description}</p>
              <p className="mb-4">
                Points Required: <Badge bg="info">{selectedReward.points}</Badge>
              </p>
              <p className="text-muted">
                Are you sure you want to redeem this reward? This action cannot be undone.
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
            onClick={() => {
              // Handle reward redemption
              setShowModal(false);
            }}
          >
            Confirm Redemption
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default RewardsRecognition; 
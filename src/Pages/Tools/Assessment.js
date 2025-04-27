import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Button, ProgressBar, Form } from 'react-bootstrap';
import { FaPlay, FaClock, FaCheck, FaList } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Assessment = () => {
  const [assessments, setAssessments] = useState([]);
  const [currentAssessment, setCurrentAssessment] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Required APIs:
  // GET /api/assessments - Get available assessments
  // GET /api/assessments/:id - Get assessment details
  // POST /api/assessments/:id/start - Start assessment
  // POST /api/assessments/:id/submit - Submit assessment
  // GET /api/assessments/results - Get assessment results

  const startAssessment = async (assessment) => {
    try {
      setLoading(true);
      // API call to start assessment
      setCurrentAssessment(assessment);
      setTimeLeft(assessment.duration * 60); // Convert minutes to seconds
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to start assessment',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const AssessmentCard = ({ assessment }) => (
    <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5>{assessment.title}</h5>
            <p className="text-muted mb-2">{assessment.description}</p>
            <div className="mb-2">
              <FaClock className="me-2" />
              {assessment.duration} minutes
              <FaList className="ms-3 me-2" />
              {assessment.questionCount} questions
            </div>
          </div>
          <Button
            onClick={() => startAssessment(assessment)}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            <FaPlay className="me-2" /> Start
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const QuestionView = () => (
    <Card>
      <Card.Header
        style={{
          backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
          color: 'white',
          padding: '15px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Question {currentQuestion?.number}</h5>
          <div>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</div>
        </div>
      </Card.Header>
      <Card.Body>
        <h6 className="mb-4">{currentQuestion?.text}</h6>
        <Form>
          {currentQuestion?.options.map((option, index) => (
            <Form.Check
              key={index}
              type="radio"
              name="answer"
              label={option}
              checked={answers[currentQuestion.id] === index}
              onChange={() => setAnswers({
                ...answers,
                [currentQuestion.id]: index
              })}
              className="mb-3"
            />
          ))}
        </Form>
        <div className="d-flex justify-content-between mt-4">
          <Button
            variant="outline-secondary"
            disabled={currentQuestion?.number === 1}
          >
            Previous
          </Button>
          <Button
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            {currentQuestion?.isLast ? 'Submit' : 'Next'}
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>Assessments</h2>

      {currentAssessment ? (
        <Row>
          <Col md={8} className="mx-auto">
            <QuestionView />
          </Col>
        </Row>
      ) : (
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
                <h5 className="mb-0">Available Assessments</h5>
              </Card.Header>
              <Card.Body>
                {assessments.map(assessment => (
                  <AssessmentCard key={assessment.id} assessment={assessment} />
                ))}
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
                <h5 className="mb-0">Your Progress</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Overall Progress</span>
                    <span>75%</span>
                  </div>
                  <ProgressBar now={75} variant="success" />
                </div>
                <div className="mb-3">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Completed Assessments</span>
                    <span>15/20</span>
                  </div>
                  <ProgressBar now={75} variant="info" />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Assessment; 
import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, ProgressBar } from 'react-bootstrap';
import { FaPoll, FaCheck, FaClock } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Survey = () => {
  const [surveys, setSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Required APIs:
  // GET /api/surveys - Get available surveys
  // GET /api/surveys/:id - Get survey details
  // POST /api/surveys/:id/submit - Submit survey responses
  // GET /api/surveys/completed - Get completed surveys

  const SurveyCard = ({ survey }) => (
    <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5>{survey.title}</h5>
            <p className="text-muted mb-2">{survey.description}</p>
            <div className="d-flex align-items-center">
              <FaClock className="me-2 text-muted" />
              <span className="text-muted">{survey.estimatedTime} minutes</span>
            </div>
          </div>
          <Button
            onClick={() => setCurrentSurvey(survey)}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            Start Survey
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  const QuestionTypes = {
    MULTIPLE_CHOICE: 'multiple_choice',
    RATING: 'rating',
    TEXT: 'text',
    CHECKBOX: 'checkbox'
  };

  const renderQuestion = (question) => {
    switch (question.type) {
      case QuestionTypes.MULTIPLE_CHOICE:
        return (
          <Form.Group className="mb-4">
            <Form.Label>{question.text}</Form.Label>
            {question.options.map((option, index) => (
              <Form.Check
                key={index}
                type="radio"
                name={`question-${question.id}`}
                label={option}
                onChange={(e) => setAnswers({
                  ...answers,
                  [question.id]: option
                })}
                className="mb-2"
              />
            ))}
          </Form.Group>
        );

      case QuestionTypes.RATING:
        return (
          <Form.Group className="mb-4">
            <Form.Label>{question.text}</Form.Label>
            <div className="d-flex justify-content-between">
              {[1, 2, 3, 4, 5].map(rating => (
                <Button
                  key={rating}
                  variant={answers[question.id] === rating ? 'success' : 'outline-secondary'}
                  onClick={() => setAnswers({
                    ...answers,
                    [question.id]: rating
                  })}
                  style={{ width: '50px', height: '50px' }}
                >
                  {rating}
                </Button>
              ))}
            </div>
          </Form.Group>
        );

      case QuestionTypes.TEXT:
        return (
          <Form.Group className="mb-4">
            <Form.Label>{question.text}</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={answers[question.id] || ''}
              onChange={(e) => setAnswers({
                ...answers,
                [question.id]: e.target.value
              })}
            />
          </Form.Group>
        );

      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // API call to submit survey
      setToast({
        show: true,
        message: 'Survey submitted successfully!',
        variant: 'success'
      });
      setCurrentSurvey(null);
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to submit survey',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      {currentSurvey ? (
        <Card style={{ boxShadow: theme.shadows.sm }}>
          <Card.Header
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              color: 'white',
              padding: '15px'
            }}
          >
            <h5 className="mb-0">{currentSurvey.title}</h5>
          </Card.Header>
          <Card.Body>
            <Form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}>
              {currentSurvey.questions.map(question => renderQuestion(question))}
              
              <div className="d-flex justify-content-between align-items-center mt-4">
                <Button
                  variant="outline-secondary"
                  onClick={() => setCurrentSurvey(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none'
                  }}
                >
                  Submit Survey
                </Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      ) : (
        <>
          <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>Surveys</h2>
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
                  <h5 className="mb-0">Available Surveys</h5>
                </Card.Header>
                <Card.Body>
                  {surveys.map(survey => (
                    <SurveyCard key={survey.id} survey={survey} />
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
                  <h5 className="mb-0">Survey Stats</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-4">
                    <FaPoll size={50} color="#28a745" />
                    <h3 className="mt-3">75%</h3>
                    <p className="text-muted">Completion Rate</p>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-2">
                      <span>Completed Surveys</span>
                      <span>15/20</span>
                    </div>
                    <ProgressBar now={75} variant="success" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Survey; 
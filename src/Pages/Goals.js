import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Modal, Button, Form, Container, Row, Col } from "react-bootstrap";
import InputField from "../components/InputField";
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';
import { theme } from '../theme';
import { API_BASE_URL } from '../config/api';

const localizer = momentLocalizer(moment);

const GOAL_CATEGORIES = [
  { value: 'spiritual', label: 'Spiritual Goals' },
  { value: 'fitness', label: 'Fitness Goals' },
  { value: 'family', label: 'Family Goals' },
  { value: 'career', label: 'Career Goals' },
  { value: 'financial', label: 'Financial Goals' },
  { value: 'social', label: 'Social Goals' },
  { value: 'intellectual', label: 'Intellectual Goals' }
];

const GOAL_STATUS = [
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' }
];

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showInputFields, setShowInputFields] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [loading, setLoading] = useState(true);

  const [newGoal, setNewGoal] = useState({
    name: "",
    description: "",
    category: "",
    start_date: "",
    end_date: "",
    status: "pending",
    weightage: 1.0,
    subgoals: []
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get(`http://dordod.com/api/main-goals/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      const formattedGoals = response.data.map((goal) => ({
        id: goal.id,
        title: goal.name,
        start: new Date(goal.start_date),
        end: new Date(goal.end_date),
        description: goal.description,
        status: goal.status,
        category: goal.category,
        weightage: goal.weightage,
        subgoals: goal.subgoals || []
      }));

      setGoals(formattedGoals);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGoal(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEventClick = (event) => {
    setSelectedGoal(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedGoal(null);
  };

  const handleSelectDate = (date) => {
    setNewGoal(prev => ({
      ...prev,
      start_date: moment(date).format('YYYY-MM-DD')
    }));
    setShowInputFields(true);
  };

  const handleSaveGoal = async () => {
    try {
      const response = await axios.post(`http://dordod.com/api/main-goals/`, newGoal, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });

      const formattedGoal = {
        id: response.data.id,
        title: response.data.name,
        start: new Date(response.data.start_date),
        end: new Date(response.data.end_date),
        description: response.data.description,
        status: response.data.status,
        category: response.data.category,
        weightage: response.data.weightage,
        subgoals: response.data.subgoals || []
      };

      setGoals([...goals, formattedGoal]);
      setShowInputFields(false);
      setNewGoal({
        name: "",
        description: "",
        category: "",
        start_date: "",
        end_date: "",
        status: "pending",
        weightage: 1.0,
        subgoals: []
      });

      setToast({
        show: true,
        message: 'Goal created successfully!',
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

  const handleDeleteGoal = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/main-goals/${selectedGoal.id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setGoals(goals.filter((goal) => goal.id !== selectedGoal.id));
      handleCloseModal();
      
      setToast({
        show: true,
        message: 'Goal deleted successfully!',
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

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Goals Calendar
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ height: "600px" }}>
          <Calendar
            localizer={localizer}
            events={goals}
            startAccessor="start"
            endAccessor="end"
            style={{ height: "100%" }}
            popup
            views={["month", "week", "day"]}
            eventPropGetter={(event) => ({
              style: {
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                borderRadius: '4px',
                border: 'none',
                padding: '2px 5px'
              },
            })}
            onSelectEvent={handleEventClick}
            onSelectSlot={({ start }) => handleSelectDate(start)}
            selectable
          />
        </div>
      )}

      {/* Goal Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>{selectedGoal?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedGoal && (
            <Form>
              <Row>
                <Col md={6}>
                  <InputField
                    label="Start Date"
                    type="date"
                    value={moment(selectedGoal.start).format('YYYY-MM-DD')}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="End Date"
                    type="date"
                    value={moment(selectedGoal.end).format('YYYY-MM-DD')}
                    disabled
                  />
                </Col>
              </Row>
              <InputField
                label="Description"
                as="textarea"
                rows={3}
                value={selectedGoal.description}
                disabled
              />
              <Row>
                <Col md={6}>
                  <InputField
                    label="Status"
                    as="select"
                    value={selectedGoal.status}
                    options={GOAL_STATUS}
                    disabled
                  />
                </Col>
                <Col md={6}>
                  <InputField
                    label="Category"
                    as="select"
                    value={selectedGoal.category}
                    options={GOAL_CATEGORIES}
                    disabled
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDeleteGoal}>
            Delete Goal
          </Button>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* New Goal Form */}
      <Modal show={showInputFields} onHide={() => setShowInputFields(false)} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>New Goal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <InputField
              label="Goal Name"
              name="name"
              value={newGoal.name}
              onChange={handleChange}
              required
            />
            <InputField
              label="Description"
              name="description"
              as="textarea"
              rows={3}
              value={newGoal.description}
              onChange={handleChange}
            />
            <Row>
              <Col md={6}>
                <InputField
                  label="Category"
                  name="category"
                  as="select"
                  value={newGoal.category}
                  options={GOAL_CATEGORIES}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="Weightage"
                  name="weightage"
                  type="number"
                  value={newGoal.weightage}
                  onChange={handleChange}
                  min="0"
                  max="1"
                  step="0.1"
                />
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <InputField
                  label="Start Date"
                  name="start_date"
                  type="date"
                  value={newGoal.start_date}
                  onChange={handleChange}
                />
              </Col>
              <Col md={6}>
                <InputField
                  label="End Date"
                  name="end_date"
                  type="date"
                  value={newGoal.end_date}
                  onChange={handleChange}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInputFields(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveGoal}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            Save Goal
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Goals;
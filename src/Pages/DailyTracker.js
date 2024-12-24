import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, ProgressBar, Badge } from 'react-bootstrap';
import moment from 'moment';
import axios from 'axios';
import { theme } from '../theme';
import InputField from '../components/InputField';
import { Toast } from '../components/Toast';
import { API_BASE_URL } from '../config/api';

const HABIT_CATEGORIES = {
  health: { label: 'Health & Fitness', color: '#28a745' },
  learning: { label: 'Learning & Growth', color: '#17a2b8' },
  productivity: { label: 'Productivity', color: '#ffc107' },
  mindfulness: { label: 'Mindfulness', color: '#6f42c1' },
  social: { label: 'Social & Family', color: '#e83e8c' },
  career: { label: 'Career', color: '#fd7e14' }
};

const FREQUENCIES = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' }
];

const PRIORITIES = [
  { value: 'high', label: 'High', color: '#dc3545' },
  { value: 'medium', label: 'Medium', color: '#ffc107' },
  { value: 'low', label: 'Low', color: '#28a745' }
];

const DailyTracker = () => {
  const [habits, setHabits] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const [newHabit, setNewHabit] = useState({
    name: '',
    category: '',
    frequency: 'daily',
    priority: 'medium',
    description: '',
    target_value: 1,
    unit: '',
    reminder_time: ''
  });

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/habits/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setHabits(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: 'Error fetching habits',
        variant: 'danger'
      });
    }
  };

  const handleHabitSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_BASE_URL}/habits/`, newHabit, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json'
        }
      });
      fetchHabits();
      setShowAddForm(false);
      setNewHabit({
        name: '',
        category: '',
        frequency: 'daily',
        priority: 'medium',
        description: '',
        target_value: 1,
        unit: '',
        reminder_time: ''
      });
      setToast({
        show: true,
        message: 'Habit created successfully!',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Error creating habit',
        variant: 'danger'
      });
    }
  };

  const handleComplete = async (habitId) => {
    try {
      await axios.post(`${API_BASE_URL}/habits/${habitId}/complete/`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      fetchHabits();
      setToast({
        show: true,
        message: 'Progress updated!',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Error updating progress',
        variant: 'danger'
      });
    }
  };

  const renderHabitCard = (habit) => (
    <Card key={habit.id} className="mb-3" style={{ borderLeft: `4px solid ${HABIT_CATEGORIES[habit.category]?.color || '#6c757d'}` }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0">{habit.name}</h5>
              <Badge 
                bg={habit.priority === 'high' ? 'danger' : habit.priority === 'medium' ? 'warning' : 'success'}
                className="ms-2"
              >
                {habit.priority}
              </Badge>
            </div>
            <p className="text-muted mb-2">
              {HABIT_CATEGORIES[habit.category]?.label} • {habit.frequency}
              {habit.reminder_time && ` • ${moment(habit.reminder_time, 'HH:mm:ss').format('h:mm A')}`}
            </p>
            {habit.description && <p className="mb-2">{habit.description}</p>}
            <div className="d-flex align-items-center">
              <small className="text-muted me-3">
                Streak: {habit.streak} days
              </small>
              <small className="text-muted">
                Last completed: {habit.last_completed ? moment(habit.last_completed).format('MMM D, YYYY') : 'Never'}
              </small>
            </div>
          </div>
          <Button
            variant={habit.streak > 0 ? "success" : "outline-success"}
            onClick={() => handleComplete(habit.id)}
          >
            {habit.streak > 0 ? '✓ Done Today' : 'Mark Complete'}
          </Button>
        </div>
        {habit.target_value > 1 && (
          <ProgressBar 
            className="mt-3"
            now={(habit.streak / habit.target_value) * 100}
            label={`${habit.streak}/${habit.target_value} ${habit.unit}`}
          />
        )}
      </Card.Body>
    </Card>
  );

  const filteredHabits = habits.filter(habit => 
    selectedCategory === 'all' || habit.category === selectedCategory
  );

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>Habit Tracker</h2>
        <Button
          onClick={() => setShowAddForm(true)}
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            border: 'none'
          }}
        >
          Add New Habit
        </Button>
      </div>

      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-3">Filter by Category</h5>
              <div className="d-grid gap-2">
                <Button
                  variant={selectedCategory === 'all' ? 'primary' : 'outline-primary'}
                  onClick={() => setSelectedCategory('all')}
                >
                  All Habits
                </Button>
                {Object.entries(HABIT_CATEGORIES).map(([value, { label, color }]) => (
                  <Button
                    key={value}
                    variant="outline-primary"
                    style={{
                      borderColor: color,
                      color: selectedCategory === value ? 'white' : color,
                      backgroundColor: selectedCategory === value ? color : 'transparent'
                    }}
                    onClick={() => setSelectedCategory(value)}
                  >
                    {label}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>

          {/* Stats Card */}
          <Card>
            <Card.Body>
              <h5 className="mb-3">Quick Stats</h5>
              <div className="mb-3">
                <div className="text-muted mb-1">Total Habits</div>
                <h3>{habits.length}</h3>
              </div>
              <div className="mb-3">
                <div className="text-muted mb-1">Active Streaks</div>
                <h3>{habits.filter(h => h.streak > 0).length}</h3>
              </div>
              <div>
                <div className="text-muted mb-1">Completion Rate</div>
                <h3>
                  {habits.length ? 
                    `${Math.round((habits.filter(h => h.streak > 0).length / habits.length) * 100)}%`
                    : '0%'}
                </h3>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col md={9}>
          {showAddForm ? (
            <Card className="mb-4">
              <Card.Header style={{ background: theme.colors.primary, color: 'white' }}>
                <h5 className="mb-0">Add New Habit</h5>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleHabitSubmit}>
                  <Row>
                    <Col md={6}>
                      <InputField
                        label="Habit Name"
                        value={newHabit.name}
                        onChange={(e) => setNewHabit({ ...newHabit, name: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          value={newHabit.category}
                          onChange={(e) => setNewHabit({ ...newHabit, category: e.target.value })}
                          required
                        >
                          <option value="">Select Category</option>
                          {Object.entries(HABIT_CATEGORIES).map(([value, { label }]) => (
                            <option key={value} value={value}>{label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Frequency</Form.Label>
                        <Form.Select
                          value={newHabit.frequency}
                          onChange={(e) => setNewHabit({ ...newHabit, frequency: e.target.value })}
                        >
                          {FREQUENCIES.map(freq => (
                            <option key={freq.value} value={freq.value}>{freq.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>Priority</Form.Label>
                        <Form.Select
                          value={newHabit.priority}
                          onChange={(e) => setNewHabit({ ...newHabit, priority: e.target.value })}
                        >
                          {PRIORITIES.map(priority => (
                            <option key={priority.value} value={priority.value}>{priority.label}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <InputField
                        label="Reminder Time"
                        type="time"
                        value={newHabit.reminder_time}
                        onChange={(e) => setNewHabit({ ...newHabit, reminder_time: e.target.value })}
                      />
                    </Col>
                  </Row>

                  <InputField
                    label="Description"
                    as="textarea"
                    rows={3}
                    value={newHabit.description}
                    onChange={(e) => setNewHabit({ ...newHabit, description: e.target.value })}
                  />

                  <div className="mt-3">
                    <Button type="submit" className="me-2">Save Habit</Button>
                    <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          ) : (
            <div className="habits-list">
              {filteredHabits.length > 0 ? (
                filteredHabits.map(renderHabitCard)
              ) : (
                <Card className="text-center p-5">
                  <Card.Body>
                    <h4>No habits found</h4>
                    <p className="text-muted">
                      {selectedCategory === 'all' 
                        ? "You haven't created any habits yet." 
                        : `You don't have any habits in this category.`}
                    </p>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                        border: 'none'
                      }}
                    >
                      Create Your First Habit
                    </Button>
                  </Card.Body>
                </Card>
              )}
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default DailyTracker;
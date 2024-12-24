import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import axios from 'axios';
import { theme } from '../theme';
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch goals
      const goalsResponse = await axios.get('http://dordod.com/api/main-goals/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      // Fetch habits
      const habitsResponse = await axios.get('http://dordod.com/api/habits/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      // Combine and format events
      const goalEvents = goalsResponse.data.map(goal => ({
        id: `goal-${goal.id}`,
        title: goal.name,
        start: new Date(goal.start_date),
        end: new Date(goal.end_date),
        type: 'goal',
        status: goal.status
      }));

      const habitEvents = habitsResponse.data.map(habit => ({
        id: `habit-${habit.id}`,
        title: habit.name,
        start: new Date(habit.created_at),
        end: new Date(habit.created_at),
        type: 'habit',
        completed: habit.streak > 0
      }));

      setEvents([...goalEvents, ...habitEvents]);
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

  const eventStyleGetter = (event) => {
    let style = {
      borderRadius: '4px',
      opacity: 0.8,
      border: 'none',
      display: 'block',
      color: 'white'
    };

    if (event.type === 'goal') {
      style.backgroundColor = event.status === 'completed' ? '#28a745' : '#ffc107';
    } else {
      style.backgroundColor = event.completed ? '#28a745' : '#6c757d';
    }

    return { style };
  };

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Row className="mb-4">
        <Col>
          <h2 style={{ color: theme.colors.primary }}>Dashboard</h2>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Body>
              <h5>Goals</h5>
              <h3>{events.filter(e => e.type === 'goal').length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Body>
              <h5>Active Habits</h5>
              <h3>{events.filter(e => e.type === 'habit' && e.completed).length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Body>
              <h5>Upcoming Tasks</h5>
              <h3>{events.filter(e => new Date(e.start) > new Date()).length}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
            <Card.Body>
              <h5>Completed</h5>
              <h3>
                {events.filter(e => 
                  (e.type === 'goal' && e.status === 'completed') || 
                  (e.type === 'habit' && e.completed)
                ).length}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Body>
          <div style={{ height: 600 }}>
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: '100%' }}
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day']}
              popup
              tooltipAccessor={event => `${event.title} (${event.type})`}
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Dashboard;

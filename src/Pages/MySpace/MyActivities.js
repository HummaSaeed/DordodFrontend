import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Badge, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaRunning, FaBook, FaLaptop, FaUsers, FaCalendarAlt, FaTrash, FaEdit, FaShare, FaChartLine } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';
import { DashboardCard, ActionButton, StatusBadge, ProgressIndicator } from '../../components/SharedComponents';
import { activitiesApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useForm } from '../../hooks/useForm';
import { calculateProgress, formatDate } from '../../utils/helpers';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MyActivities = () => {
  const { state, dispatch } = useApp();
  const [activities, setActivities] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [newActivity, setNewActivity] = useState({
    title: '',
    type: 'physical',
    date: new Date().toISOString().split('T')[0],
    duration: '',
    description: '',
    status: 'planned'
  });

  // Add new features
  const [activityStats, setActivityStats] = useState({
    weeklyProgress: 0,
    monthlyProgress: 0,
    totalActivities: 0,
    completedActivities: 0
  });

  const [activityTrends, setActivityTrends] = useState([]);

  const [filters, setFilters] = useState({
    type: '',
    status: '',
    date: ''
  });
  const [showStats, setShowStats] = useState(false);

  const activityTypes = [
    { value: 'physical', label: 'Physical Activity', icon: FaRunning },
    { value: 'learning', label: 'Learning', icon: FaBook },
    { value: 'work', label: 'Work', icon: FaLaptop },
    { value: 'social', label: 'Social', icon: FaUsers }
  ];

  useEffect(() => {
    fetchActivities();
    fetchActivityStats();
    fetchActivityTrends();
  }, []);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await activitiesApi.getAll();
      setActivities(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityStats = async () => {
    try {
      const response = await activitiesApi.getStats();
      setActivityStats(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivityTrends = async () => {
    try {
      const response = await activitiesApi.getTrends();
      setActivityTrends(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedActivity) {
        await activitiesApi.update(selectedActivity.id, newActivity);
      } else {
        await activitiesApi.create(newActivity);
      }
      fetchActivities();
      setShowModal(false);
      setNewActivity({
        title: '',
        type: 'physical',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        description: '',
        status: 'planned'
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await activitiesApi.delete(id);
      setToast({
        show: true,
        message: 'Activity deleted successfully!',
        variant: 'success'
      });
      fetchActivities();
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to delete activity',
        variant: 'danger'
      });
    }
  };

  const handleShare = async (activity) => {
    try {
      await activitiesApi.share(activity.id, {
        platform: 'connections',
        message: `Check out my activity: ${activity.title}`
      });
      // Show success message
    } catch (err) {
      console.error(err);
    }
  };

  const ActivityCard = ({ activity }) => {
    const TypeIcon = activityTypes.find(t => t.value === activity.type)?.icon || FaCalendarAlt;
    
    return (
      <DashboardCard
        title={
          <div className="d-flex align-items-center">
            <TypeIcon className="me-2" />
            {activity.title}
          </div>
        }
        headerAction={
          <StatusBadge status={activity.status} />
        }
      >
        <div>
          <p className="text-muted">{activity.description}</p>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {new Date(activity.date).toLocaleDateString()}
            </small>
            <div>
              <ActionButton
                icon={FaEdit}
                label="Edit"
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => {
                  setSelectedActivity(activity);
                  setNewActivity(activity);
                  setShowModal(true);
                }}
              />
              <ActionButton
                icon={FaTrash}
                label="Delete"
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(activity.id)}
              />
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  };

  const StatsCard = () => (
    <DashboardCard title="Activity Statistics">
      <Row>
        <Col md={6}>
          <div className="text-center mb-4">
            <h3>{activityStats.weeklyProgress}%</h3>
            <p>Weekly Progress</p>
          </div>
        </Col>
        <Col md={6}>
          <div className="text-center mb-4">
            <h3>{activityStats.monthlyProgress}%</h3>
            <p>Monthly Progress</p>
          </div>
        </Col>
      </Row>
      <div className="mt-4">
        <h6>Activity Trends</h6>
        <LineChart width={400} height={200} data={activityTrends}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="completed" stroke="#82ca9d" name="Completed" />
          <Line type="monotone" dataKey="planned" stroke="#8884d8" name="Planned" />
        </LineChart>
      </div>
    </DashboardCard>
  );

  const ActivityFilters = () => (
    <Form className="mb-4">
      <Row>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Type</Form.Label>
            <Form.Select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              {activityTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            >
              <option value="">All Status</option>
              <option value="planned">Planned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Date Range</Form.Label>
            <Form.Control
              type="date"
              value={filters.date}
              onChange={(e) => setFilters({ ...filters, date: e.target.value })}
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>My Activities</h2>
        <div>
          <ActionButton
            icon={FaChartLine}
            label="View Stats"
            variant="outline-primary"
            className="me-2"
            onClick={() => setShowStats(true)}
          />
          <ActionButton
            icon={FaPlus}
            label="Add Activity"
            onClick={() => {
              setSelectedActivity(null);
              setShowModal(true);
            }}
          />
        </div>
      </div>

      <ActivityFilters />

      <Row>
        <Col md={8}>
          {loading ? (
            <div className="text-center py-4">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-4">No activities found. Add your first activity!</div>
          ) : (
            activities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))
          )}
        </Col>

        <Col md={4}>
          <StatsCard />
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>{selectedActivity ? 'Edit Activity' : 'Add New Activity'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newActivity.title}
                onChange={(e) => setNewActivity({ ...newActivity, title: e.target.value })}
                placeholder="Enter activity title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newActivity.type}
                onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
              >
                {activityTypes.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={newActivity.date}
                    onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newActivity.duration}
                    onChange={(e) => setNewActivity({ ...newActivity, duration: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newActivity.description}
                onChange={(e) => setNewActivity({ ...newActivity, description: e.target.value })}
                placeholder="Enter activity description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newActivity.status}
                onChange={(e) => setNewActivity({ ...newActivity, status: e.target.value })}
              >
                <option value="planned">Planned</option>
                <option value="completed">Completed</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            {loading ? 'Saving...' : (selectedActivity ? 'Update' : 'Add')}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyActivities; 
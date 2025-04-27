import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, ProgressBar, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaBrain, FaBriefcase, FaChalkboard, FaUser, 
  FaGlobe, FaFileAlt, FaBullseye, FaBook, FaNewspaper 
} from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { theme } from '../theme';
import { Chart } from 'react-google-charts';

const DashboardHome = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    goals: { total: 0, completed: 0 },
    habits: { total: 0, active: 0 },
    courses: { total: 0, inProgress: 0 },
    certificates: { total: 0 }
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const quickAccessCards = [
    { 
      title: 'Frame of Mind',
      icon: FaBrain,
      path: '/dashboard/my-space/frame-of-mind',
      color: '#28a745',
      description: 'Track your daily mood and mindset'
    },
    { 
      title: 'Posts',
      icon: FaNewspaper,
      path: '/dashboard/my-work/posts',
      color: '#17a2b8',
      description: 'Share updates and connect'
    },
    { 
      title: 'Whiteboard',
      icon: FaChalkboard,
      path: '/dashboard/tools/whiteboard',
      color: '#ffc107',
      description: 'Collaborative workspace'
    },
    { 
      title: 'Personal Info',
      icon: FaUser,
      path: '/dashboard/personal-information',
      color: '#dc3545',
      description: 'Manage your profile'
    },
    { 
      title: 'Professional Info',
      icon: FaBriefcase,
      path: '/dashboard/professional-information',
      color: '#6f42c1',
      description: 'Career details'
    },
    { 
      title: 'Global Info',
      icon: FaGlobe,
      path: '/dashboard/global-information',
      color: '#fd7e14',
      description: 'Global presence'
    }
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`http://dordod.com/api/dashboard/stats/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setStats(response.data.stats);
      setRecentActivities(response.data.recent_activities);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color, link }) => (
    <Card className="stat-card h-100">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="mb-1" style={{ color }}>{value}</h3>
            <small className="text-muted">{subtitle}</small>
          </div>
          <div className="stat-icon" style={{ backgroundColor: `${color}20`, color }}>
            {icon}
          </div>
        </div>
        {link && (
          <Link to={link} className="stretched-link" />
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid>
      {/* Quick Access Section */}
      <Row className="mb-4">
        <Col>
          <h4 className="mb-4">Quick Access</h4>
          <Row className="g-3">
            {quickAccessCards.map((card, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="h-100 quick-access-card"
                  onClick={() => navigate(card.path)}
                  style={{ cursor: 'pointer' }}
                >
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <div
                        style={{
                          width: '45px',
                          height: '45px',
                          borderRadius: '12px',
                          backgroundColor: `${card.color}20`,
                          color: card.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          marginRight: '15px'
                        }}
                      >
                        <card.icon />
                      </div>
                      <div>
                        <h5 className="mb-1">{card.title}</h5>
                        <small className="text-muted">{card.description}</small>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>

      {/* Stats Overview */}
      <Row className="g-4 mb-4">
        <Col md={3}>
          <StatCard
            title="Goals"
            value={stats.goals.total}
            subtitle={`${stats.goals.completed} Completed`}
            icon="🎯"
            color="#28a745"
            link="/dashboard/goals"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Active Habits"
            value={stats.habits.active}
            subtitle={`of ${stats.habits.total} Total`}
            icon="⭐"
            color="#17a2b8"
            link="/dashboard/habits"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Courses"
            value={stats.courses.inProgress}
            subtitle="In Progress"
            icon="📚"
            color="#ffc107"
            link="/dashboard/courses"
          />
        </Col>
        <Col md={3}>
          <StatCard
            title="Certificates"
            value={stats.certificates.total}
            subtitle="Earned"
            icon="🎓"
            color="#dc3545"
            link="/dashboard/certificates"
          />
        </Col>
      </Row>

      {/* Progress Charts */}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Goal Progress</h5>
              <Chart
                width={'100%'}
                height={'300px'}
                chartType="LineChart"
                loader={<div>Loading Chart...</div>}
                data={[
                  ['Date', 'Completed Goals'],
                  ...recentActivities
                    .filter(activity => activity.type === 'goal')
                    .map(activity => [new Date(activity.date), activity.value])
                ]}
                options={{
                  curveType: 'function',
                  legend: { position: 'none' },
                  colors: ['#28a745']
                }}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <h5 className="mb-4">Recent Activities</h5>
              <div className="activity-timeline">
                {recentActivities.slice(0, 5).map((activity, index) => (
                  <div key={index} className="activity-item">
                    <div className="activity-icon">
                      {activity.type === 'goal' ? '🎯' : 
                       activity.type === 'habit' ? '⭐' : 
                       activity.type === 'course' ? '📚' : '🎓'}
                    </div>
                    <div className="activity-content">
                      <p className="mb-0">{activity.description}</p>
                      <small className="text-muted">
                        {new Date(activity.date).toLocaleDateString()}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h5 className="mb-4">Quick Actions</h5>
              <div className="d-flex gap-3">
                <Button as={Link} to="/dashboard/goals/new" variant="outline-success">
                  Set New Goal
                </Button>
                <Button as={Link} to="/dashboard/habits/new" variant="outline-info">
                  Create Habit
                </Button>
                <Button as={Link} to="/dashboard/courses" variant="outline-warning">
                  Browse Courses
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

  
    </Container>
  );
};

export default DashboardHome; 
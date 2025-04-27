import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { FaStar, FaGraduationCap, FaUsers, FaClock } from 'react-icons/fa';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { coachApi } from '../../services/api';
import { useApp } from '../../context/AppContext';

const IAmCoach = () => {
  const [profile, setProfile] = useState({
    expertise: [],
    availability: '',
    rate: 0,
    bio: '',
    certificates: [],
    experience: ''
  });
  const [students, setStudents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchCoachData();
  }, []);

  const fetchCoachData = async () => {
    setLoading(true);
    try {
      const [profileRes, studentsRes, sessionsRes] = await Promise.all([
        coachApi.getProfile(),
        coachApi.getStudents(),
        coachApi.getSessions()
      ]);
      setProfile(profileRes.data);
      setStudents(studentsRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      setError('Failed to load coach data');
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await coachApi.updateProfile(profile);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Row>
        <Col md={8}>
          <DashboardCard title="Coach Profile">
            <Form onSubmit={handleProfileUpdate}>
              <Form.Group className="mb-3">
                <Form.Label>Areas of Expertise</Form.Label>
                <Form.Control
                  as="select"
                  multiple
                  value={profile.expertise}
                  onChange={(e) => setProfile({
                    ...profile,
                    expertise: Array.from(e.target.selectedOptions, option => option.value)
                  })}
                >
                  <option value="career">Career Development</option>
                  <option value="leadership">Leadership</option>
                  <option value="technical">Technical Skills</option>
                  <option value="soft-skills">Soft Skills</option>
                </Form.Control>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Hourly Rate ($)</Form.Label>
                <Form.Control
                  type="number"
                  value={profile.rate}
                  onChange={(e) => setProfile({ ...profile, rate: e.target.value })}
                />
              </Form.Group>

              <ActionButton
                type="submit"
                disabled={loading}
                label={loading ? 'Saving...' : 'Save Profile'}
              />
            </Form>
          </DashboardCard>
        </Col>

        <Col md={4}>
          <DashboardCard title="Statistics">
            <div className="text-center mb-4">
              <h2>{students.length}</h2>
              <p>Active Students</p>
            </div>
            <div className="text-center mb-4">
              <h2>{sessions.length}</h2>
              <p>Sessions Completed</p>
            </div>
            <div className="text-center">
              <h2>{profile.rating || 0}/5</h2>
              <p>Average Rating</p>
            </div>
          </DashboardCard>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <DashboardCard title="Upcoming Sessions">
            {sessions.map(session => (
              <Card key={session.id} className="mb-3">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5>{session.student.name}</h5>
                      <p className="text-muted mb-0">
                        {new Date(session.date).toLocaleDateString()}
                      </p>
                    </div>
                    <ActionButton
                      label="Start Session"
                      onClick={() => {/* Handle session start */}}
                    />
                  </div>
                </Card.Body>
              </Card>
            ))}
          </DashboardCard>
        </Col>
      </Row>
    </Container>
  );
};

export default IAmCoach; 
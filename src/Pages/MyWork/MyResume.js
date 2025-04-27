import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Nav } from 'react-bootstrap';
import { FaDownload, FaEdit, FaEye } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const MyResume = () => {
  const [activeTab, setActiveTab] = useState('editor');
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  // Required APIs:
  // GET /api/resume - Get user's resume data
  // PUT /api/resume - Update resume data
  // POST /api/resume/generate-pdf - Generate PDF version
  // GET /api/resume/templates - Get available templates

  const handleSave = async () => {
    try {
      setLoading(true);
      // API call to save resume data
      setToast({
        show: true,
        message: 'Resume saved successfully!',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to save resume',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>My Resume</h2>
        <div>
          <Button variant="outline-primary" className="me-2">
            <FaEye className="me-2" /> Preview
          </Button>
          <Button variant="outline-success" className="me-2">
            <FaDownload className="me-2" /> Download PDF
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            <FaEdit className="me-2" /> Save Changes
          </Button>
        </div>
      </div>

      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <Nav variant="tabs" className="border-0">
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'editor'}
                onClick={() => setActiveTab('editor')}
                className="text-white"
              >
                Editor
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                active={activeTab === 'templates'}
                onClick={() => setActiveTab('templates')}
                className="text-white"
              >
                Templates
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'editor' ? (
            <Form>
              <h5 className="mb-3">Personal Information</h5>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, name: e.target.value }
                      })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => setResumeData({
                        ...resumeData,
                        personalInfo: { ...resumeData.personalInfo, email: e.target.value }
                      })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <h5 className="mb-3 mt-4">Professional Experience</h5>
              {resumeData.experience.map((exp, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    {/* Experience form fields */}
                  </Card.Body>
                </Card>
              ))}
              <Button variant="outline-primary" className="mb-4">
                Add Experience
              </Button>

              <h5 className="mb-3">Education</h5>
              {resumeData.education.map((edu, index) => (
                <Card key={index} className="mb-3">
                  <Card.Body>
                    {/* Education form fields */}
                  </Card.Body>
                </Card>
              ))}
              <Button variant="outline-primary" className="mb-4">
                Add Education
              </Button>

              <h5 className="mb-3">Skills</h5>
              <Form.Group className="mb-4">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter your skills (comma-separated)"
                />
              </Form.Group>
            </Form>
          ) : (
            <Row>
              {/* Resume templates will be displayed here */}
            </Row>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MyResume; 
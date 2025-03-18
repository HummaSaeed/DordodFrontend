import React, { useState, useEffect } from 'react';
import './course.css';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import { theme } from '../theme';
import { Toast } from '../components/Toast';
import { handleApiError } from '../utils/apiErrorHandler';
import { API_BASE_URL } from '../config/api';

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`http://dordod.com/api/courses/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setCourses(response.data);
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

  const handleShowDetails = (course) => {
    setSelectedCourse(course);
    setShowModal(true);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <h2 style={{ color: theme.colors.primary, marginBottom: '30px' }}>
        Available Courses
      </h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <Row>
          {courses.map((course) => (
            <Col key={course.id} md={4} className="mb-4">
              <Card style={{ height: '100%', boxShadow: theme.shadows.sm }}>
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <div className="mb-3">
                    <strong>Duration: </strong>
                    {formatDate(course.start_date)} - {formatDate(course.end_date)}
                  </div>
                  <div className="mb-3">
                    <strong>Credit Hours: </strong>{course.credit_hours}
                  </div>
                  <div className="mb-3">
                    <strong>Price: </strong>
                    {course.discounted_price ? (
                      <>
                        <span style={{ textDecoration: 'line-through', color: '#999' }}>
                          ${course.price}
                        </span>
                        <span className="ms-2" style={{ color: theme.colors.primary }}>
                          ${course.discounted_price}
                        </span>
                      </>
                    ) : (
                      `$${course.price}`
                    )}
                  </div>
                  <Button
                    onClick={() => handleShowDetails(course)}
                    style={{
                      backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                      border: 'none'
                    }}
                  >
                    View Details
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Course Details Modal */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
      >
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>{selectedCourse?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCourse && (
            <>
              <h5>Course Description</h5>
              <p>{selectedCourse.description}</p>

              <h5 className="mt-4">Course Details</h5>
              <ul className="list-unstyled">
                <li><strong>Duration:</strong> {formatDate(selectedCourse.start_date)} - {formatDate(selectedCourse.end_date)}</li>
                <li><strong>Credit Hours:</strong> {selectedCourse.credit_hours}</li>
                <li><strong>Price:</strong> ${selectedCourse.final_price}</li>
                <li><strong>Status:</strong> {selectedCourse.is_active ? 'Active' : 'Inactive'}</li>
              </ul>

              <h5 className="mt-4">Course Lectures</h5>
              {selectedCourse.course_lectures.length > 0 ? (
                <div className="list-group">
                  {selectedCourse.course_lectures.map((lecture) => (
                    <div key={lecture.id} className="list-group-item">
                      <h6>{lecture.title}</h6>
                      <p>{lecture.description}</p>
                      {lecture.video_file && (
                        <video width="100%" controls>
                          <source src={lecture.video_file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p>No lectures available yet.</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          {selectedCourse && !selectedCourse.is_purchased && (
            <Button
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                border: 'none'
              }}
            >
              Purchase Course
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Courses;

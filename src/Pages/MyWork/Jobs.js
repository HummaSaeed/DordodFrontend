import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Badge, Spinner } from 'react-bootstrap';
import { FaSearch, FaBookmark, FaShare, FaMapMarkerAlt, FaBriefcase, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    what: '',
    where: '',
    category: '',
    contract_type: ''
  });
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [savedJobs, setSavedJobs] = useState([]);

  // Replace with your Adzuna API credentials
  const API_KEY = `8b6f6362fada6156142dbc3e9f3d5c2b`;
  const APP_ID = `4905f507`;
  const BASE_URL = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${APP_ID}&app_key=${API_KEY}`;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchParams).toString();
      const response = await axios.get(`${BASE_URL}&${queryParams}`);
      setJobs(response.data.results);
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to fetch jobs',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      if (prev.includes(jobId)) {
        return prev.filter(id => id !== jobId);
      }
      return [...prev, jobId];
    });
  };

  const JobCard = ({ job }) => (
    <Card className="mb-3" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Body>
        <div className="d-flex justify-content-between">
          <div>
            <h5>{job.title}</h5>
            <p className="text-muted mb-2">
              <FaBriefcase className="me-2" />{job.company.display_name}
            </p>
            <p className="mb-2">
              <FaMapMarkerAlt className="me-2" />{job.location.display_name}
            </p>
            <div className="mb-2">
              <Badge bg="primary" className="me-2">{job.category.label}</Badge>
              <Badge bg="info">{job.contract_time}</Badge>
            </div>
            <p className="mb-2">{job.description}</p>
            <small className="text-muted">
              <FaClock className="me-2" />
              Posted {new Date(job.created).toLocaleDateString()}
            </small>
          </div>
          <div>
            <Button
              variant={savedJobs.includes(job.id) ? "success" : "outline-primary"}
              size="sm"
              className="mb-2"
              onClick={() => handleSaveJob(job.id)}
            >
              <FaBookmark />
            </Button>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => window.open(job.redirect_url, '_blank')}
            >
              <FaShare />
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Row>
        <Col md={4}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Search Jobs</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSearch}>
                <Form.Group className="mb-3">
                  <Form.Label>Keywords</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Job title, keywords, or company"
                    value={searchParams.what}
                    onChange={(e) => setSearchParams({ ...searchParams, what: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City, state, or country"
                    value={searchParams.where}
                    onChange={(e) => setSearchParams({ ...searchParams, where: e.target.value })}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={searchParams.category}
                    onChange={(e) => setSearchParams({ ...searchParams, category: e.target.value })}
                  >
                    <option value="">All Categories</option>
                    <option value="it-jobs">IT Jobs</option>
                    <option value="engineering-jobs">Engineering</option>
                    <option value="accounting-finance-jobs">Finance</option>
                    {/* Add more categories */}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Job Type</Form.Label>
                  <Form.Select
                    value={searchParams.contract_type}
                    onChange={(e) => setSearchParams({ ...searchParams, contract_type: e.target.value })}
                  >
                    <option value="">All Types</option>
                    <option value="full_time">Full Time</option>
                    <option value="part_time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="permanent">Permanent</option>
                  </Form.Select>
                </Form.Group>

                <Button
                  type="submit"
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none'
                  }}
                  className="w-100"
                >
                  <FaSearch className="me-2" />
                  Search Jobs
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Job Listings</h5>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2">Loading jobs...</p>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-5">
                  <h5>No jobs found matching your criteria</h5>
                  <p>Try adjusting your search filters</p>
                </div>
              ) : (
                jobs.map(job => <JobCard key={job.id} job={job} />)
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Jobs; 
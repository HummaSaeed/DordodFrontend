import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { 
  FaTrophy, FaPlus, FaShare, FaEdit, FaTrash, FaMedal, 
  FaCertificate, FaBriefcase, FaGraduationCap, FaStar 
} from 'react-icons/fa';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { accomplishmentsApi } from '../../services/api';
import { useApp } from '../../context/AppContext';
import { useForm } from '../../hooks/useForm';
import { formatDate } from '../../utils/helpers';

const MyAccomplishments = () => {
  const { state, dispatch } = useApp();
  const [accomplishments, setAccomplishments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedAccomplishment, setSelectedAccomplishment] = useState(null);
  const [newAccomplishment, setNewAccomplishment] = useState({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: 'professional',
    impact: '',
    evidence: null,
    isPublic: false
  });

  const categories = [
    { value: 'professional', label: 'Professional', icon: FaBriefcase },
    { value: 'academic', label: 'Academic', icon: FaGraduationCap },
    { value: 'personal', label: 'Personal', icon: FaStar },
    { value: 'certification', label: 'Certification', icon: FaCertificate }
  ];

  useEffect(() => {
    fetchAccomplishments();
  }, []);

  const fetchAccomplishments = async () => {
    setLoading(true);
    try {
      const response = await accomplishmentsApi.getAll();
      setAccomplishments(response.data);
      // Update progress report
      dispatch({
        type: 'UPDATE_PROGRESS',
        payload: {
          ...state.progress,
          accomplishments: response.data.length
        }
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      if (selectedAccomplishment) {
        await accomplishmentsApi.update(selectedAccomplishment.id, newAccomplishment);
      } else {
        await accomplishmentsApi.create(newAccomplishment);
      }
      fetchAccomplishments();
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (accomplishment) => {
    try {
      await accomplishmentsApi.share(accomplishment.id, {
        platform: 'connections', // or 'linkedin', 'email', etc.
        message: `Check out my accomplishment: ${accomplishment.title}`
      });
      // Show success message
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await accomplishmentsApi.delete(id);
      fetchAccomplishments();
    } catch (err) {
      console.error('Failed to delete accomplishment:', err);
    }
  };

  const resetForm = () => {
    setNewAccomplishment({
      title: '',
      description: '',
      date: new Date().toISOString().split('T')[0],
      category: 'professional',
      impact: '',
      evidence: null,
      isPublic: false
    });
    setSelectedAccomplishment(null);
  };

  const AccomplishmentCard = ({ accomplishment }) => {
    const CategoryIcon = categories.find(c => c.value === accomplishment.category)?.icon || FaTrophy;
    
    return (
      <DashboardCard
        title={
          <div className="d-flex align-items-center">
            <CategoryIcon className="me-2" />
            {accomplishment.title}
          </div>
        }
        headerAction={
          accomplishment.isPublic ? 
            <Badge bg="success">Public</Badge> : 
            <Badge bg="secondary">Private</Badge>
        }
      >
        <div>
          <p className="text-muted">{accomplishment.description}</p>
          {accomplishment.impact && (
            <p className="text-success">
              <strong>Impact:</strong> {accomplishment.impact}
            </p>
          )}
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              {new Date(accomplishment.date).toLocaleDateString()}
            </small>
            <div>
              <ActionButton
                icon={FaEdit}
                label="Edit"
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => {
                  setSelectedAccomplishment(accomplishment);
                  setNewAccomplishment(accomplishment);
                  setShowModal(true);
                }}
              />
              <ActionButton
                icon={FaShare}
                label="Share"
                variant="outline-success"
                size="sm"
                className="me-2"
                onClick={() => handleShare(accomplishment)}
              />
              <ActionButton
                icon={FaTrash}
                label="Delete"
                variant="outline-danger"
                size="sm"
                onClick={() => handleDelete(accomplishment.id)}
              />
            </div>
          </div>
        </div>
      </DashboardCard>
    );
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Accomplishments</h2>
        <ActionButton
          icon={FaPlus}
          label="Add Accomplishment"
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
        />
      </div>

      <Row>
        <Col md={8}>
          {accomplishments.map(accomplishment => (
            <AccomplishmentCard 
              key={accomplishment.id} 
              accomplishment={accomplishment} 
            />
          ))}
        </Col>

        <Col md={4}>
          <DashboardCard title="Accomplishments Summary">
            <div className="text-center mb-4">
              <FaTrophy size={40} className="text-warning mb-3" />
              <h3>{accomplishments.length}</h3>
              <p>Total Accomplishments</p>
            </div>
            <div>
              {categories.map(category => (
                <div key={category.value} className="d-flex align-items-center mb-2">
                  <category.icon className="me-2" />
                  <span>{category.label}</span>
                  <div className="ms-auto">
                    {accomplishments.filter(a => a.category === category.value).length}
                  </div>
                </div>
              ))}
            </div>
          </DashboardCard>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAccomplishment ? 'Edit Accomplishment' : 'Add New Accomplishment'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Form fields */}
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={newAccomplishment.title}
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  title: e.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={newAccomplishment.category}
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  category: e.target.value
                })}
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newAccomplishment.description}
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  description: e.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Impact</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={newAccomplishment.impact}
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  impact: e.target.value
                })}
                placeholder="Describe the impact of this accomplishment..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                value={newAccomplishment.date}
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  date: e.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Evidence</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewAccomplishment({
                  ...newAccomplishment,
                  evidence: e.target.files[0]
                })}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="public-switch"
              label="Make this accomplishment public"
              checked={newAccomplishment.isPublic}
              onChange={(e) => setNewAccomplishment({
                ...newAccomplishment,
                isPublic: e.target.checked
              })}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ActionButton
            variant="secondary"
            label="Cancel"
            onClick={() => setShowModal(false)}
          />
          <ActionButton
            label={selectedAccomplishment ? 'Update' : 'Add'}
            onClick={handleSubmit}
            disabled={loading}
          />
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyAccomplishments; 
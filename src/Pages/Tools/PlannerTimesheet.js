import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Table, Modal } from 'react-bootstrap';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { FaClock, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';
import { handleApiError } from '../../utils/apiErrorHandler';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const PlannerTimesheet = () => {
  const [view, setView] = useState('calendar'); // 'calendar' or 'timesheet'
  const [events, setEvents] = useState([]);
  const [timesheets, setTimesheets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('event'); // 'event' or 'timesheet'
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    start: new Date(),
    end: new Date(),
    description: '',
    project: '',
    hours: 0,
    task_type: 'meeting'
  });

  useEffect(() => {
    fetchEvents();
    fetchTimesheets();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://dordod.com/api/events/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setEvents(response.data.map(event => ({
        ...event,
        start: new Date(event.start),
        end: new Date(event.end)
      })));
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const fetchTimesheets = async () => {
    try {
      const response = await axios.get('http://dordod.com/api/timesheets/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setTimesheets(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const endpoint = modalType === 'event' ? 'events' : 'timesheets';
      const method = selectedItem ? 'put' : 'post';
      const url = selectedItem 
        ? `http://dordod.com/api/${endpoint}/${selectedItem.id}/`
        : `http://dordod.com/api/${endpoint}/`;

      const response = await axios[method](url, formData, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setToast({
        show: true,
        message: `${modalType === 'event' ? 'Event' : 'Timesheet entry'} ${selectedItem ? 'updated' : 'created'} successfully!`,
        variant: 'success'
      });

      if (modalType === 'event') {
        fetchEvents();
      } else {
        fetchTimesheets();
      }

      setShowModal(false);
      setSelectedItem(null);
      setFormData({
        title: '',
        start: new Date(),
        end: new Date(),
        description: '',
        project: '',
        hours: 0,
        task_type: 'meeting'
      });
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

  const handleDelete = async (item, type) => {
    try {
      const endpoint = type === 'event' ? 'events' : 'timesheets';
      await axios.delete(`http://dordod.com/api/${endpoint}/${item.id}/`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });

      setToast({
        show: true,
        message: `${type === 'event' ? 'Event' : 'Timesheet entry'} deleted successfully!`,
        variant: 'success'
      });

      if (type === 'event') {
        fetchEvents();
      } else {
        fetchTimesheets();
      }
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Card style={{ boxShadow: theme.shadows.sm }}>
        <Card.Header
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            color: 'white',
            padding: '15px'
          }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Planner & Timesheet</h5>
            <div>
              <Button
                variant={view === 'calendar' ? 'light' : 'outline-light'}
                onClick={() => setView('calendar')}
                className="me-2"
              >
                Calendar
              </Button>
              <Button
                variant={view === 'timesheet' ? 'light' : 'outline-light'}
                onClick={() => setView('timesheet')}
              >
                Timesheet
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="mb-3 d-flex justify-content-end">
            <Button
              onClick={() => {
                setModalType(view === 'calendar' ? 'event' : 'timesheet');
                setShowModal(true);
              }}
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                border: 'none'
              }}
            >
              <FaPlus className="me-2" />
              Add {view === 'calendar' ? 'Event' : 'Time Entry'}
            </Button>
          </div>

          {view === 'calendar' ? (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              onSelectEvent={(event) => {
                setSelectedItem(event);
                setModalType('event');
                setFormData(event);
                setShowModal(true);
              }}
            />
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Project</th>
                  <th>Task</th>
                  <th>Hours</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {timesheets.map((entry) => (
                  <tr key={entry.id}>
                    <td>{moment(entry.date).format('MMM DD, YYYY')}</td>
                    <td>{entry.project}</td>
                    <td>{entry.task_type}</td>
                    <td>{entry.hours}</td>
                    <td>{entry.description}</td>
                    <td>
                      <Button
                        variant="link"
                        onClick={() => {
                          setSelectedItem(entry);
                          setModalType('timesheet');
                          setFormData(entry);
                          setShowModal(true);
                        }}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="link"
                        className="text-danger"
                        onClick={() => handleDelete(entry, 'timesheet')}
                      >
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>
            {selectedItem ? 'Edit' : 'Add'} {modalType === 'event' ? 'Event' : 'Time Entry'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </Form.Group>

            {modalType === 'event' ? (
              <>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={moment(formData.start).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setFormData({ ...formData, start: new Date(e.target.value) })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>End Date</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={moment(formData.end).format('YYYY-MM-DDTHH:mm')}
                        onChange={(e) => setFormData({ ...formData, end: new Date(e.target.value) })}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </>
            ) : (
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Project</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.project}
                      onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hours</Form.Label>
                    <Form.Control
                      type="number"
                      value={formData.hours}
                      onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
                      required
                      min="0"
                      step="0.5"
                    />
                  </Form.Group>
                </Col>
              </Row>
            )}

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={() => setShowModal(false)}
                className="me-2"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                style={{
                  backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                  border: 'none'
                }}
              >
                {loading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PlannerTimesheet; 
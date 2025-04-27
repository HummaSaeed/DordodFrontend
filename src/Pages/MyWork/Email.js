import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, ListGroup } from 'react-bootstrap';
import { FaInbox, FaStar, FaPaperPlane, FaTrash, FaEnvelope, FaReply, FaForward } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const Email = () => {
  const [emails, setEmails] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [newEmail, setNewEmail] = useState({
    to: '',
    subject: '',
    content: '',
    attachments: []
  });

  useEffect(() => {
    fetchEmails();
  }, [selectedFolder]);

  const fetchEmails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://dordod.com/api/emails/${selectedFolder}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setEmails(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to fetch emails',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('to', newEmail.to);
      formData.append('subject', newEmail.subject);
      formData.append('content', newEmail.content);
      newEmail.attachments.forEach(file => {
        formData.append('attachments', file);
      });

      await axios.post('http://dordod.com/api/emails/send', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setToast({
        show: true,
        message: 'Email sent successfully!',
        variant: 'success'
      });
      setShowCompose(false);
      setNewEmail({ to: '', subject: '', content: '', attachments: [] });
      fetchEmails();
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to send email',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileAttachment = (e) => {
    const files = Array.from(e.target.files);
    setNewEmail(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const EmailList = () => (
    <ListGroup variant="flush">
      {loading ? (
        <div className="text-center py-4">Loading...</div>
      ) : emails.length === 0 ? (
        <div className="text-center py-4">No emails in this folder</div>
      ) : (
        emails.map(email => (
          <ListGroup.Item
            key={email.id}
            action
            active={selectedEmail?.id === email.id}
            onClick={() => setSelectedEmail(email)}
            className="d-flex align-items-center py-3"
          >
            <div className="me-3">
              <Form.Check type="checkbox" />
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <h6 className="mb-1">{email.from}</h6>
                <small>{new Date(email.date).toLocaleDateString()}</small>
              </div>
              <h6 className="mb-1">{email.subject}</h6>
              <small className="text-muted">{email.content.substring(0, 100)}...</small>
            </div>
          </ListGroup.Item>
        ))
      )}
    </ListGroup>
  );

  const EmailView = () => (
    <Card>
      <Card.Header
        style={{
          backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
          color: 'white',
          padding: '15px'
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{selectedEmail.subject}</h5>
          <div>
            <Button variant="outline-light" className="me-2" onClick={() => {
              setNewEmail({
                ...newEmail,
                to: selectedEmail.from,
                subject: `Re: ${selectedEmail.subject}`
              });
              setShowCompose(true);
            }}>
              <FaReply /> Reply
            </Button>
            <Button variant="outline-light">
              <FaForward /> Forward
            </Button>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="mb-4">
          <strong>From:</strong> {selectedEmail.from}<br />
          <strong>To:</strong> {selectedEmail.to}<br />
          <strong>Date:</strong> {new Date(selectedEmail.date).toLocaleString()}
        </div>
        <div dangerouslySetInnerHTML={{ __html: selectedEmail.content }} />
        {selectedEmail.attachments?.length > 0 && (
          <div className="mt-4">
            <h6>Attachments:</h6>
            <ListGroup>
              {selectedEmail.attachments.map((attachment, index) => (
                <ListGroup.Item key={index}>
                  <a href={attachment.url} download>{attachment.name}</a>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}
      </Card.Body>
    </Card>
  );

  return (
    <Container fluid style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <Row>
        <Col md={2}>
          <Button
            className="w-100 mb-3"
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
            onClick={() => setShowCompose(true)}
          >
            <FaEnvelope className="me-2" /> Compose
          </Button>

          <ListGroup>
            {[
              { id: 'inbox', name: 'Inbox', icon: FaInbox },
              { id: 'starred', name: 'Starred', icon: FaStar },
              { id: 'sent', name: 'Sent', icon: FaPaperPlane },
              { id: 'trash', name: 'Trash', icon: FaTrash }
            ].map(folder => (
              <ListGroup.Item
                key={folder.id}
                action
                active={selectedFolder === folder.id}
                onClick={() => {
                  setSelectedFolder(folder.id);
                  setSelectedEmail(null);
                }}
              >
                <folder.icon className="me-2" /> {folder.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col md={showCompose ? 7 : selectedEmail ? 4 : 10}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0 text-capitalize">{selectedFolder}</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <EmailList />
            </Card.Body>
          </Card>
        </Col>

        {selectedEmail && !showCompose && (
          <Col md={6}>
            <EmailView />
          </Col>
        )}

        {showCompose && (
          <Col md={3}>
            <Card>
              <Card.Header
                style={{
                  backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                  color: 'white'
                }}
              >
                <h5 className="mb-0">New Message</h5>
              </Card.Header>
              <Card.Body>
                <Form>
                  <Form.Group className="mb-3">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="email"
                      value={newEmail.to}
                      onChange={(e) => setNewEmail({ ...newEmail, to: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      type="text"
                      value={newEmail.subject}
                      onChange={(e) => setNewEmail({ ...newEmail, subject: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Control
                      as="textarea"
                      rows={10}
                      value={newEmail.content}
                      onChange={(e) => setNewEmail({ ...newEmail, content: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Attachments</Form.Label>
                    <Form.Control
                      type="file"
                      multiple
                      onChange={handleFileAttachment}
                    />
                  </Form.Group>
                  <div className="d-flex justify-content-between">
                    <Button variant="secondary" onClick={() => {
                      setShowCompose(false);
                      setNewEmail({ to: '', subject: '', content: '', attachments: [] });
                    }}>
                      Discard
                    </Button>
                    <Button
                      onClick={handleSendEmail}
                      disabled={loading}
                      style={{
                        backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                        border: 'none'
                      }}
                    >
                      Send
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Email; 
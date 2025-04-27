import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, ListGroup, Badge } from 'react-bootstrap';
import { FaPlus, FaTrash, FaEdit, FaStar, FaTags, FaSearch } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const EverydayNotes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('all');
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    tags: [],
    isPinned: false
  });

  // Required APIs:
  // GET /api/notes - Get all notes
  // POST /api/notes - Create new note
  // PUT /api/notes/:id - Update note
  // DELETE /api/notes/:id - Delete note
  // PUT /api/notes/:id/pin - Pin/unpin note

  const handleSave = async () => {
    try {
      setLoading(true);
      // API call to save note
      setToast({
        show: true,
        message: 'Note saved successfully!',
        variant: 'success'
      });
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to save note',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  const tags = ['all', 'work', 'personal', 'ideas', 'tasks'];

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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Notes</h5>
                <Button
                  variant="outline-light"
                  size="sm"
                  onClick={() => setSelectedNote(null)}
                >
                  <FaPlus /> New Note
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="p-3">
                <Form.Control
                  type="text"
                  placeholder="Search notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
                <div className="d-flex flex-wrap gap-2 mb-3">
                  {tags.map(tag => (
                    <Badge
                      key={tag}
                      bg={selectedTag === tag ? 'success' : 'secondary'}
                      style={{ cursor: 'pointer' }}
                      onClick={() => setSelectedTag(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <ListGroup variant="flush">
                {notes.map(note => (
                  <ListGroup.Item
                    key={note.id}
                    action
                    active={selectedNote?.id === note.id}
                    onClick={() => setSelectedNote(note)}
                    className="d-flex align-items-start py-3"
                  >
                    {note.isPinned && <FaStar className="text-warning me-2" />}
                    <div>
                      <h6 className="mb-1">{note.title}</h6>
                      <p className="mb-1 text-muted small">
                        {note.content.substring(0, 100)}...
                      </p>
                      <div className="d-flex gap-1">
                        {note.tags.map(tag => (
                          <Badge key={tag} bg="info" className="small">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
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
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  {selectedNote ? 'Edit Note' : 'New Note'}
                </h5>
                <div>
                  {selectedNote && (
                    <>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          // Toggle pin
                        }}
                      >
                        <FaStar /> Pin
                      </Button>
                      <Button
                        variant="outline-light"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          // Delete note
                        }}
                      >
                        <FaTrash />
                      </Button>
                    </>
                  )}
                  <Button
                    variant="light"
                    size="sm"
                    onClick={handleSave}
                    disabled={loading}
                  >
                    Save
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Note Title"
                    value={selectedNote?.title || newNote.title}
                    onChange={(e) => {
                      if (selectedNote) {
                        setSelectedNote({ ...selectedNote, title: e.target.value });
                      } else {
                        setNewNote({ ...newNote, title: e.target.value });
                      }
                    }}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Control
                    as="textarea"
                    rows={12}
                    placeholder="Write your note here..."
                    value={selectedNote?.content || newNote.content}
                    onChange={(e) => {
                      if (selectedNote) {
                        setSelectedNote({ ...selectedNote, content: e.target.value });
                      } else {
                        setNewNote({ ...newNote, content: e.target.value });
                      }
                    }}
                  />
                </Form.Group>
                <Form.Group>
                  <div className="d-flex align-items-center">
                    <FaTags className="me-2" />
                    <Form.Control
                      type="text"
                      placeholder="Add tags (comma-separated)"
                      value={selectedNote?.tags.join(', ') || newNote.tags.join(', ')}
                      onChange={(e) => {
                        const newTags = e.target.value.split(',').map(tag => tag.trim());
                        if (selectedNote) {
                          setSelectedNote({ ...selectedNote, tags: newTags });
                        } else {
                          setNewNote({ ...newNote, tags: newTags });
                        }
                      }}
                    />
                  </div>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EverydayNotes; 
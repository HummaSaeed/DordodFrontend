import React, { useState } from 'react';
import { Container, Card, Row, Col, Carousel, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash } from 'react-icons/fa';
import { theme } from '../../theme';
import { Toast } from '../../components/Toast';

const MyOwnSite = () => {
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [index, setIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [websiteContent, setWebsiteContent] = useState([]);
  const [newPage, setNewPage] = useState({
    title: '',
    description: '',
    image: null,
    imagePreview: null
  });

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewPage({
        ...newPage,
        image: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const handleAddPage = () => {
    if (!newPage.title || !newPage.image) {
      setToast({
        show: true,
        message: 'Please fill all required fields',
        variant: 'danger'
      });
      return;
    }

    const newPageData = {
      id: Date.now(),
      title: newPage.title,
      description: newPage.description,
      image: newPage.imagePreview
    };

    setWebsiteContent([...websiteContent, newPageData]);
    setNewPage({
      title: '',
      description: '',
      image: null,
      imagePreview: null
    });
    setShowModal(false);
    setToast({
      show: true,
      message: 'Page added successfully!',
      variant: 'success'
    });
  };

  const handleDeletePage = (pageId) => {
    setWebsiteContent(websiteContent.filter(page => page.id !== pageId));
    setToast({
      show: true,
      message: 'Page deleted successfully!',
      variant: 'success'
    });
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>My Website Preview</h2>
        <Button
          onClick={() => setShowModal(true)}
          style={{
            backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
            border: 'none'
          }}
        >
          <FaPlus className="me-2" /> Add New Page
        </Button>
      </div>

      <Row>
        <Col md={12}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Website Pages</h5>
            </Card.Header>
            <Card.Body>
              {websiteContent.length > 0 ? (
                <Carousel activeIndex={index} onSelect={handleSelect}>
                  {websiteContent.map((content) => (
                    <Carousel.Item key={content.id}>
                      <img
                        className="d-block w-100"
                        src={content.image}
                        alt={content.title}
                        style={{ 
                          height: '400px', 
                          objectFit: 'cover',
                          borderRadius: '8px'
                        }}
                      />
                      <Carousel.Caption style={{ 
                        backgroundColor: 'rgba(0,0,0,0.7)', 
                        borderRadius: '8px',
                        padding: '15px'
                      }}>
                        <h3>{content.title}</h3>
                        <p>{content.description}</p>
                      </Carousel.Caption>
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <div className="text-center py-5">
                  <h5>No pages added yet</h5>
                  <p>Click "Add New Page" to start building your website</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={12}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Website Pages List</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {websiteContent.map((content) => (
                  <Col md={6} key={content.id} className="mb-4">
                    <Card>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h5>{content.title}</h5>
                            <p className="text-muted">{content.description}</p>
                          </div>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => handleDeletePage(content.id)}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Add Page Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>Add New Website Page</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Page Title*</Form.Label>
              <Form.Control
                type="text"
                value={newPage.title}
                onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
                placeholder="Enter page title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPage.description}
                onChange={(e) => setNewPage({ ...newPage, description: e.target.value })}
                placeholder="Enter page description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image*</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </Form.Group>

            {newPage.imagePreview && (
              <div className="mb-3">
                <img
                  src={newPage.imagePreview}
                  alt="Preview"
                  style={{
                    width: '100%',
                    maxHeight: '200px',
                    objectFit: 'cover',
                    borderRadius: '8px'
                  }}
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleAddPage}
            style={{
              backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
              border: 'none'
            }}
          >
            Add Page
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default MyOwnSite; 
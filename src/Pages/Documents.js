import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import { FaFile, FaDownload, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { theme } from '../theme';
import { API_BASE_URL } from '../config/api';

const Documents = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('resume');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/documents/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('document', selectedFile);
    formData.append('document_type', documentType);

    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/documents/`, formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });
      fetchDocuments();
      setSelectedFile(null);
      e.target.reset();
    } catch (error) {
      console.error('Error uploading document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      await axios.delete(`${API_BASE_URL}/documents/${documentId}/`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDownload = (document) => {
    window.open(document.document, '_blank');
  };

  const getDocumentTypeColor = (type) => {
    const colors = {
      'resume': '#28a745',
      'cover_letter': '#17a2b8',
      'portfolio': '#ffc107',
      'education': '#dc3545',
      'professional': '#6610f2',
      'bank': '#fd7e14',
      'other': '#6c757d'
    };
    return colors[type] || colors.other;
  };

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <h2 style={{ color: theme.colors.primary, marginBottom: '20px' }}>
        Documents
      </h2>

      <Row>
        <Col md={8}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">My Documents</h5>
            </Card.Header>
            <Card.Body>
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="d-flex justify-content-between align-items-center p-3 border-bottom"
                >
                  <div className="d-flex align-items-center">
                    <FaFile size={24} color={getDocumentTypeColor(doc.document_type)} />
                    <div className="ms-3">
                      <h6 className="mb-0">{doc.document.split('/').pop()}</h6>
                      <Badge 
                        bg="light" 
                        text="dark" 
                        style={{ 
                          backgroundColor: `${getDocumentTypeColor(doc.document_type)}20`
                        }}
                      >
                        {doc.document_type.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant="link"
                      onClick={() => handleDownload(doc)}
                      className="me-2"
                    >
                      <FaDownload color={theme.colors.primary} />
                    </Button>
                    <Button
                      variant="link"
                      onClick={() => handleDelete(doc.id)}
                      className="text-danger"
                    >
                      <FaTrash />
                    </Button>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card style={{ boxShadow: theme.shadows.sm }}>
            <Card.Header
              style={{
                backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                color: 'white',
                padding: '15px'
              }}
            >
              <h5 className="mb-0">Upload Document</h5>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleUpload}>
                <Form.Group className="mb-3">
                  <Form.Label>Document Type</Form.Label>
                  <Form.Select
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value)}
                  >
                    <option value="resume">Resume</option>
                    <option value="cover_letter">Cover Letter</option>
                    <option value="portfolio">Portfolio</option>
                    <option value="education">Educational Document</option>
                    <option value="professional">Professional Document</option>
                    <option value="bank">Bank Document</option>
                    <option value="other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Select File</Form.Label>
                  <Form.Control
                    type="file"
                    onChange={handleFileChange}
                    required
                  />
                </Form.Group>

                <Button
                  type="submit"
                  disabled={loading || !selectedFile}
                  style={{
                    backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                    border: 'none',
                    width: '100%'
                  }}
                >
                  {loading ? 'Uploading...' : 'Upload Document'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Documents;

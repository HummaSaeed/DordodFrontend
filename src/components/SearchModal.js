import React, { useState, useEffect } from 'react';
import { Modal, Form, ListGroup, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaUser, FaUsers, FaBook, FaTasks } from 'react-icons/fa';
import axios from 'axios';

const SearchModal = ({ show, onHide }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const searchTimer = setTimeout(() => {
      if (searchTerm.length >= 2) {
        performSearch();
      }
    }, 300);

    return () => clearTimeout(searchTimer);
  }, [searchTerm]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/search?q=${searchTerm}`);
      setResults(response.data);
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'user':
        return <FaUser />;
      case 'group':
        return <FaUsers />;
      case 'course':
        return <FaBook />;
      case 'activity':
        return <FaTasks />;
      default:
        return <FaSearch />;
    }
  };

  const handleResultClick = (result) => {
    onHide();
    navigate(result.path);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Search</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Control
          type="search"
          placeholder="Search for anything..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          autoFocus
          className="mb-3"
        />

        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : results.length > 0 ? (
          <ListGroup>
            {results.map(result => (
              <ListGroup.Item
                key={result.id}
                action
                onClick={() => handleResultClick(result)}
                className="d-flex align-items-center"
              >
                <div className="me-3">
                  {getIcon(result.type)}
                </div>
                <div>
                  <h6 className="mb-1">{result.title}</h6>
                  <small className="text-muted">{result.description}</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        ) : searchTerm.length > 0 && (
          <div className="text-center py-4 text-muted">
            No results found
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SearchModal; 
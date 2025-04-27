import React, { useState, useEffect } from 'react';
import { Container, Card, Row, Col, Form, Button, Modal, Badge, Nav, Tab } from 'react-bootstrap';
import { 
  FaImage, FaVideo, FaNewspaper, FaHeart, FaComment, FaShare, 
  FaEllipsisV, FaBookmark, FaRegHeart, FaPhotoVideo, FaFileAlt 
} from 'react-icons/fa';
import axios from 'axios';
import { DashboardCard } from '../../components/SharedComponents';
import { useTheme } from '../../context/ThemeContext';
import { Toast } from '../../components/Toast';
import { handleApiError } from '../../utils/apiErrorHandler';

const Posts = () => {
  const { theme } = useTheme();
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [postType, setPostType] = useState('');
  const [newPost, setNewPost] = useState({
    content: '',
    media: null,
    type: ''
  });
  const [loading, setLoading] = useState(false);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [savedPosts, setSavedPosts] = useState(new Set());
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get('http://dordod.com/api/posts/', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      });
      setPosts(response.data);
    } catch (error) {
      setToast({
        show: true,
        message: handleApiError(error),
        variant: 'danger'
      });
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('content', newPost.content);
    formData.append('type', postType);
    if (newPost.media) {
      formData.append('media', newPost.media);
    }

    try {
      await axios.post('http://dordod.com/api/posts/', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setToast({
        show: true,
        message: 'Post created successfully!',
        variant: 'success'
      });
      
      setShowModal(false);
      setNewPost({ content: '', media: null, type: '' });
      fetchPosts();
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

  const handleFileChange = (e) => {
    setNewPost({
      ...newPost,
      media: e.target.files[0]
    });
  };

  const filteredPosts = posts.filter(post => {
    if (activeTab === 'all') return true;
    return post.type === activeTab;
  });

  const TabButton = ({ type, icon: Icon, label }) => (
    <Button
      variant={postType === type ? 'primary' : 'outline-primary'}
      onClick={() => { setPostType(type); setShowModal(true); }}
      className="me-2"
      style={{
        backgroundImage: postType === type ? 'linear-gradient(45deg, #2C3E50, #28a745)' : 'none',
        border: postType === type ? 'none' : '1px solid #2C3E50'
      }}
    >
      <Icon className="me-2" /> {label}
    </Button>
  );

  const PostCard = ({ post }) => (
    <Card className="mb-4" style={{ boxShadow: theme.shadows.sm }}>
      <Card.Header
        style={{
          padding: '15px',
          backgroundColor: 'white',
          borderBottom: '1px solid #eee'
        }}
      >
        <div className="d-flex align-items-center">
          <img
            src={post.author.profile_picture || 'https://via.placeholder.com/40'}
            alt="Profile"
            style={{ width: 40, height: 40, borderRadius: '50%', marginRight: 10 }}
          />
          <div>
            <h6 className="mb-0">{post.author.name}</h6>
            <small className="text-muted">
              {new Date(post.created_at).toLocaleDateString()}
            </small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <p>{post.content}</p>
        {post.media && (
          <div className="mb-3">
            {post.type === 'photo' && (
              <img src={post.media} alt="Post" className="img-fluid rounded" />
            )}
            {post.type === 'video' && (
              <video controls className="w-100 rounded">
                <source src={post.media} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        )}
        <div className="d-flex justify-content-between align-items-center">
          <Button variant="link" className="text-muted">
            <FaHeart /> {post.likes_count}
          </Button>
          <Button variant="link" className="text-muted">
            <FaComment /> {post.comments_count}
          </Button>
          <Button variant="link" className="text-muted">
            <FaShare />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: theme.colors.primary }}>Posts</h2>
        <div>
          <TabButton type="photo" icon={FaImage} label="Photo" />
          <TabButton type="video" icon={FaVideo} label="Video" />
          <TabButton type="article" icon={FaNewspaper} label="Article" />
        </div>
      </div>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={8}>
            <Nav variant="tabs" className="mb-4">
              <Nav.Item>
                <Nav.Link 
                  eventKey="all"
                  style={{
                    color: activeTab === 'all' ? theme.colors.primary : 'inherit',
                    borderBottom: activeTab === 'all' ? `2px solid ${theme.colors.primary}` : 'none'
                  }}
                >
                  <FaFileAlt className="me-2" />
                  All Posts
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="photo"
                  style={{
                    color: activeTab === 'photo' ? theme.colors.primary : 'inherit',
                    borderBottom: activeTab === 'photo' ? `2px solid ${theme.colors.primary}` : 'none'
                  }}
                >
                  <FaImage className="me-2" />
                  Photos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="video"
                  style={{
                    color: activeTab === 'video' ? theme.colors.primary : 'inherit',
                    borderBottom: activeTab === 'video' ? `2px solid ${theme.colors.primary}` : 'none'
                  }}
                >
                  <FaVideo className="me-2" />
                  Videos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  eventKey="article"
                  style={{
                    color: activeTab === 'article' ? theme.colors.primary : 'inherit',
                    borderBottom: activeTab === 'article' ? `2px solid ${theme.colors.primary}` : 'none'
                  }}
                >
                  <FaNewspaper className="me-2" />
                  Articles
                </Nav.Link>
              </Nav.Item>
            </Nav>

            <Tab.Content>
              <Tab.Pane eventKey={activeTab}>
                {filteredPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
                {filteredPosts.length === 0 && (
                  <DashboardCard>
                    <div className="text-center py-5">
                      <h4>No {activeTab !== 'all' ? activeTab : ''} posts yet</h4>
                      <p className="text-muted">Be the first to create a {activeTab !== 'all' ? activeTab : ''} post!</p>
                      <Button
                        onClick={() => { setPostType(activeTab); setShowModal(true); }}
                        style={{
                          backgroundImage: 'linear-gradient(45deg, #2C3E50, #28a745)',
                          border: 'none'
                        }}
                      >
                        Create Post
                      </Button>
                    </div>
                  </DashboardCard>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>

          <Col md={4}>
            <DashboardCard title="Trending Topics">
              {/* Add trending topics content */}
            </DashboardCard>
            <DashboardCard title="Suggested Connections">
              {/* Add suggested connections content */}
            </DashboardCard>
          </Col>
        </Row>
      </Tab.Container>

      {/* Create Post Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton style={{ background: theme.colors.primary, color: 'white' }}>
          <Modal.Title>Create {postType.charAt(0).toUpperCase() + postType.slice(1)}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreatePost}>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind?"
              />
            </Form.Group>

            {(postType === 'photo' || postType === 'video') && (
              <Form.Group className="mb-3">
                <Form.Label>Upload {postType}</Form.Label>
                <Form.Control
                  type="file"
                  accept={postType === 'photo' ? 'image/*' : 'video/*'}
                  onChange={handleFileChange}
                />
              </Form.Group>
            )}

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
                {loading ? 'Posting...' : 'Post'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Posts; 
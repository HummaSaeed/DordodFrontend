import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Modal, Badge } from 'react-bootstrap';
import { 
  FaUsers, FaPlus, FaEdit, FaTrash, FaUserPlus, 
  FaComments, FaShareAlt, FaEllipsisV 
} from 'react-icons/fa';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { groupsApi } from '../../services/api';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Groups = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [groups, setGroups] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [newGroup, setNewGroup] = useState({
    name: '',
    description: '',
    privacy: 'public',
    cover_image: null,
    tags: []
  });

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    setLoading(true);
    try {
      const response = await groupsApi.getAll();
      setGroups(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewGroup({
      name: '',
      description: '',
      privacy: 'public',
      cover_image: null,
      tags: []
    });
  };

  const handleCreateGroup = async () => {
    try {
      const formData = new FormData();
      Object.keys(newGroup).forEach(key => {
        formData.append(key, newGroup[key]);
      });

      const response = await groupsApi.create(formData);
      setGroups([...groups, response.data]);
      setShowModal(false);
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const handleInviteMembers = async (groupId, members) => {
    try {
      await groupsApi.addMember(groupId, members);
      fetchGroups();
      setShowInviteModal(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartGroupChat = (group) => {
    navigate('/dashboard/my-work/messenger', { 
      state: { groupId: group.id } 
    });
  };

  const GroupCard = ({ group }) => (
    <DashboardCard
      title={
        <div className="d-flex align-items-center">
          {group.cover_image ? (
            <img 
              src={group.cover_image} 
              alt={group.name}
              className="rounded-circle me-2"
              width={40}
              height={40}
            />
          ) : (
            <FaUsers className="me-2" size={24} />
          )}
          {group.name}
        </div>
      }
      headerAction={
        <div className="d-flex gap-2">
          <Badge bg={group.privacy === 'public' ? 'success' : 'warning'}>
            {group.privacy}
          </Badge>
          <ActionButton
            icon={FaEllipsisV}
            variant="outline-secondary"
            size="sm"
          />
        </div>
      }
    >
      <p className="text-muted">{group.description}</p>
      <div className="mb-3">
        <small className="text-muted">
          {group.members_count} members · {group.posts_count} posts
        </small>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-3">
        {group.tags.map(tag => (
          <Badge key={tag} bg="info" className="me-1">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <div className="member-avatars d-flex">
          {group.recent_members.map(member => (
            <img
              key={member.id}
              src={member.avatar}
              alt={member.name}
              className="rounded-circle border-2 border-white"
              width={30}
              height={30}
              style={{ marginLeft: '-10px' }}
            />
          ))}
        </div>
        <div className="d-flex gap-2">
          <ActionButton
            icon={FaUserPlus}
            label="Invite"
            variant="outline-primary"
            size="sm"
            onClick={() => {
              setSelectedGroup(group);
              setShowInviteModal(true);
            }}
          />
          <ActionButton
            icon={FaComments}
            label="Chat"
            variant="outline-success"
            size="sm"
            onClick={() => handleStartGroupChat(group)}
          />
          {group.is_admin && (
            <ActionButton
              icon={FaEdit}
              label="Edit"
              variant="outline-warning"
              size="sm"
              onClick={() => {
                setSelectedGroup(group);
                setNewGroup(group);
                setShowModal(true);
              }}
            />
          )}
        </div>
      </div>
    </DashboardCard>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Groups</h2>
        <ActionButton
          icon={FaPlus}
          label="Create Group"
          onClick={() => {
            setSelectedGroup(null);
            setShowModal(true);
          }}
        />
      </div>

      <Row>
        <Col md={8}>
          <div className="mb-4">
            <Form.Control
              type="search"
              placeholder="Search groups..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          {groups
            .filter(group => 
              group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              group.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map(group => (
              <GroupCard key={group.id} group={group} />
            ))
          }
        </Col>

        <Col md={4}>
          <DashboardCard title="My Groups">
            <div className="groups-stats mb-4">
              <div className="d-flex justify-content-between mb-2">
                <span>Groups Joined</span>
                <span>{groups.length}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Groups Created</span>
                <span>{groups.filter(g => g.is_admin).length}</span>
              </div>
            </div>
            <h6>Popular Tags</h6>
            <div className="d-flex flex-wrap gap-2">
              {Array.from(
                new Set(groups.flatMap(g => g.tags))
              ).map(tag => (
                <Badge 
                  key={tag} 
                  bg="secondary" 
                  className="me-1"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSearchTerm(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </DashboardCard>
        </Col>
      </Row>

      {/* Create/Edit Group Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedGroup ? 'Edit Group' : 'Create New Group'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Group Name</Form.Label>
              <Form.Control
                type="text"
                value={newGroup.name}
                onChange={(e) => setNewGroup({
                  ...newGroup,
                  name: e.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newGroup.description}
                onChange={(e) => setNewGroup({
                  ...newGroup,
                  description: e.target.value
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Privacy</Form.Label>
              <Form.Select
                value={newGroup.privacy}
                onChange={(e) => setNewGroup({
                  ...newGroup,
                  privacy: e.target.value
                })}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Cover Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => setNewGroup({
                  ...newGroup,
                  cover_image: e.target.files[0]
                })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter tags separated by commas"
                value={newGroup.tags.join(', ')}
                onChange={(e) => setNewGroup({
                  ...newGroup,
                  tags: e.target.value.split(',').map(tag => tag.trim())
                })}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <ActionButton
            variant="secondary"
            label="Cancel"
            onClick={() => setShowModal(false)}
          />
          <ActionButton
            label={selectedGroup ? 'Update Group' : 'Create Group'}
            onClick={handleCreateGroup}
          />
        </Modal.Footer>
      </Modal>

      {/* Invite Members Modal */}
      <Modal show={showInviteModal} onHide={() => setShowInviteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Invite Members</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add member selection form */}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Groups; 
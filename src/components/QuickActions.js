import React from 'react';
import { Modal, ListGroup, Row, Col } from 'react-bootstrap';
import { 
  FaPlus, FaUsers, FaTasks, FaCalendar, FaChartLine,
  FaGraduationCap, FaClipboardList, FaComments 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const QuickActions = ({ show, onHide }) => {
  const navigate = useNavigate();

  const actionGroups = [
    {
      title: 'Create New',
      actions: [
        { label: 'New Goal', icon: FaPlus, path: '/dashboard/goals' },
        { label: 'New Group', icon: FaUsers, path: '/dashboard/my-work/groups' },
        { label: 'New Activity', icon: FaTasks, path: '/dashboard/my-space/activities' },
        { label: 'Schedule Meeting', icon: FaCalendar, path: '/dashboard/tools/planner-timesheet' }
      ]
    },
    {
      title: 'Quick Access',
      actions: [
        { label: 'Progress Report', icon: FaChartLine, path: '/dashboard/my-space/progress-report' },
        { label: 'My Courses', icon: FaGraduationCap, path: '/dashboard/courses' },
        { label: 'My Tasks', icon: FaClipboardList, path: '/dashboard/my-space/activities' },
        { label: 'Messages', icon: FaComments, path: '/dashboard/my-work/messenger' }
      ]
    }
  ];

  const handleAction = (path) => {
    navigate(path);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Quick Actions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          {actionGroups.map(group => (
            <Col md={6} key={group.title}>
              <h6 className="mb-3">{group.title}</h6>
              <ListGroup>
                {group.actions.map(action => (
                  <ListGroup.Item 
                    key={action.label}
                    action
                    onClick={() => handleAction(action.path)}
                    className="d-flex align-items-center"
                  >
                    <action.icon className="me-2" />
                    {action.label}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          ))}
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default QuickActions; 
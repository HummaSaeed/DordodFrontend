import React from 'react';
import { Modal, ListGroup, Badge, Button } from 'react-bootstrap';
import { FaBell, FaCheck, FaUserPlus, FaComment, FaTrophy } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = ({ show, onHide, notifications, setNotifications }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'achievement':
        return <FaTrophy className="text-warning" />;
      case 'connection':
        return <FaUserPlus className="text-primary" />;
      case 'message':
        return <FaComment className="text-info" />;
      default:
        return <FaBell className="text-secondary" />;
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <Modal show={show} onHide={onHide} placement="end" size="lg">
      <Modal.Header closeButton className="d-flex justify-content-between align-items-center">
        <Modal.Title>Notifications</Modal.Title>
        <Button 
          variant="link" 
          className="text-muted" 
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </Button>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {notifications.length === 0 ? (
            <div className="text-center py-4 text-muted">
              No notifications
            </div>
          ) : (
            notifications.map(notification => (
              <ListGroup.Item 
                key={notification.id}
                className={`d-flex align-items-center ${!notification.read ? 'bg-light' : ''}`}
                action
              >
                <div className="me-3">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-grow-1">
                  <p className="mb-1">{notification.message}</p>
                  <small className="text-muted">
                    {formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })}
                  </small>
                </div>
                {!notification.read && (
                  <Badge 
                    bg="primary" 
                    className="cursor-pointer"
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <FaCheck />
                  </Badge>
                )}
              </ListGroup.Item>
            ))
          )}
        </ListGroup>
      </Modal.Body>
    </Modal>
  );
};

export default NotificationCenter; 
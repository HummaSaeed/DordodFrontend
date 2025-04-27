import { useState, useEffect } from 'react';
import { useWebSocket } from './useWebSocket';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const ws = useWebSocket();

  useEffect(() => {
    if (ws) {
      ws.on('notification', handleNewNotification);
      return () => ws.off('notification');
    }
  }, [ws]);

  const handleNewNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
  };

  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/api/notifications/${notificationId}/read`);
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
    }
  };

  return {
    notifications,
    setNotifications,
    markAsRead,
    markAllAsRead
  };
}; 
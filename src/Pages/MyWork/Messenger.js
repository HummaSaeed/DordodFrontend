import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, InputGroup, Badge, Button } from 'react-bootstrap';
import { 
  FaPaperPlane, FaFile, FaImage, FaSmile, FaUsers, 
  FaEnvelope, FaSearch, FaEllipsisV 
} from 'react-icons/fa';
import { DashboardCard, ActionButton } from '../../components/SharedComponents';
import { messengerApi, emailApi } from '../../services/api';
import { useWebSocket } from '../../hooks/useWebSocket';
import EmojiPicker from 'emoji-picker-react';

const Messenger = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  const ws = useWebSocket();
  const [currentUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    fetchConversations();
    
    // WebSocket event listeners
    ws.on('new_message', handleNewMessage);
    ws.on('message_read', handleMessageRead);
    ws.on('user_typing', handleUserTyping);

    return () => {
      ws.off('new_message');
      ws.off('message_read');
      ws.off('user_typing');
    };
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
      markConversationAsRead(selectedConversation.id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const response = await messengerApi.getConversations();
      setConversations(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMessages = async (conversationId) => {
    try {
      const response = await messengerApi.getMessages(conversationId);
      setMessages(response.data);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await messengerApi.sendMessage(selectedConversation.id, {
        content: newMessage,
        type: 'text'
      });

      setMessages([...messages, response.data]);
      setNewMessage('');
      scrollToBottom();

      // Notify via WebSocket
      ws.emit('send_message', {
        conversation_id: selectedConversation.id,
        message: response.data
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('conversation_id', selectedConversation.id);

      const response = await messengerApi.sendMessage(selectedConversation.id, formData);
      setMessages([...messages, response.data]);
      scrollToBottom();
    } catch (err) {
      console.error(err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewMessage = (message) => {
    if (message.conversation_id === selectedConversation?.id) {
      setMessages(prev => [...prev, message]);
    }
  };

  const handleMessageRead = (data) => {
    if (data.conversation_id === selectedConversation?.id) {
      setMessages(prev => 
        prev.map(m => m.id <= data.last_read_id ? { ...m, read: true } : m)
      );
    }
  };

  const handleUserTyping = (data) => {
    if (data.conversation_id === selectedConversation?.id) {
      // Show typing indicator
    }
  };

  const markConversationAsRead = async (conversationId) => {
    try {
      await messengerApi.markAsRead(conversationId);
    } catch (err) {
      console.error('Failed to mark conversation as read:', err);
    }
  };

  const ConversationList = () => (
    <DashboardCard
      title="Conversations"
      headerAction={
        <ActionButton
          icon={FaUsers}
          label="New Group"
          variant="outline-primary"
          size="sm"
          onClick={() => {/* Handle new group */}}
        />
      }
    >
      <InputGroup className="mb-3">
        <InputGroup.Text>
          <FaSearch />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <div className="conversation-list" style={{ maxHeight: '600px', overflowY: 'auto' }}>
        {conversations
          .filter(conv => 
            conv.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            conv.participants.some(p => 
              p.name.toLowerCase().includes(searchTerm.toLowerCase())
            )
          )
          .map(conversation => (
            <div
              key={conversation.id}
              className={`conversation-item p-3 ${
                selectedConversation?.id === conversation.id ? 'active' : ''
              }`}
              onClick={() => setSelectedConversation(conversation)}
            >
              <div className="d-flex align-items-center">
                {conversation.type === 'group' ? (
                  <div className="group-avatar">
                    <FaUsers size={24} />
                  </div>
                ) : (
                  <img
                    src={conversation.participants[0].avatar}
                    alt="avatar"
                    className="rounded-circle"
                    width={40}
                    height={40}
                  />
                )}
                <div className="ms-3 flex-grow-1">
                  <h6 className="mb-1">{conversation.title}</h6>
                  <small className="text-muted">
                    {conversation.lastMessage?.content}
                  </small>
                </div>
                {conversation.unreadCount > 0 && (
                  <Badge bg="primary" pill>
                    {conversation.unreadCount}
                  </Badge>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </DashboardCard>
  );

  const MessageList = () => (
    <DashboardCard
      title={selectedConversation?.title || 'Select a conversation'}
      headerAction={
        selectedConversation && (
          <div className="d-flex gap-2">
            <ActionButton
              icon={FaEnvelope}
              label="Email"
              variant="outline-primary"
              size="sm"
              onClick={() => {/* Handle email */}}
            />
            <ActionButton
              icon={FaEllipsisV}
              variant="outline-secondary"
              size="sm"
              onClick={() => {/* Handle more options */}}
            />
          </div>
        )
      }
    >
      <div className="message-list" style={{ height: '500px', overflowY: 'auto' }}>
        {messages.map(message => (
          <div
            key={message.id}
            className={`message-item mb-3 ${
              message.sender.id === currentUser.id ? 'sent' : 'received'
            }`}
          >
            <div className="message-content p-3 rounded">
              {message.type === 'text' ? (
                <p className="mb-0">{message.content}</p>
              ) : (
                <div className="attachment">
                  {/* Handle different attachment types */}
                </div>
              )}
            </div>
            <small className="text-muted">
              {new Date(message.created_at).toLocaleTimeString()}
            </small>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input mt-3">
        <InputGroup>
          <Form.Control
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          />
          <InputGroup.Text
            as="label"
            htmlFor="file-upload"
            style={{ cursor: 'pointer' }}
          >
            <FaFile />
            <input
              id="file-upload"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </InputGroup.Text>
          <InputGroup.Text
            as="label"
            htmlFor="image-upload"
            style={{ cursor: 'pointer' }}
          >
            <FaImage />
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </InputGroup.Text>
          <InputGroup.Text
            style={{ cursor: 'pointer' }}
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <FaSmile />
          </InputGroup.Text>
          <Button onClick={handleSendMessage}>
            <FaPaperPlane />
          </Button>
        </InputGroup>
        {showEmojiPicker && (
          <div className="emoji-picker-container">
            <EmojiPicker
              onEmojiClick={(emoji) => {
                setNewMessage(prev => prev + emoji.emoji);
                setShowEmojiPicker(false);
              }}
            />
          </div>
        )}
      </div>
    </DashboardCard>
  );

  return (
    <Container style={{ fontFamily: 'Poppins', paddingTop: '30px' }}>
      <Row>
        <Col md={4}>
          <ConversationList />
        </Col>
        <Col md={8}>
          <MessageList />
        </Col>
      </Row>
    </Container>
  );
};

export default Messenger; 
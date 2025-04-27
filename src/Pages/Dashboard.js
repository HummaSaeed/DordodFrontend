import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { 
  FaBrain, FaBriefcase, FaChalkboard, FaUser, 
  FaGlobe, FaFileAlt, FaBullseye, FaBook, FaNewspaper 
} from 'react-icons/fa';
import { theme } from '../theme';
import { Toast } from '../components/Toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: '', variant: 'success' });
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [backgroundImage, setBackgroundImage] = useState('https://images.unsplash.com/photo-1497864149936-d3163f0c0f4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80');

  const quickAccessCards = [
    { 
      title: 'Frame of Mind',
      icon: FaBrain,
      path: '/dashboard/my-space/frame-of-mind',
      color: '#28a745',
      description: 'Track your daily mood and mindset'
    },
    { 
      title: 'Posts',
      icon: FaNewspaper,
      path: '/dashboard/my-work/posts',
      color: '#17a2b8',
      description: 'Share updates and connect'
    },
    { 
      title: 'Whiteboard',
      icon: FaChalkboard,
      path: '/dashboard/tools/whiteboard',
      color: '#ffc107',
      description: 'Collaborative workspace'
    },
    { 
      title: 'Personal Info',
      icon: FaUser,
      path: '/dashboard/personal-information',
      color: '#dc3545',
      description: 'Manage your profile'
    },
    { 
      title: 'Professional Info',
      icon: FaBriefcase,
      path: '/dashboard/professional-information',
      color: '#6f42c1',
      description: 'Career details'
    },
    { 
      title: 'Global Info',
      icon: FaGlobe,
      path: '/dashboard/global-information',
      color: '#fd7e14',
      description: 'Global presence'
    }
  ];

  useEffect(() => {
    fetchQuote();
  }, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://type.fit/api/quotes');
      const data = await response.json();
      const randomQuote = data[Math.floor(Math.random() * data.length)];
      setQuote({ 
        text: randomQuote.text, 
        author: randomQuote.author || 'Unknown'
      });
    } catch (error) {
      console.error('Error fetching quote:', error);
      // Fallback quotes array
      const fallbackQuotes = [
        {
          text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
          author: "Winston Churchill"
        },
        {
          text: "The only way to do great work is to love what you do.",
          author: "Steve Jobs"
        },
        {
          text: "Innovation distinguishes between a leader and a follower.",
          author: "Steve Jobs"
        },
        {
          text: "The future belongs to those who believe in the beauty of their dreams.",
          author: "Eleanor Roosevelt"
        }
      ];
      const randomFallback = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
      setQuote(randomFallback);
    }
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        position: 'relative',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: '60px'
      }}
    >
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
       
          zIndex: 1
        }}
      />
      <img 
        src={backgroundImage} 
        alt="Background" 
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover', 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          zIndex: 0 
        }} 
      />
      <Container fluid>
        <Toast {...toast} onClose={() => setToast({ ...toast, show: false })} />
        
        {/* Hero Section with Quote */}
        
         
       
        {/* Quick Access Cards Section */}
        <div style={{ marginTop: 'auto', paddingTop: '40px' }}>
          <h4 
            style={{ 
              color: '#fff', 
              marginBottom: '30px',
              paddingLeft: '15px',
              fontSize: '2rem',
              fontWeight: '600',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              zIndex:1000
            }}
          >
            Quick Access
          </h4>
          <Row className="g-4 pb-5">
            {quickAccessCards.map((card, index) => (
              <Col key={index} xs={12} sm={6} md={4} lg={3}>
                <Card 
                  className="quick-access-card"
                  onClick={() => navigate(card.path)}
                  style={{ 
                    cursor: 'pointer',
                    backgroundColor: `${card.color}80`,
                    border: 'none',
                    transition: 'transform 0.3s ease, background-color 0.3s ease',
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '8px'
                  }}
                >
                  <div 
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      width: '100%',
                    }}
                  >
                    <div
                      style={{
                        width: '45px',
                        height: '45px',
                        borderRadius: '12px',
                        backgroundColor: `${card.color}60`,
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '20px',
                        margin: '0 auto 10px auto'
                      }}
                    >
                      <card.icon />
                    </div>
                    <h5 className="mb-1">{card.title}</h5>
                    <small style={{ opacity: 0.8 }}>{card.description}</small>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default Dashboard;

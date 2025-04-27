import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SocialAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get('code');
      const provider = location.pathname.split('/')[2]; // gets 'google', 'facebook', or 'linkedin'

      try {
        const response = await fetch(`http://dordod.com/api/auth/${provider}/callback`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (response.ok) {
          const data = await response.json();
          await login(data.access_token);
          navigate('/dashboard');
        } else {
          navigate('/', { state: { error: 'Social login failed' } });
        }
      } catch (error) {
        navigate('/', { state: { error: 'Social login failed' } });
      }
    };

    handleCallback();
  }, [location, navigate, login]);

  return <div>Processing login...</div>;
};

export default SocialAuthCallback; 
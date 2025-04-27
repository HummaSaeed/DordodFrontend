export const SOCIAL_AUTH_CONFIG = {
  GOOGLE: {
    CLIENT_ID: 106222701114010678049,
    REDIRECT_URI: process.env.REACT_APP_BASE_URL + '/auth/google/callback',
    SCOPE: 'email profile'
  },
  FACEBOOK: {
    APP_ID: process.env.REACT_APP_FACEBOOK_APP_ID,
    REDIRECT_URI: process.env.REACT_APP_BASE_URL + '/auth/facebook/callback',
    SCOPE: 'email,public_profile'
  },
  LINKEDIN: {
    CLIENT_ID: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    REDIRECT_URI: process.env.REACT_APP_BASE_URL + '/auth/linkedin/callback',
    SCOPE: 'r_emailaddress r_liteprofile'
  }
}; 
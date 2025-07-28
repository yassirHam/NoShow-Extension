// backend/routes/auth.js
const express = require('express');
const axios = require('axios');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { sequelize } = require('../config/database');

// LinkedIn OAuth configuration
const LINKEDIN_API = 'https://api.linkedin.com/v2';
const OAUTH_URL = 'https://www.linkedin.com/oauth/v2';

router.get('/linkedin', (req, res) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.LINKEDIN_CLIENT_ID,
    redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
    scope: 'r_liteprofile r_emailaddress',
    state: Math.random().toString(36).substring(7)
  });
  
  res.redirect(`${OAUTH_URL}/authorization?${params}`);
});

router.get('/linkedin/callback', async (req, res) => {
  try {
    const { code, state } = req.query;
    
    // Exchange code for access token
    const tokenResponse = await axios.post(`${OAUTH_URL}/accessToken`, null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const { access_token, expires_in } = tokenResponse.data;
    
    // Get user profile
    const profileResponse = await axios.get(`${LINKEDIN_API}/me`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      params: {
        projection: '(id,localizedFirstName,localizedLastName)'
      }
    });

    // Get user email
    const emailResponse = await axios.get(`${LINKEDIN_API}/emailAddress?q=members&projection=(elements*(handle~))`, {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });

    const { id, localizedFirstName, localizedLastName } = profileResponse.data;
    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    const fullName = `${localizedFirstName} ${localizedLastName}`;

    // Create or update user
    const [user, created] = await User.findOrCreate({
      where: { linkedin_id: id },
      defaults: {
        email,
        full_name: fullName,
        access_token
      }
    });

    if (!created) {
      await user.update({ access_token });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    // Redirect to frontend with token
    res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
  } catch (error) {
    console.error('OAuth error:', error.response?.data || error.message);
    res.redirect(`${process.env.FRONTEND_URL}/auth-error`);
  }
});

module.exports = router;
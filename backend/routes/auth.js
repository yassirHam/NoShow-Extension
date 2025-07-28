// backend/routes/auth.js
const express = require('express');
const router = express.Router();

// Initier l'authentification LinkedIn
router.get('/linkedin', (req, res) => {
    const authUrl = `https://www.linkedin.com/oauth/v2/authorization?` +
        `response_type=code&` +
        `client_id=${process.env.LINKEDIN_CLIENT_ID}&` +
        `redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&` +
        `scope=r_liteprofile%20r_emailaddress`;
    res.redirect(authUrl);
});

// Callback OAuth
router.get('/linkedin/callback', async (req, res) => {
    // Échange du code contre un token
    // Récupération du profil utilisateur
    // Création/mise à jour de l'utilisateur en base
    // Génération JWT token
    // Redirection vers frontend
});

module.exports = router;
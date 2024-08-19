const fetch = require('node-fetch');
require('dotenv').config();

const refreshAccessToken = async () => {
    try {
        const response = await fetch('https://api.imgur.com/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                client_id: process.env.IMGUR_CLIENT_ID,
                client_secret: process.env.IMGUR_CLIENT_SECRET,
                grant_type: 'refresh_token',
                refresh_token: process.env.IMGUR_REFRESH_TOKEN
            })
        });

        const data = await response.json();

        if (response.ok) {
            process.env.IMGUR_ACCESS_TOKEN = data.access_token;
            process.env.IMGUR_REFRESH_TOKEN = data.refresh_token;
        } else {
            console.error('Failed to refresh access token', data);
        }
    } catch (error) {
        console.error('Error refreshing access token', error);
    }
};

const imgurEnsureAuthenticated = async (req, res, next) => {
    // Check if the access token is still valid (you can implement a more robust check here)
    if (!process.env.IMGUR_ACCESS_TOKEN) {
        await refreshAccessToken();
    }
    next();
};

module.exports = imgurEnsureAuthenticated;

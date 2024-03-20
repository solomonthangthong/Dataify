require('dotenv').config();
const express = require('express');

var client_id = process.env.CLIENT_ID;
var redirect_uri = process.env.REDIRECT_URI;

var app = express();
app.get('/login', function(req, res) {

    var state = generateRandomString(16);
    var scope = 'user-read-private user-read-email';

    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

function generateRandomString(length) {
    // Define a string containing all possible characters to choose from
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    // Loop `length` times to generate a string of the specified length
    for (let i = 0; i < length; i++) {
        // Select a random character from the `characters` string and append it to `result`
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
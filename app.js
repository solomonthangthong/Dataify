require('dotenv').config();
const express = require('express');
const request = require('request');
const querystring = require('querystring');

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = process.env.REDIRECT_URI;

var app = express();
app.use(express.static(__dirname + '/public'));
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

app.get('/callback', function(req, res) {

    var code = req.query.code || null;
    var state = req.query.state || null;

    if (state === null) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };
        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                var token = body.access_token;
            }
        });
    }
});

app.listen( 3000, function () {
    console.log('Server is running on port 3000');
});
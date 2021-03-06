var express = require('express'); // Express web server framework
var request = require('request'); // "Request" library
var http = require('http');
var https = require('https');
var fs = require('fs');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
var SpotifyWebApi = require('spotify-web-api-node');

var keys = require('./config/keys');
var common = require('./common/functions');

var client_id = keys['client_id']; // Your client id
var client_secret = keys['client_secret']; // Your client secret
var redirect_uri = keys['redirect_uri']; // Your redirect uri
var private_key = fs.readFileSync(keys['private_key_path'], 'utf8');
var certificate = fs.readFileSync(keys['certificate_path'], 'utf8');

// credentials are optional
var spotifyApi = new SpotifyWebApi({
  clientId : client_id,
  clientSecret : client_secret,
  redirectUri : redirect_uri
});

var scopes = [
		'playlist-read-private',
		'playlist-read-collaborative',
		'playlist-modify-private',
		'playlist-modify-public',
		'user-read-private'
];

var stateKey = 'spotify_auth_state';

var app = express();
app.use(express.static(__dirname + '/public'))
   .use(cookieParser());
   
var credentials = {key: private_key, cert: certificate};
   
app.get('/login', function(req, res) {
	
	var state = common.generateRandomString(16);
	var authorizeURL = spotifyApi.createAuthorizeURL(scopes, state);
	
  res.cookie(stateKey, state);
	res.redirect(authorizeURL);
	
});

app.get('/callback', function(req, res) {
	
	var code = req.query.code || null;
	var state = req.query.state || null;
	var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect('/#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };

    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });
  }
	
});

app.get('/refresh_token', function(req, res) {

  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
});

/*app.listen(process.env.PORT || 3000, function(){
  console.log('listening on respective port');
});*/

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(80);
httpsServer.listen(443);
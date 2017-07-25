//Importing all the recommended modules from https://api.slack.com/tutorials/app-creation-and-oauth
require('dotenv').config();
var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var http = require('http');
var app = express();

//define port to listen to
const PORT=4390;

var clientID = process.env.ID;
var clientSecret = process.env.SECRET;
var botID = process.env.BOT_TOKEN;

app.use(bodyparser.json());

app.listen(PORT, function() {
  //Triggered when successfully listening.
  console.log('Server listening on: http://localhost:%s', PORT);
});

app.get('/', function(req, res) {
  res.send('Ngrok is working! Path hit: ' + req.url);
});

//Rout to handle a get request to the oauth endpoint.
app.get('/oauth', function(req, res) {
  //Check for code query parameter within the request. Necessary for auth
  if (!req.query.code) {
    res.status(500);
    res.send({'Error': 'Looks like we\'re not getting code'});
    console.log('Looks like we\'re not getting code');
  } else {
    //we have the code

    //Do a call to the Slack 'oauth.access' endpoint
    //Pass client ID, Secret and the code we just got
    request({
      url: 'https://slack.com/api/oauth.access', //url to hit
      qa: {code: req.query.code, client_id: clientID, client_secret: clientSecret}, //query string
      method: 'GET', //Specify the method
    }, function(error, res, body) {
      if (error) {
        console.log(error);
      } else {
        console.log('authorized');
        res.json(body);
      }
    });
  }
});

//Route the endpoint that our slash command will point to and send back a simple
// response to signal ngrok is working
app.post('/command', function(req, res) {
  console.log('attempting post..');
  res.send('Your ngrok tunnel is up and running!');
});

app.post('/event', function(req, res) {
  console.log('event triggered...');
  console.log(req.body);
  var channel = 'C69BR6TK3';
  var message = 'we got an event!';
  var apiUrl = 'https://slack.com/api/chat.postMessage?token=' + botID + '&channel='
    + channel + '&text=' + message;
  console.log(req.body.event.username);
  
  /*request({
    url: apiUrl,
    method: 'POST'
  }, function(error, res, body) {
    console.log(res.body);
    console.log(res.body.error);
    if (res.body.error) {
      console.log(res.body.error);
    } else {
      console.log('yay');
      // res.json(body);
    }
  });*/
});

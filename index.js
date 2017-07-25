//Importing all the recommended modules from https://api.slack.com/tutorials/app-creation-and-oauth
require('dotenv').config();
var express = require('express');
var request = require('request');
var bodyparser = require('body-parser');
var http = require('http');
var app = express();

//local files
var slack_req = require('./slack_requests.js');
var message_tools = require('./message_tools.js');

//define port to listen to
const PORT=4390;

var clientID = process.env.ID;
var clientSecret = process.env.SECRET;
var botID = process.env.BOT_TOKEN;

//don't want to reply to messages we've replied to already
var replied_to = [];
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
    console.log(typeof slack_req.make_oauth_request(req, clientID, clientSecret));
  }
});

//Route the endpoint that our slash command will point to and send back a simple
// response to signal ngrok is working
app.post('/command', function(req, res) {
  console.log('attempting post..');
  res.send('Your ngrok tunnel is up and running!');
});

app.post('/event', function(req, res) {
  var channel = 'C69BR6TK3';
  var message = 'we got an event!';
  var apiUrl = 'https://slack.com/api/chat.postMessage?token=' + botID + '&channel='
    + channel + '&text=' + message;

  console.log(req.body.event.user);
  
  var userinfo = slack_req.get_user_info(botID, req.body.event.user);
  var reqMsg = req.body.event.text;
  
  if(req.body.event.user != 'mattbot20' && replied_to.indexOf(req.body.event_id) === -1){
    //slack_req.make_send_postMessage_request(botID, channel, message);
    console.log(message_tools.generate_response(userinfo, reqMsg));
    replied_to.push(req.body.event_id);
    console.log('Replied to: ' + replied_to);
  }
});

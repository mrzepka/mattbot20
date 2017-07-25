/*
  File that houses all of the code to make requests to the slack API
  Functions get passed in tokens, channels, messages, etc and just
  Make the requests necessary to slack
*/
var request = require('request');
module.exports = {
  make_oauth_request: function(code, clientID, clientSecret){
    console.log('authenticating');
    var reqUrl = 'https://slack.com/api/oauth.access';
    var reqQa = {code: req.query.code, client_id: clientID, client_secret: clientSecret};
    var reqType = 'GET';

    request({
      url: reqUrl,
      qa: reqQa,
      method: reqType,
    }, function(error, res, body){
      if (error) {
        console.log(error);
      } else {
        console.log('authorized');
        res.json(body);
      }
    });
  },

  make_send_postMessage_request: function(ID, chan, msg){
    console.log('sending chatMessage');
    var reqUrl = 'https://slack.com/api/chat.postMessage?token=' + ID + '&channel='
                  + chan + '&text=' + msg;
    var reqType = 'POST';
    request({
      url: reqUrl,
      method: reqType
    }, function(error, res, body) {
      console.log('request made');
      var res_json = JSON.parse(res.body);
      if (res_json.ok) {
        console.log('successful request for post message');
      } else {
        console.log(res_json.error);
        console.log('error in post send message');
      }
    });
  },

  get_user_info: function(ID, userID){
    console.log('getting user info');
    var reqUrl = 'https://slack.com/api/users.info?token=' + ID + '&user=' + userID;
    request({
      url: reqUrl,
      method: 'GET'
    }, function(error, res, body){
      console.log('request made');
      var res_json = JSON.parse(res.body);
      console.log(res_json.ok);
      if (res_json.ok) {
        console.log('username: ' + res_json.user.name);
        return res_json.user;
      } else {
        console.log('there was an error getting user info');
       console.log(res_json.error);
      }
    });
  }
};

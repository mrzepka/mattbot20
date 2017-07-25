/*
  File that will generate responses to messages given as input
*/

/*
  Helper functions
*/
var modify_karma = function(submitter, recipient, updown) {
  //verify user
  console.log('modifying karma for ' + recipient);
  if(submitter === recipient) {
    return 'Nice try!';
  }

  if (updown === '++') {
    return 'Increasing karma for ' + recipient;
  } else if (updown === '--') {
    return 'Decreasing karma for ' + recipient;
  } else {
    return 'Uh... how did we get here?';
  }
  //open file

  //increase/decrease
}

/*
  The functions that get exposed to other files
*/
module.exports = {
  /*
  entry point to functions. Parses input to decide what to do
  Takes in a user json object, and a message they sent us
  */
  generate_response: function(user, message) {
    //Things we want to match for:
    message = message.toLowerCase(); //for regex matching...
    //Karma related
    var karma = /^(\<\@[a-z0-9]*\>\s{0,1}(\+\+|\-\-))$/; //matt++ or baxter --
    var top_ten = /top [0-9]$/; //top ten in karma
    console.log('generating response...');

    if(message.match(karma)) {
      //modify string as necessary to get information we want
      var updown = message.slice(message.length - 1, message.length); //get ++ or --
      var recipient = message.trim(message.slice(0, message.length - 2)); //remove ++, --, and whitespace
      return modify_karma(user.ID, recipient, updown);  
    }
    return message;
  }
}

var admin = require("firebase-admin");
function FCM(key, app_name) {
    if(!key){
      throw Error('Please provide the key file!');
    }else {
      admin.initializeApp({
          credential: admin.credential.cert(key)
      }, app_name);

        this.send = function(app_name, payload, callback){
            if (!callback) {
                throw Error('Please provide a callback function');
            }
            else{
                if(!payload) callback(new Error('Please provide message object'))
                else {
                    // See documentation on defining a message payload.
                      // var message = {
                      //   data: {
                      //     score: '850',
                      //     time: '2:45'
                      //   },
                      //   token: registrationToken
                      // };

                      // Send a message to the device corresponding to the provided
                      // registration token.
                      admin.messaging(admin.app(app_name)).send(payload)
                        .then((response) => {
                          // Response is a message ID string.
                          callback(null,response)
                          console.log('Successfully sent message:', response);
                        })
                        .catch((error) => {
                          callback(error)
                          console.log('Error sending message:', error);
                        });
                      }
                  }
        }

        this.subscribeToTopic = function(app_name,registrationTokens, topic, callback) {
          admin.messaging(admin.app(app_name)).subscribeToTopic(registrationTokens, topic)
              .then(function(response) {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                callback(null,response)
                console.log('Successfully subscribed to topic:', response);
              })
              .catch(function(error) {
                callback(error)
                console.log('Error subscribing to topic:', error);
              });
        }

        this.unsubscribeFromTopic = function(app_name,registrationTokens, topic, callback) {
          admin.messaging(admin.app(app_name)).unsubscribeFromTopic(registrationTokens, topic)
              .then(function(response) {
                // See the MessagingTopicManagementResponse reference documentation
                // for the contents of response.
                callback(null,response)
                console.log('Successfully unsubscribed to topic:', response);
              })
              .catch(function(error) {
                callback(error)
                console.log('Error unsubscribing to topic:', error);
              });
        }

        this.sendToMultipleTopic = function(payload, topics, callback) {
            multipleTopics(app_name, 0, topics, payload, [], function(response) {
                callback(null, response);
            })
        }

        this.sendToMultipleToken = function(app_name,payload, tokens, callback) {
            multipleTokens(app_name,0, tokens, payload, [], function(response) {
                callback(null, response);
            })
        }
    }
}

var multipleTokens = function(app_name, i, tokens, payload, arrayResult, callback) {
  if(tokens.length > i){
        payload['token'] =  tokens[i];
        var arrayObj = {
            token : payload.token
        };
        admin.messaging(admin.app(app_name)).send(payload)
          .then((response) => {
            arrayObj.response = 'Successfully sent message:'+ response;
            arrayResult.push(arrayObj);
            i = i+1;
            multipleTokens(app_name, i, tokens, payload, arrayResult, callback);
            //console.log(arrayResult);
          })
        .catch((error) => {
          arrayObj.response = 'Error sending message:', error;
          arrayResult.push(arrayObj);
          i = i+1;
          multipleTokens(app_name, i, tokens, payload, arrayResult, callback);
          //console.log(arrayResult);
        });
  }else {
      callback(arrayResult)
  }
}

var multipleTopics = function(app_name, i, topics, payload, arrayResult, callback) {
  if(topics.length > i){
        payload['topic'] =  topics[i];
        var arrayObj = {
            topic : payload.topic
        };
        admin.messaging(admin.app(app_name)).send(payload)
          .then((response) => {
            arrayObj.response = 'Successfully sent message:'+ response;
            arrayResult.push(arrayObj);
            i = i+1;
            multipleTopics(app_name, i, topics, payload, arrayResult, callback);
            //console.log(arrayResult);
          })
        .catch((error) => {
          arrayObj.response = 'Error sending message:', error;
          arrayResult.push(arrayObj);
          i = i+1;
          multipleTopics(app_name, i, topics, payload, arrayResult, callback);
          //console.log(arrayResult);
        });
  }else {
      callback(arrayResult)
  }
}
module.exports = FCM;

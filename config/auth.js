/**
 * Created by suzanne on 11/9/16.
 */
// expose our config directly to our application using module.exports
module.exports = {

  'facebookAuth' : {
    'clientID'      : process.env.FACEBOOK_CLIENT_ID, // your App ID
    'clientSecret'  : process.env.FACEBOOK_SECRET, // your App Secret
    'callbackURL'   : process.env.FACEBOOK_CALLBACK_URL
  },

  'twitterAuth' : {
    'consumerKey'       :  process.env.TWITTER_KEY,
    'consumerSecret'    : process.env.TWITTER_SECRET,
    'callbackURL'       : process.env.TWITTER_CALLBACK_URL
  },

  'googleAuth' : {
    'clientID'      : process.env.GOOGLE_CLIENT_ID,
    'clientSecret'  : process.env.GOOGLE_SECRET,
    'callbackURL'   : process.env.GOOGLE_CALLBACK_URL
  }

  //'facebookAuth' : {
  //  'clientID'      : '1803779953232476', // your App ID
  //  'clientSecret'  : 'f1052e1961736a61d8286f51a926a339', // your App Secret
  //  'callbackURL'   : 'http://localhost:5000/auth/facebook/callback'
  //},
  //
  //'twitterAuth' : {
  //  'consumerKey'       : 'GwZERHolZ30YouyGSU9r3AvMd',
  //  'consumerSecret'    : 'hxpuFjTBZ2E3wm7dbJimlDzM0nA3C9dkZFzQmVjJgnT0kW3WRy',
  //  'callbackURL'       : 'http://localhost:5000/auth/twitter/callback'
  //},
  //
  //'googleAuth' : {
  //  'clientID'      : '191104799585-n8vdaagcam2sao2439ce1o9klku6id1f.apps.googleusercontent.com',
  //  'clientSecret'  : 'l_w_1xaoLPWTnRi4Od0msuNr',
  //  'callbackURL'   : 'http://localhost:5000/auth/google/callback'
  //}

};
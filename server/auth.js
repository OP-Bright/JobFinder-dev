const GoogleStrategy = require('passport-google-oauth20').Strategy;
require("dotenv/config");
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;


//const User = require('./index.js')
const passport = require('passport')




passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback: true
  },
  //this is what happens when someone is successfully logged in.
  function(accessToken, refreshToken, profile, cb) {
    //either create a user in the db if they haven't logged in before
    //or find the user if they have logged in
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

passport.serializeUser(function(user, cb) {
  cb(null, user);

});

passport.deserializeUser(function(user, cb) {
  cb(null, user);

})


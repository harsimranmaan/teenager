"use strict";
var secrets = require("./../.secrets.json");

var exports = module.exports = {};

exports.config = function(app){
  var serverUrl = app.get('url');
  return {
    local: {
      provider: "local",
      module: "passport-local",
      usernameField: "username",
      passwordField: "password",
      authPath: "/auth/local",
      successRedirect: "/auth/account",
      failureRedirect: "/local"
    },
    "facebook-login": {
      provider: "facebook",
      module: "passport-facebook",
      clientID: secrets.facebook.clientID,
      clientSecret: secrets.facebook.clientSecret,
      callbackURL: serverUrl + "/auth/facebook/callback",
      authPath: "/auth/facebook",
      callbackPath: "/auth/facebook/callback",
      successRedirect: "/auth/account",
      scope: ["email"]
    },
    "google-login": {
      provider: "google",
      module: "passport-google-oauth",
      strategy: "OAuth2Strategy",
      clientID: secrets.google.clientID,
      clientSecret: secrets.google.clientSecret,
      callbackURL: serverUrl + "/auth/google/callback",
      authPath: "/auth/google",
      callbackPath: "/auth/google/callback",
      successRedirect: "/auth/account",
      scope: ["email", "profile"]
    },
    "twitter-login": {
        provider: "twitter",
        authScheme: "oauth",
        module: "passport-twitter",
        callbackURL: serverUrl + "/auth/twitter/callback",
        authPath: "/auth/twitter",
        callbackPath: "/auth/twitter/callback",
        successRedirect: "/auth/account",
        consumerKey: secrets.twitter.consumerKey,
        consumerSecret: secrets.twitter.consumerSecret
    }
  };
};

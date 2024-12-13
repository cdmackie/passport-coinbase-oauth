/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;

var request = require("request");

function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL || 'https://www.coinbase.com/oauth/authorize';
  options.tokenURL = options.tokenURL || 'https://api.coinbase.com/oauth/token';
  
  OAuth2Strategy.call(this, options, verify);
  this.name = 'coinbase';
}

/**
 * Inherit from `OAuth2Strategy`.
 */
util.inherits(Strategy, OAuth2Strategy);


Strategy.prototype.userProfile = function(accessToken, done)
{
  request({
    url: "https://api.coinbase.com/v2/user",
    method: "GET",
    json: true,
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + accessToken
    }
  }, function (err, response, body)
  {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      if (typeof body === "string")
      {
        body = JSON.parse(body);
      }
      
      var profile = { provider: 'coinbase' };
      profile.id = body.data.id;
      profile.email = body.data.email;
      profile.displayName = body.data.name;
      profile.name = body.data.name;
      profile.country = body.data.country ? body.data.country.code : null;
      profile.state = body.data.state;
      profile.currency = body.data.native_currency;
      profile.timezone  = body.data.time_zone;
      
      //profile._raw = body;
      profile._json = body.data;
      
      done(null, profile);
    } catch(e) {
      done(e);
    }
  });
}

Strategy.prototype.authorizationParams = function(options) {
  var params = {};
	
	params.account = "all";

  if (options.accessType) {
    params['access_type'] = options.accessType;
  }
	
  return params;
}


/**
 * Expose `Strategy`.
 */
module.exports = Strategy;

/**
 * Module dependencies.
 */
var util = require('util')
  , OAuth2Strategy = require('passport-oauth').OAuth2Strategy
  , InternalOAuthError = require('passport-oauth').InternalOAuthError;


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


Strategy.prototype.userProfile = function(accessToken, done) {
	this._oauth2.get('https://api.coinbase.com/v2/user', accessToken, function (err, body, res) {
    if (err) { return done(new InternalOAuthError('failed to fetch user profile', err)); }
    
    try {
      var json = JSON.parse(body);
      
      var profile = { provider: 'coinbase' };
      profile.id = json.data.id;
      profile.email = json.data.email;
      profile.displayName = json.data.name;
      profile.name = json.data.name;
      profile.country = json.data.country ? json.data.country.code : null;
      profile.state = json.data.state;
      profile.currency = json.data.native_currency;
      profile.timezone  = json.data.time_zone;
      
      //profile._raw = body;
      profile._json = json.data;
      
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

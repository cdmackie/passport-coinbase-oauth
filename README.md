# passport-coinbase-oauth

[Passport](http://passportjs.org/) strategies for authenticating with [Coinbase](http://www.coinbase.com/)
using OAuth 2.0.

---

## Install

    $ npm install passport-coinbase-oauth

## Usage
		
    passport.use(new CoinbaseStrategy({
				clientID: "your-client-id",
				clientSecret: "your-secret",
				callbackURL: "your-callback-url"
			},
			function(accessToken, refreshToken, profile, done) {
				:
		});
		
## License

[The MIT License](http://opensource.org/licenses/MIT)

Copyright (c) 2019 Colin Mackie

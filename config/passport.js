const passport = require('passport');
const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const User = require('./models/user');

require('dotenv').config();

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async function (email, password, cb) {
      const user = await User.findOne({ email }).exec();

      try {
        if (password == user.password) {
          return cb(null, user);
        } else {
          return cb(null, false, { message: 'Password incorrect' });
        }
      } catch (e) {
        return cb(e);
      }
    }
  )
);

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_TOKEN_SECRET,
    },
    (jwtPayload, done) => {
      return done(null, jwtPayload);
    }
  )
);

module.exports = passport;

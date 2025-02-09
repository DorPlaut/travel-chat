// import passport from 'passport';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import dotenv from 'dotenv';

// dotenv.config();

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: '/api/auth/google/callback',
//     },
//     (accessToken, refreshToken, profile, done) => {
//       done(null, {
//         id: profile.id,
//         displayName: profile.displayName,
//         emails: profile.emails,
//       });
//     }
//   )
// );

// export default passport;

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import dotenv from 'dotenv';

dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      // Pass the full profile to have access to all user information
      done(null, {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
      });
    }
  )
);

export default passport;

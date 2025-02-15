import passport from 'passport';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Google OAuth callback controller
export const googleCallback = [
  passport.authenticate('google', {
    session: false,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    try {
      const { id, displayName, emails } = req.user;

      // Check if user exists
      const { data: existingUser, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('google_id', id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      let user;

      if (existingUser) {
        user = existingUser;
      } else {
        // Create new user
        const { data: newUser, error: insertError } = await supabase
          .from('users')
          .insert({
            google_id: id,
            user_name: displayName,
            email: emails[0].value,
          })
          .select('*')
          .single();

        if (insertError) throw insertError;
        user = newUser;
      }

      // Generate JWT
      const token = jwt.sign(
        {
          user_id: user.user_id,
          user_name: user.user_name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Create cookie with token
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        sameSite: 'Strict', // Prevent CSRF attacks
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      });

      // Redirect to frontend with token
      res.redirect(
        `${process.env.FRONTEND_URL}`
        // `${process.env.FRONTEND_URL}/auth-success?token=${token}&id=${user.user_id}`
      );
    } catch (error) {
      console.error('Error during Google callback:', error);
      res.redirect('/login?error=auth_failed');
    }
  },
];

// initiateGoogleLogin controller
export const initiateGoogleLogin = passport.authenticate('google', {
  scope: ['profile', 'email'], // Request access to user's profile and email
});

// get current user
export const getCurrentUser = (req, res) => {
  try {
    const user = req.user; // User data is already attached by `authenticateToken`
    if (!user) {
      return res.status(200).json({ message: 'No token detected' });
    }
    res.status(200).json({ user });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// logout user
export const logoutUser = (req, res) => {
  try {
    // Clear cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
    });
    //
    console.log('Logged out successfully, cookie cleared');

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

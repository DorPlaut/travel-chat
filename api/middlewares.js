import jwt from 'jsonwebtoken';

// export const authenticateToken = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
//   if (!token) return res.status(401).json({ message: 'Unauthorized' });

//   try {
//     const user = jwt.verify(token, process.env.JWT_SECRET); // Verify the token
//     req.user = user; // Attach user data to the request
//     next(); // Proceed to the next middleware or controller
//   } catch (err) {
//     return res.status(403).json({ message: 'Forbidden' });
//   }
// };

export const authenticateToken = (req, res, next) => {
  const token =
    req.cookies.auth_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.log('No token found');

    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

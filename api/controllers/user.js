import { getUserById } from '../utils.js';

export const findOrCreateUser = async (profile) => {
  // logic to find or create a user
  const existingUser = await db.query(
    'SELECT * FROM users WHERE google_id = $1',
    [profile.id]
  );
  if (existingUser.rows.length > 0) {
    return existingUser.rows[0]; // Return the existing user
  }

  // Create a new user if not found
  const newUser = await db.query(
    'INSERT INTO users (google_id, user_name) VALUES ($1, $2) RETURNING *',
    [profile.id, profile.displayName]
  );
  return newUser.rows[0];
};

export const fetchUserById = async (req, res) => {
  const { userId } = req.params;
  console.log('server- fetch user by id', userId);

  try {
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export const getUserFromToken = async (token: string) => {
  try {
    const cleanedToken = token.replace('Bearer ', '').trim();
    const decoded = jwt.verify(cleanedToken, JWT_SECRET) as { id: string };
    return decoded;
  } catch (error) {
    console.error('JWT decoding failed:', error);
    return null;
  }
};

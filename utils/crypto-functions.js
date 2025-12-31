import crypto from 'crypto';

import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Generate JWT Token
export const generateJWTToken = (payload) =>
  jsonwebtoken.sign({ userId: payload }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// Verify JWT Token
export const verifyJWTToken = (token) =>
  jsonwebtoken.verify(token, process.env.JWT_SECRET_KEY);

// Generate 6 Digit Reset Code
export const generateResetCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// Hash Reset Code Using SHA256 With crypto
export const hashResetCode = (code) =>
  crypto.createHash('sha256').update(code).digest('hex');

// Generate Dummy Hash for timing attack mitigation
export const generateDummyHash = async () =>
  await bcrypt.hash('this-is-a-dummy-password', 12);

// Generate a cryptographically-secure random password consisting of
export const generateTempPassword = (length = 12) => {
  if (length < 8) {
    throw new Error('Temp Password length should be at least 8 characters');
  }
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*?'; // letters + digits. Adjust `chars` if you want symbols included.
  const bytes = crypto.randomBytes(length);
  // Map random bytes to chars
  return Array.from(bytes)
    .map((b) => chars[b % chars.length])
    .join('');
};

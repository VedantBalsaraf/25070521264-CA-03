import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';

export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, config.jwtSecret);
};

export const decodeToken = (token) => {
  return jwt.decode(token);
};
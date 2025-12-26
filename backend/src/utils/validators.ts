import { body, ValidationChain } from 'express-validator';

export const registerValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

export const loginValidation: ValidationChain[] = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const petValidation: ValidationChain[] = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Pet name is required'),
  body('type')
    .isIn(['dog', 'cat'])
    .withMessage('Type must be either dog or cat'),
];

import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';
import { ApiError } from './errorHandler';

/**
 * Middleware to check if user has required role
 * Must be used after authenticate middleware
 */
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (!req.user) {
        throw new ApiError('Authentication required', 401);
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ApiError('Insufficient permissions', 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Convenience middleware for common role checks
export const requireAdmin = requireRole(['admin']);
export const requireEditor = requireRole(['editor', 'admin']);
export const requireViewer = requireRole(['viewer', 'editor', 'admin']);

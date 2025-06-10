import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

export interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('\n🔍 =================================');
    console.log('🔍 AUTHENTICATION DEBUG');
    console.log('🔍 =================================');
    console.log('📍 Request URL:', req.method, req.originalUrl);
    console.log('📍 Headers:', JSON.stringify(req.headers, null, 2));

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    console.log('🔑 Authorization Header:', authHeader || 'MISSING');
    console.log('🔑 Extracted Token:', token ? `${token.substring(0, 20)}...` : 'MISSING');

    if (!token) {
      console.log('❌ No token provided - sending 401');
      res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
      return;
    }

    // Verify JWT secret exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET not found in environment variables');
      res.status(500).json({ 
        success: false, 
        message: 'Server configuration error' 
      });
      return;
    }

    console.log('🔑 JWT Secret length:', jwtSecret.length);

    // Verify token
    const decoded = jwt.verify(token, jwtSecret) as any;
    console.log('✅ Token decoded successfully:', { 
      userId: decoded.userId, 
      exp: new Date(decoded.exp * 1000).toISOString() 
    });

    // Find user in database
    const user = await User.findByPk(decoded.userId);
    
    if (!user) {
      console.log('❌ User not found in database:', decoded.userId);
      res.status(401).json({ 
        success: false, 
        message: 'Invalid token - user not found' 
      });
      return;
    }

    console.log('✅ User found:', { 
      id: user.id, 
      email: user.email,
      username: user.username 
    });
    console.log('🔍 =================================\n');

    // Attach user to request
    req.user = user;
    next();

  } catch (error: any) {
    console.error('❌ Token verification failed:');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Full error:', error);
    console.log('🔍 =================================\n');
    
    if (error.name === 'JsonWebTokenError') {
      res.status(403).json({ 
        success: false, 
        message: 'Invalid token format' 
      });
    } else if (error.name === 'TokenExpiredError') {
      res.status(403).json({ 
        success: false, 
        message: 'Token has expired' 
      });
    } else {
      res.status(403).json({ 
        success: false, 
        message: 'Token verification failed',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
    return;
  }
};
import { Router, Response } from 'express';
import { body, validationResult } from 'express-validator';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get user profile
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    console.log('🔍 Getting profile for user:', id);
    console.log('🔍 Request user ID:', req.user.id);
    
    // Users can only access their own profile (for now)
    if (req.user.id !== id) {
      console.log('❌ Access denied - user mismatch');
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      console.log('❌ User not found:', id);
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    console.log('✅ User found:', user.email);
    res.json({
      success: true,
      data: user.toJSON()
    });

  } catch (error: any) {
    console.error('❌ Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user profile',
      error: error.message
    });
  }
});

// Update user profile
router.patch('/:id', [
  authenticateToken,
  body('firstName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('First name must be 1-100 characters'),
  body('lastName').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Last name must be 1-100 characters'),
  body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('🔄 Updating profile for user:', req.params.id);
    console.log('🔄 Update data:', req.body);
    
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const { firstName, lastName, bio } = req.body;
    
    // Users can only update their own profile
    if (req.user.id !== id) {
      console.log('❌ Access denied - user mismatch');
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      console.log('❌ User not found for update:', id);
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    // Update only provided fields
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (bio !== undefined) updateData.bio = bio;

    console.log('📝 Applying updates:', updateData);
    await user.update(updateData);
    console.log('✅ Profile updated successfully');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON()
    });

  } catch (error: any) {
    console.error('❌ Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
});

// Delete user account
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    console.log('🗑️ Deleting account for user:', id);
    
    // Users can only delete their own account
    if (req.user.id !== id) {
      console.log('❌ Access denied - user mismatch');
      res.status(403).json({
        success: false,
        message: 'Access denied'
      });
      return;
    }

    const user = await User.findByPk(id);
    
    if (!user) {
      console.log('❌ User not found for deletion:', id);
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    await user.destroy();
    console.log('✅ Account deleted successfully');

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete user account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
});

export default router;
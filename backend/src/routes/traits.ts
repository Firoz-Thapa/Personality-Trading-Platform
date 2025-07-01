import { Router, Response } from 'express';
import { body, query, validationResult } from 'express-validator';
import { Op, WhereOptions } from 'sequelize';
import PersonalityTrait, { TraitCategory } from '../models/PersonalityTrait';
import User from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = Router();

// Get all traits with search and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search query too long'),
  query('category').optional().isIn(Object.values(TraitCategory)).withMessage('Invalid category'),
  query('minRating').optional().isFloat({ min: 0, max: 5 }).withMessage('Min rating must be between 0 and 5'),
  query('maxPrice').optional().isInt({ min: 0 }).withMessage('Max price must be positive'),
  query('verified').optional().isBoolean().withMessage('Verified must be boolean'),
  query('available').optional().isBoolean().withMessage('Available must be boolean'),
  query('sortBy').optional().isIn(['rating', 'price', 'popularity', 'newest']).withMessage('Invalid sort option'),
  query('sortOrder').optional().isIn(['asc', 'desc']).withMessage('Sort order must be asc or desc'),
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    console.log('\n🔍 =================================');
    console.log('🔍 GET /traits REQUEST DEBUG');
    console.log('🔍 =================================');
    console.log('📍 Query params:', req.query);

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

    // Test database connection first
    try {
      await PersonalityTrait.findOne({ limit: 1 });
      console.log('✅ Database connection test passed');
    } catch (dbError: any) {
      console.error('❌ Database connection failed:', dbError);
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
      });
      return;
    }

    // Extract query parameters with better null handling
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string;
    const category = req.query.category as TraitCategory;
    const minRatingStr = req.query.minRating as string;
    const maxPriceStr = req.query.maxPrice as string;
    const verifiedStr = req.query.verified as string;
    const availableStr = req.query.available as string;
    const sortBy = req.query.sortBy as string || 'newest';
    const sortOrder = req.query.sortOrder as string || 'desc';

    // Parse numeric values safely
    const minRating = minRatingStr && !isNaN(parseFloat(minRatingStr)) ? parseFloat(minRatingStr) : null;
    const maxPrice = maxPriceStr && !isNaN(parseInt(maxPriceStr)) ? parseInt(maxPriceStr) : null;
    const verified = verifiedStr === 'true' ? true : verifiedStr === 'false' ? false : null;
    const available = availableStr === 'false' ? false : true; // Default to true

    console.log('📊 Parsed parameters:', {
      page, limit, search, category, minRating, maxPrice, verified, available, sortBy, sortOrder
    });

    // Build where conditions with proper typing and null checks
    const whereConditions: WhereOptions<any> = {};

    // Always filter by available unless explicitly set to false
    whereConditions.available = available;

    if (category && Object.values(TraitCategory).includes(category)) {
      whereConditions.category = category;
    }

    if (minRating !== null && minRating >= 0 && minRating <= 5) {
      whereConditions.averageRating = { [Op.gte]: minRating };
    }

    if (maxPrice !== null && maxPrice > 0) {
      whereConditions.hourlyRate = { [Op.lte]: maxPrice };
    }

    if (verified !== null) {
      whereConditions.verified = verified;
    }

    if (search && search.trim().length > 0) {
      const searchTerm = search.trim();
      whereConditions[Op.or as any] = [
        { name: { [Op.iLike]: `%${searchTerm}%` } },
        { description: { [Op.iLike]: `%${searchTerm}%` } }
      ];
    }

    console.log('🔧 Where conditions:', JSON.stringify(whereConditions, null, 2));

    // Build order conditions
    let orderConditions: any[] = [];
    switch (sortBy) {
      case 'rating':
        orderConditions = [['averageRating', sortOrder], ['totalRentals', 'desc']];
        break;
      case 'price':
        orderConditions = [['hourlyRate', sortOrder]];
        break;
      case 'popularity':
        orderConditions = [['totalRentals', sortOrder], ['averageRating', 'desc']];
        break;
      case 'newest':
      default:
        orderConditions = [['createdAt', sortOrder]];
        break;
    }

    console.log('📈 Order conditions:', orderConditions);

    // Calculate offset
    const offset = (page - 1) * limit;

    // Fetch traits with pagination and better error handling
    console.log('🔍 Executing database query...');
    const { rows: traits, count: total } = await PersonalityTrait.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'verified'],
          required: false // Use LEFT JOIN to avoid issues with missing owners
        }
      ],
      order: orderConditions,
      limit: Math.min(limit, 50), // Cap limit to prevent large queries
      offset,
      distinct: true,
      subQuery: false // This can help with complex queries
    });

    console.log(`✅ Query successful: Found ${total} total traits, returning ${traits.length} for page ${page}`);

    const totalPages = Math.ceil(total / limit);

    const response = {
      success: true,
      data: traits,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
      filters: {
        search: search || null,
        category: category || null,
        minRating,
        maxPrice,
        verified,
        available,
        sortBy,
        sortOrder,
      }
    };

    res.json(response);
    console.log('🔍 =================================\n');

  } catch (error: any) {
    console.error('❌ Get traits error details:');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    // Specific error handling for common database issues
    let errorMessage = 'Failed to fetch traits';
    let statusCode = 500;

    if (error.name === 'SequelizeConnectionError') {
      errorMessage = 'Database connection error';
      statusCode = 503;
    } else if (error.name === 'SequelizeDatabaseError') {
      errorMessage = 'Database query error';
      if (error.message.includes('relation') && error.message.includes('does not exist')) {
        errorMessage = 'Database tables not initialized';
      }
    } else if (error.name === 'SequelizeValidationError') {
      errorMessage = 'Invalid query parameters';
      statusCode = 400;
    }

    console.log('🔍 =================================\n');
    
    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? {
        name: error.name,
        stack: error.stack?.split('\n').slice(0, 5).join('\n') // Truncate stack trace
      } : undefined
    });
  }
});

// Get single trait by ID
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('🔍 Getting trait:', id);

    // Validate UUID format
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
      res.status(400).json({
        success: false,
        message: 'Invalid trait ID format'
      });
      return;
    }

    const trait = await PersonalityTrait.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'bio', 'verified', 'createdAt'],
          required: false
        }
      ]
    });

    if (!trait) {
      console.log('❌ Trait not found:', id);
      res.status(404).json({
        success: false,
        message: 'Trait not found'
      });
      return;
    }

    console.log('✅ Trait found:', trait.name);

    res.json({
      success: true,
      data: trait
    });

  } catch (error: any) {
    console.error('❌ Get trait error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get trait',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Create new trait (authenticated users only)
router.post('/', [
  authenticateToken,
  body('name').trim().isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters'),
  body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category').isIn(Object.values(TraitCategory)).withMessage('Invalid category'),
  body('hourlyRate').isInt({ min: 100, max: 50000 }).withMessage('Hourly rate must be between $1.00 and $500.00'),
  body('dailyRate').optional().isInt({ min: 500, max: 200000 }).withMessage('Daily rate must be between $5.00 and $2000.00'),
  body('weeklyRate').optional().isInt({ min: 2000, max: 1000000 }).withMessage('Weekly rate must be between $20.00 and $10,000.00'),
  body('maxUsers').optional().isInt({ min: 1, max: 100 }).withMessage('Max users must be between 1 and 100'),
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { name, description, category, hourlyRate, dailyRate, weeklyRate, maxUsers } = req.body;

    console.log('📝 Creating trait:', { name, category, hourlyRate });

    // Create trait
    const trait = await PersonalityTrait.create({
      ownerId: req.user.id,
      name: name.trim(),
      description: description.trim(),
      category,
      hourlyRate,
      dailyRate,
      weeklyRate,
      maxUsers: maxUsers || 1,
    });

    // Fetch created trait with owner info
    const createdTrait = await PersonalityTrait.findByPk(trait.id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'verified']
        }
      ]
    });

    console.log('✅ Trait created successfully:', trait.id);

    res.status(201).json({
      success: true,
      message: 'Trait created successfully',
      data: createdTrait
    });

  } catch (error: any) {
    console.error('❌ Create trait error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create trait',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Update trait (owner only)
router.put('/:id', [
  authenticateToken,
  body('name').optional().trim().isLength({ min: 3, max: 200 }).withMessage('Name must be 3-200 characters'),
  body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Description must be 10-2000 characters'),
  body('category').optional().isIn(Object.values(TraitCategory)).withMessage('Invalid category'),
  body('hourlyRate').optional().isInt({ min: 100, max: 50000 }).withMessage('Hourly rate must be between $1.00 and $500.00'),
  body('dailyRate').optional().isInt({ min: 500, max: 200000 }).withMessage('Daily rate must be between $5.00 and $2000.00'),
  body('weeklyRate').optional().isInt({ min: 2000, max: 1000000 }).withMessage('Weekly rate must be between $20.00 and $10,000.00'),
  body('available').optional().isBoolean().withMessage('Available must be boolean'),
  body('maxUsers').optional().isInt({ min: 1, max: 100 }).withMessage('Max users must be between 1 and 100'),
], async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Check validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
      return;
    }

    const { id } = req.params;
    const updateData = req.body;

    console.log('🔄 Updating trait:', id);

    // Find trait
    const trait = await PersonalityTrait.findByPk(id);

    if (!trait) {
      console.log('❌ Trait not found for update:', id);
      res.status(404).json({
        success: false,
        message: 'Trait not found'
      });
      return;
    }

    // Check ownership
    if (trait.ownerId !== req.user.id) {
      console.log('❌ Access denied - not trait owner');
      res.status(403).json({
        success: false,
        message: 'Access denied - you can only update your own traits'
      });
      return;
    }

    // Update trait
    await trait.update(updateData);

    // Fetch updated trait with owner info
    const updatedTrait = await PersonalityTrait.findByPk(id, {
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'verified']
        }
      ]
    });

    console.log('✅ Trait updated successfully');

    res.json({
      success: true,
      message: 'Trait updated successfully',
      data: updatedTrait
    });

  } catch (error: any) {
    console.error('❌ Update trait error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update trait',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Delete trait (owner only)
router.delete('/:id', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    console.log('🗑️ Deleting trait:', id);

    // Find trait
    const trait = await PersonalityTrait.findByPk(id);

    if (!trait) {
      console.log('❌ Trait not found for deletion:', id);
      res.status(404).json({
        success: false,
        message: 'Trait not found'
      });
      return;
    }

    // Check ownership
    if (trait.ownerId !== req.user.id) {
      console.log('❌ Access denied - not trait owner');
      res.status(403).json({
        success: false,
        message: 'Access denied - you can only delete your own traits'
      });
      return;
    }

    // Delete trait
    await trait.destroy();

    console.log('✅ Trait deleted successfully');

    res.json({
      success: true,
      message: 'Trait deleted successfully'
    });

  } catch (error: any) {
    console.error('❌ Delete trait error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete trait',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get user's traits
router.get('/user/:userId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    console.log('🔍 Getting traits for user:', userId);

    const { rows: traits, count: total } = await PersonalityTrait.findAndCountAll({
      where: { ownerId: userId },
      include: [
        {
          model: User,
          as: 'owner',
          attributes: ['id', 'username', 'firstName', 'lastName', 'avatar', 'verified'],
          required: false
        }
      ],
      order: [['createdAt', 'desc']],
      limit,
      offset,
    });

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: traits,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }
    });

  } catch (error: any) {
    console.error('❌ Get user traits error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user traits',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Get trait categories
router.get('/meta/categories', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const categories = Object.values(TraitCategory).map(category => ({
      value: category,
      label: category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
      description: getCategoryDescription(category)
    }));

    res.json({
      success: true,
      data: categories
    });

  } catch (error: any) {
    console.error('❌ Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get categories',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Helper function for category descriptions
function getCategoryDescription(category: TraitCategory): string {
  const descriptions = {
    [TraitCategory.CONFIDENCE]: 'Self-assurance and belief in one\'s abilities',
    [TraitCategory.COMMUNICATION]: 'Clear and effective expression of ideas',
    [TraitCategory.LEADERSHIP]: 'Ability to guide and inspire others',
    [TraitCategory.CREATIVITY]: 'Innovation and original thinking',
    [TraitCategory.EMPATHY]: 'Understanding and sharing others\' feelings',
    [TraitCategory.HUMOR]: 'Wit and ability to find/create comedy',
    [TraitCategory.ASSERTIVENESS]: 'Standing up for oneself respectfully',
    [TraitCategory.CHARISMA]: 'Personal magnetism and charm',
    [TraitCategory.PATIENCE]: 'Calm persistence and tolerance',
    [TraitCategory.NEGOTIATION]: 'Reaching mutually beneficial agreements',
    [TraitCategory.PUBLIC_SPEAKING]: 'Confident presentation to groups',
    [TraitCategory.OTHER]: 'Miscellaneous personality traits'
  };
  
  return descriptions[category] || 'Personality trait';
}

export default router;
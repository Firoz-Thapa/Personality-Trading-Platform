CREATE DATABASE IF NOT EXISTS personatrade;
USE personatrade;

-- Users table
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500),
    bio TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_email (email),
    INDEX idx_username (username)
);

-- Personality profiles table
CREATE TABLE personality_profiles (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) UNIQUE NOT NULL,
    
    -- Big Five personality traits (0-100 scale)
    openness INT NOT NULL DEFAULT 50,
    conscientiousness INT NOT NULL DEFAULT 50,
    extraversion INT NOT NULL DEFAULT 50,
    agreeableness INT NOT NULL DEFAULT 50,
    neuroticism INT NOT NULL DEFAULT 50,
    
    -- Behavioral metrics
    confidence_level INT DEFAULT 50,
    empathy_score INT DEFAULT 50,
    humor_style VARCHAR(50),
    leadership_style VARCHAR(50),
    
    -- Analysis data (stored as JSON)
    communication_pattern JSON,
    analysis_data JSON,
    
    -- Metadata
    completion_score INT DEFAULT 0,
    last_analyzed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Personality traits table
CREATE TABLE personality_traits (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    owner_id VARCHAR(36) NOT NULL,
    
    -- Trait details
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category ENUM(
        'CONFIDENCE', 'COMMUNICATION', 'LEADERSHIP', 'CREATIVITY', 
        'EMPATHY', 'HUMOR', 'ASSERTIVENESS', 'CHARISMA', 
        'PATIENCE', 'NEGOTIATION', 'PUBLIC_SPEAKING', 'OTHER'
    ) NOT NULL,
    
    -- Pricing (stored as cents to avoid decimal issues)
    hourly_rate INT NOT NULL, -- in cents
    daily_rate INT,
    weekly_rate INT,
    
    -- Availability
    available BOOLEAN DEFAULT TRUE,
    max_users INT DEFAULT 1,
    
    -- Performance metrics
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    total_rentals INT DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.00,
    
    -- Verification
    verified BOOLEAN DEFAULT FALSE,
    verification_data JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_owner_id (owner_id),
    INDEX idx_category (category),
    INDEX idx_available (available)
);

-- Trait rentals table
CREATE TABLE trait_rentals (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Parties involved
    renter_id VARCHAR(36) NOT NULL,
    provider_id VARCHAR(36) NOT NULL,
    trait_id VARCHAR(36) NOT NULL,
    
    -- Rental details
    start_date TIMESTAMP NOT NULL,
    end_date TIMESTAMP NOT NULL,
    total_cost INT NOT NULL, -- in cents
    status ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    
    -- Usage tracking
    success_metrics JSON,
    
    -- Payment
    payment_id VARCHAR(100),
    payment_status ENUM('PENDING', 'PAID', 'FAILED', 'REFUNDED') DEFAULT 'PENDING',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (renter_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (provider_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trait_id) REFERENCES personality_traits(id) ON DELETE CASCADE,
    
    INDEX idx_renter_id (renter_id),
    INDEX idx_provider_id (provider_id),
    INDEX idx_trait_id (trait_id),
    INDEX idx_status (status),
    INDEX idx_dates (start_date, end_date)
);

-- Coaching sessions table
CREATE TABLE coaching_sessions (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    rental_id VARCHAR(36),
    
    -- Session details
    session_type ENUM('AI_COACHING', 'PRACTICE', 'REAL_TIME') NOT NULL,
    scenario VARCHAR(500),
    duration_minutes INT,
    
    -- Performance data
    confidence_score INT,
    authenticity_score INT,
    improvement_metrics JSON,
    
    -- AI coaching data
    ai_feedback TEXT,
    coaching_prompts JSON,
    
    started_at TIMESTAMP NOT NULL,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (rental_id) REFERENCES trait_rentals(id) ON DELETE SET NULL,
    
    INDEX idx_user_id (user_id),
    INDEX idx_rental_id (rental_id),
    INDEX idx_session_type (session_type)
);

-- Reviews table
CREATE TABLE reviews (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    
    -- Review parties
    reviewer_id VARCHAR(36) NOT NULL,
    reviewee_id VARCHAR(36) NOT NULL,
    trait_id VARCHAR(36),
    rental_id VARCHAR(36),
    
    -- Review content
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(200),
    content TEXT,
    
    -- Review metadata
    verified BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (reviewer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewee_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (trait_id) REFERENCES personality_traits(id) ON DELETE SET NULL,
    FOREIGN KEY (rental_id) REFERENCES trait_rentals(id) ON DELETE SET NULL,
    
    INDEX idx_reviewer_id (reviewer_id),
    INDEX idx_reviewee_id (reviewee_id),
    INDEX idx_trait_id (trait_id),
    INDEX idx_rating (rating)
);

-- User analytics table
CREATE TABLE user_analytics (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) UNIQUE NOT NULL,
    
    -- Usage metrics
    total_sessions INT DEFAULT 0,
    total_hours_coached DECIMAL(8,2) DEFAULT 0.00,
    traits_tried INT DEFAULT 0,
    
    -- Performance metrics
    average_confidence_improvement DECIMAL(5,2) DEFAULT 0.00,
    success_rate DECIMAL(5,2) DEFAULT 0.00,
    
    -- Engagement metrics
    streak_days INT DEFAULT 0,
    last_active TIMESTAMP,
    
    -- Growth tracking
    personality_growth_data JSON,
    milestone_achievements JSON,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Trait categories lookup (for reference)
CREATE TABLE trait_categories (
    id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- hex color code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default trait categories
INSERT INTO trait_categories (name, description, icon, color) VALUES
('CONFIDENCE', 'Self-assurance and belief in one\'s abilities', 'shield', '#3B82F6'),
('COMMUNICATION', 'Clear and effective expression of ideas', 'message-circle', '#10B981'),
('LEADERSHIP', 'Ability to guide and inspire others', 'crown', '#F59E0B'),
('CREATIVITY', 'Innovation and original thinking', 'lightbulb', '#8B5CF6'),
('EMPATHY', 'Understanding and sharing others\' feelings', 'heart', '#EF4444'),
('HUMOR', 'Wit and ability to find/create comedy', 'smile', '#F97316'),
('ASSERTIVENESS', 'Standing up for oneself respectfully', 'zap', '#06B6D4'),
('CHARISMA', 'Personal magnetism and charm', 'star', '#EC4899'),
('PATIENCE', 'Calm persistence and tolerance', 'clock', '#84CC16'),
('NEGOTIATION', 'Reaching mutually beneficial agreements', 'handshake', '#6366F1'),
('PUBLIC_SPEAKING', 'Confident presentation to groups', 'mic', '#14B8A6'),
('OTHER', 'Miscellaneous personality traits', 'more-horizontal', '#6B7280');

-- Create indexes for better performance
CREATE INDEX idx_traits_available_category ON personality_traits(available, category);
CREATE INDEX idx_rentals_active_dates ON trait_rentals(status, start_date, end_date);
CREATE INDEX idx_sessions_user_date ON coaching_sessions(user_id, started_at);
CREATE INDEX idx_reviews_trait_rating ON reviews(trait_id, rating);

-- Create views for common queries
CREATE VIEW active_traits AS
SELECT 
    pt.*,
    u.username as owner_username,
    u.first_name as owner_first_name,
    u.avatar as owner_avatar,
    tc.name as category_name,
    tc.icon as category_icon,
    tc.color as category_color
FROM personality_traits pt
JOIN users u ON pt.owner_id = u.id
JOIN trait_categories tc ON pt.category = tc.name
WHERE pt.available = TRUE AND pt.verified = TRUE;

CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    COUNT(DISTINCT pt.id) as traits_offered,
    COUNT(DISTINCT tr_renter.id) as traits_rented,
    COUNT(DISTINCT tr_provider.id) as traits_provided,
    AVG(r.rating) as average_rating,
    COUNT(DISTINCT r.id) as total_reviews
FROM users u
LEFT JOIN personality_traits pt ON u.id = pt.owner_id
LEFT JOIN trait_rentals tr_renter ON u.id = tr_renter.renter_id
LEFT JOIN trait_rentals tr_provider ON u.id = tr_provider.provider_id
LEFT JOIN reviews r ON u.id = r.reviewee_id
GROUP BY u.id, u.username;
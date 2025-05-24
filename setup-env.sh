#!/bin/bash

# PersonaTrade Environment Setup Script
# This script helps you set up your environment variables

echo "🚀 PersonaTrade Environment Setup"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to generate random string
generate_secret() {
    openssl rand -base64 32 2>/dev/null || date +%s | sha256sum | base64 | head -c 32
}

# Backend environment setup
echo -e "${BLUE}Setting up Backend environment...${NC}"
if [ ! -f "backend/.env" ]; then
    if [ -f "backend/.env.example" ]; then
        cp backend/.env.example backend/.env
        echo -e "${GREEN}✓ Created backend/.env from template${NC}"
        
        # Generate JWT secret
        JWT_SECRET=$(generate_secret)
        sed -i.bak "s/your_super_secret_jwt_key_here_make_it_long_and_random/$JWT_SECRET/g" backend/.env
        echo -e "${GREEN}✓ Generated JWT secret${NC}"
        
        # Generate session secret
        SESSION_SECRET=$(generate_secret)
        sed -i.bak "s/your_session_secret_here/$SESSION_SECRET/g" backend/.env
        echo -e "${GREEN}✓ Generated session secret${NC}"
        
        # Clean up backup files
        rm -f backend/.env.bak
        
        echo -e "${YELLOW}⚠️  Please update the following in backend/.env:${NC}"
        echo "   - Database credentials (DB_PASSWORD, DB_USER)"
        echo "   - OpenAI API key (OPENAI_API_KEY)"
        echo "   - Email service credentials (SMTP_* or SENDGRID_API_KEY)"
        echo "   - Stripe keys (STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY)"
        echo ""
    else
        echo -e "${RED}✗ backend/.env.example not found!${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  backend/.env already exists${NC}"
fi

# Frontend environment setup
echo -e "${BLUE}Setting up Frontend environment...${NC}"
if [ ! -f "frontend/.env.local" ]; then
    if [ -f "frontend/.env.example" ]; then
        cp frontend/.env.example frontend/.env.local
        echo -e "${GREEN}✓ Created frontend/.env.local from template${NC}"
        
        echo -e "${YELLOW}⚠️  Please update the following in frontend/.env.local:${NC}"
        echo "   - Stripe publishable key (NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)"
        echo "   - OAuth client IDs (if using social login)"
        echo "   - Analytics tracking IDs (if using analytics)"
        echo ""
    else
        echo -e "${RED}✗ frontend/.env.example not found!${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  frontend/.env.local already exists${NC}"
fi

echo -e "${BLUE}Environment setup complete!${NC}"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo "1. Update the environment variables with your actual values"
echo "2. Set up your MySQL database"
echo "3. Run 'npm install' in both backend/ and frontend/ directories"
echo "4. Start the development servers:"
echo "   - Backend: cd backend && npm run dev"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo -e "${YELLOW}Important Security Notes:${NC}"
echo "- Never commit .env files to version control"
echo "- Use different secrets for development and production"
echo "- Regularly rotate your API keys and secrets"
echo "- Use strong, unique passwords for your database"
echo ""

# Check if required tools are installed
echo -e "${BLUE}Checking required tools...${NC}"

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found. Please install Node.js 18+ ${NC}"
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✓ npm installed: $NPM_VERSION${NC}"
else
    echo -e "${RED}✗ npm not found${NC}"
fi

# Check MySQL
if command -v mysql &> /dev/null; then
    echo -e "${GREEN}✓ MySQL client installed${NC}"
else
    echo -e "${YELLOW}⚠️  MySQL client not found. Make sure MySQL server is accessible${NC}"
fi

# Check Git
if command -v git &> /dev/null; then
    echo -e "${GREEN}✓ Git installed${NC}"
else
    echo -e "${RED}✗ Git not found${NC}"
fi

echo ""
echo -e "${GREEN}Setup script completed!${NC}"
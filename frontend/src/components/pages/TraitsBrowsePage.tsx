import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  Users, 
  Clock, 
  CheckCircle,
  SlidersHorizontal,
  Grid,
  List
} from 'lucide-react';

// Type definitions (inline since we can't import from @/lib/types)
enum TraitCategory {
  CONFIDENCE = 'CONFIDENCE',
  COMMUNICATION = 'COMMUNICATION',
  LEADERSHIP = 'LEADERSHIP',
  CREATIVITY = 'CREATIVITY',
  EMPATHY = 'EMPATHY',
  HUMOR = 'HUMOR',
  ASSERTIVENESS = 'ASSERTIVENESS',
  CHARISMA = 'CHARISMA',
  PATIENCE = 'PATIENCE',
  NEGOTIATION = 'NEGOTIATION',
  PUBLIC_SPEAKING = 'PUBLIC_SPEAKING',
  OTHER = 'OTHER'
}

interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  verified: boolean;
}

interface PersonalityTrait {
  id: string;
  ownerId: string;
  owner?: User;
  name: string;
  description: string;
  category: TraitCategory;
  hourlyRate: number;
  dailyRate?: number;
  weeklyRate?: number;
  available: boolean;
  maxUsers: number;
  successRate: number;
  totalRentals: number;
  averageRating: number;
  verified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TraitFilters {
  search?: string;
  category?: TraitCategory;
  minRating?: number;
  maxPrice?: number;
  verified?: boolean;
  available?: boolean;
  sortBy?: 'newest' | 'rating' | 'price' | 'popularity';
  sortOrder?: 'asc' | 'desc';
}

// Utility functions (inline since we can't import from @/lib/utils)
const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
};

const formatRelativeTime = (date: string): string => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

const getInitials = (firstName: string, lastName: string): string => {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
};

// Simple API client (inline since we can't import from @/lib/api/client)
const api = {
  get: async (url: string, config?: any) => {
    const baseURL = 'http://localhost:5000/api/v1';
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers: any = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      let cleanToken = token;
      if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
        cleanToken = cleanToken.slice(1, -1);
      }
      headers.Authorization = `Bearer ${cleanToken}`;
    }

    const queryString = config?.params ? 
      '?' + new URLSearchParams(
        Object.entries(config.params).reduce((acc: any, [key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            acc[key] = String(value);
          }
          return acc;
        }, {})
      ).toString() : '';

    const response = await fetch(`${baseURL}${url}${queryString}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  }
};

// Button component (inline since we can't import from @/components/ui/Button)
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900 focus:ring-gray-500',
    outline: 'border-2 border-gray-300 hover:border-gray-400 bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900 focus:ring-gray-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 focus:ring-gray-500'
  };
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// Input component (inline since we can't import from @/components/ui/Input)
interface InputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  className = ''
}) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
    />
  );
};

// Layout component (inline since we can't import from @/components/layout/Layout)
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🧠</span>
              <span className="text-xl font-bold text-gray-900">PersonaTrade</span>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">Sign in</Button>
              <Button variant="primary" size="sm">Get started</Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="pt-16">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

const TraitsBrowsePage: React.FC = () => {
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  const [filters, setFilters] = useState<TraitFilters>({
    search: '',
    category: undefined,
    minRating: undefined,
    maxPrice: undefined,
    verified: undefined,
    available: true,
    sortBy: 'newest',
    sortOrder: 'desc'
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  useEffect(() => {
    fetchTraits();
  }, [filters, pagination.page]);

  const fetchTraits = async () => {
    try {
      setLoading(true);
      const queryParams = {
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      };

      const response = await api.get('/traits', { params: queryParams });
      
      if (response.success && response.data && response.pagination) {
        setTraits(response.data);
        setPagination(response.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch traits:', error);
      // Mock data for demo purposes
      const mockTraits: PersonalityTrait[] = [
        {
          id: '1',
          ownerId: '1',
          owner: {
            id: '1',
            email: 'john@example.com',
            username: 'johnsmith',
            firstName: 'John',
            lastName: 'Smith',
            verified: true
          },
          name: 'Confident Public Speaking',
          description: 'Master the art of speaking in front of large audiences with confidence and charisma. Perfect for presentations, speeches, and professional meetings.',
          category: TraitCategory.CONFIDENCE,
          hourlyRate: 5000,
          dailyRate: 35000,
          available: true,
          maxUsers: 3,
          successRate: 92,
          totalRentals: 47,
          averageRating: 4.8,
          verified: true,
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          ownerId: '2',
          owner: {
            id: '2',
            email: 'sarah@example.com',
            username: 'sarahwilson',
            firstName: 'Sarah',
            lastName: 'Wilson',
            verified: true
          },
          name: 'Empathetic Leadership',
          description: 'Learn to lead with empathy and understanding. Build stronger team relationships and create a positive work environment.',
          category: TraitCategory.EMPATHY,
          hourlyRate: 6000,
          dailyRate: 42000,
          available: true,
          maxUsers: 2,
          successRate: 95,
          totalRentals: 23,
          averageRating: 4.9,
          verified: true,
          createdAt: '2024-01-14T14:20:00Z',
          updatedAt: '2024-01-14T14:20:00Z'
        },
        {
          id: '3',
          ownerId: '3',
          owner: {
            id: '3',
            email: 'mike@example.com',
            username: 'mikejohnson',
            firstName: 'Mike',
            lastName: 'Johnson',
            verified: false
          },
          name: 'Creative Problem Solving',
          description: 'Develop innovative thinking patterns and creative approaches to challenging problems in any field.',
          category: TraitCategory.CREATIVITY,
          hourlyRate: 4500,
          available: true,
          maxUsers: 5,
          successRate: 88,
          totalRentals: 31,
          averageRating: 4.6,
          verified: false,
          createdAt: '2024-01-13T09:15:00Z',
          updatedAt: '2024-01-13T09:15:00Z'
        }
      ];
      
      setTraits(mockTraits);
      setPagination({
        page: 1,
        limit: 12,
        total: 3,
        totalPages: 1,
        hasNextPage: false,
        hasPrevPage: false
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TraitFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const TraitCard: React.FC<{ trait: PersonalityTrait }> = ({ trait }) => {
    const getCategoryColor = (category: string) => {
      const colors: Record<string, string> = {
        'CONFIDENCE': 'bg-blue-100 text-blue-800',
        'COMMUNICATION': 'bg-green-100 text-green-800',
        'LEADERSHIP': 'bg-purple-100 text-purple-800',
        'CREATIVITY': 'bg-yellow-100 text-yellow-800',
        'EMPATHY': 'bg-pink-100 text-pink-800',
        'HUMOR': 'bg-orange-100 text-orange-800',
        'ASSERTIVENESS': 'bg-red-100 text-red-800',
        'CHARISMA': 'bg-indigo-100 text-indigo-800',
        'PATIENCE': 'bg-teal-100 text-teal-800',
        'NEGOTIATION': 'bg-gray-100 text-gray-800',
        'PUBLIC_SPEAKING': 'bg-cyan-100 text-cyan-800',
        'OTHER': 'bg-gray-100 text-gray-800',
      };
      return colors[category] || 'bg-gray-100 text-gray-800';
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(trait.category)}`}>
            {trait.category.replace(/_/g, ' ')}
          </span>
          {trait.verified && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {trait.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {trait.description}
        </p>

        {/* Provider */}
        <div className="flex items-center space-x-3 mb-4">
          {trait.owner?.avatar ? (
            <img
              src={trait.owner.avatar}
              alt={`${trait.owner.firstName} ${trait.owner.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {getInitials(trait.owner?.firstName || '', trait.owner?.lastName || '')}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">
              {trait.owner?.firstName} {trait.owner?.lastName}
            </p>
            <p className="text-xs text-gray-500">@{trait.owner?.username}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{trait.averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{trait.totalRentals}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{trait.successRate}%</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xl font-bold text-gray-900">
              {formatCurrency(trait.hourlyRate)}
            </span>
            <span className="text-sm text-gray-600">/hr</span>
          </div>
          <span className="text-xs text-gray-500">
            {formatRelativeTime(trait.createdAt)}
          </span>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="primary"
            size="sm"
            className="flex-1"
            onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.href = `/traits/${trait.id}`;
              }
            }}
          >
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={!trait.available}
          >
            {trait.available ? 'Book Now' : 'Unavailable'}
          </Button>
        </div>
      </div>
    );
  };

  const FilterPanel: React.FC = () => (
    <div className={`
      ${showFilters ? 'block' : 'hidden'} lg:block
      bg-white rounded-lg shadow-sm border border-gray-200 p-6
    `}>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      {/* Category Filter */}
      <div className="mb-6">
        <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category-filter"
          value={filters.category || ''}
          onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by trait category"
        >
          <option value="">All Categories</option>
          {Object.values(TraitCategory).map(category => (
            <option key={category} value={category}>
              {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Price (per hour)
        </label>
        <Input
          type="number"
          placeholder="$50"
          value={filters.maxPrice?.toString() || ''}
          onChange={(value) => handleFilterChange('maxPrice', value ? parseInt(value) * 100 : undefined)}
        />
      </div>

      {/* Rating Filter */}
      <div className="mb-6">
        <label htmlFor="rating-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating
        </label>
        <select
          id="rating-filter"
          value={filters.minRating?.toString() || ''}
          onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Filter by minimum rating"
        >
          <option value="">Any Rating</option>
          <option value="4">4+ Stars</option>
          <option value="3">3+ Stars</option>
          <option value="2">2+ Stars</option>
        </select>
      </div>

      {/* Verified Only */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.verified === true}
            onChange={(e) => handleFilterChange('verified', e.target.checked ? true : undefined)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Verified providers only</span>
        </label>
      </div>

      {/* Available Only */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.available === true}
            onChange={(e) => handleFilterChange('available', e.target.checked ? true : undefined)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm text-gray-700">Available now</span>
        </label>
      </div>

      {/* Sort Options */}
      <div className="mb-6">
        <label htmlFor="sort-filter" className="block text-sm font-medium text-gray-700 mb-2">
          Sort By
        </label>
        <select
          id="sort-filter"
          value={filters.sortBy || 'newest'}
          onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          aria-label="Sort traits by"
        >
          <option value="newest">Newest First</option>
          <option value="rating">Highest Rated</option>
          <option value="price">Lowest Price</option>
          <option value="popularity">Most Popular</option>
        </select>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full"
        onClick={() => {
          setFilters({
            search: '',
            category: undefined,
            minRating: undefined,
            maxPrice: undefined,
            verified: undefined,
            available: true,
            sortBy: 'newest',
            sortOrder: 'desc'
          });
        }}
      >
        Clear Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Browse Personality Traits</h1>
            <p className="text-gray-600 mt-1">
              Discover and rent personality traits from verified providers
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            >
              {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-2xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Search traits, providers, or skills..."
            value={filters.search || ''}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          />
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${pagination.total} traits found`}
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <FilterPanel />
          </div>

          {/* Traits Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded mb-2"></div>
                    <div className="h-16 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded"></div>
                  </div>
                ))}
              </div>
            ) : traits.length > 0 ? (
              <>
                <div className={`
                  ${viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-4'
                  }
                `}>
                  {traits.map((trait) => (
                    <TraitCard key={trait.id} trait={trait} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasPrevPage}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={!pagination.hasNextPage}
                      onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No traits found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search criteria or filters
                </p>
                <Button
                  variant="primary"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.location.href = '/traits/create';
                    }
                  }}
                >
                  List Your Trait
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TraitsBrowsePage;
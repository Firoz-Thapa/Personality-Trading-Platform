'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { 
  Search, 
  Filter, 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  ArrowUpDown,
  Grid,
  List
} from 'lucide-react';
import { PersonalityTrait, TraitCategory } from '@/lib/types';
import { api } from '@/lib/api/client';
import { formatCurrency, cn } from '@/lib/utils';

// Define proper interfaces for filters and API responses
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

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters?: TraitFilters;
}

const TraitsBrowsePage: React.FC = () => {
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  
  // Filters
  const [filters, setFilters] = useState<TraitFilters>({
    search: '',
    category: undefined,
    minRating: undefined,
    maxPrice: undefined,
    verified: undefined,
    available: true,
    sortBy: 'newest',
    sortOrder: 'desc',
  });
  
  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/traits/meta/categories');
        if (response.success) {
          setCategories(response.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch traits when filters or page changes
  useEffect(() => {
    fetchTraits();
  }, [filters, currentPage]);

  const fetchTraits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      queryParams.append('page', currentPage.toString());
      queryParams.append('limit', '12');
      
      // Add filters to query
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '' && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await api.get<PersonalityTrait[]>(`/traits?${queryParams.toString()}`);
      
      if (response.success) {
        setTraits(response.data || []);
        setTotalPages(response.pagination?.totalPages || 1);
        setTotal(response.pagination?.total || 0);
      } else {
        setError(response.message || 'Failed to fetch traits');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch traits');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof TraitFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSearch = (searchTerm: string) => {
    handleFilterChange('search', searchTerm);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: undefined,
      minRating: undefined,
      maxPrice: undefined,
      verified: undefined,
      available: true,
      sortBy: 'newest',
      sortOrder: 'desc',
    });
    setCurrentPage(1);
  };

  const getCategoryIcon = (category: TraitCategory) => {
    // You can customize these icons based on your design
    return '🧠';
  };

  const getCategoryColor = (category: TraitCategory) => {
    const colors = {
      [TraitCategory.CONFIDENCE]: 'bg-blue-100 text-blue-800',
      [TraitCategory.COMMUNICATION]: 'bg-green-100 text-green-800',
      [TraitCategory.LEADERSHIP]: 'bg-purple-100 text-purple-800',
      [TraitCategory.CREATIVITY]: 'bg-yellow-100 text-yellow-800',
      [TraitCategory.EMPATHY]: 'bg-pink-100 text-pink-800',
      [TraitCategory.HUMOR]: 'bg-orange-100 text-orange-800',
      [TraitCategory.ASSERTIVENESS]: 'bg-red-100 text-red-800',
      [TraitCategory.CHARISMA]: 'bg-indigo-100 text-indigo-800',
      [TraitCategory.PATIENCE]: 'bg-teal-100 text-teal-800',
      [TraitCategory.NEGOTIATION]: 'bg-gray-100 text-gray-800',
      [TraitCategory.PUBLIC_SPEAKING]: 'bg-cyan-100 text-cyan-800',
      [TraitCategory.OTHER]: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const TraitCard: React.FC<{ trait: PersonalityTrait }> = ({ trait }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{getCategoryIcon(trait.category)}</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(trait.category)}`}>
              {trait.category.replace(/_/g, ' ')}
            </span>
          </div>
          {trait.verified && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
        </div>

        {/* Trait Info */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {trait.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {trait.description}
        </p>

        {/* Provider Info */}
        <div className="flex items-center space-x-2 mb-4">
          {trait.owner?.avatar ? (
            <img
              src={trait.owner.avatar}
              alt={`${trait.owner.firstName} ${trait.owner.lastName}`}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {trait.owner?.firstName?.[0]}{trait.owner?.lastName?.[0]}
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
        <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span>{trait.averageRating.toFixed(1)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{trait.totalRentals} rentals</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{trait.successRate}% success</span>
          </div>
        </div>

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-lg font-bold text-gray-900">
              {formatCurrency(trait.hourlyRate)}/hr
            </p>
            {trait.dailyRate && (
              <p className="text-sm text-gray-500">
                {formatCurrency(trait.dailyRate)}/day
              </p>
            )}
          </div>
          
          <Link href={`/traits/${trait.id}`}>
            <Button variant="primary" size="sm">
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover Personality Traits</h1>
            <p className="text-gray-600 mt-1">
              Find and rent the perfect personality traits to enhance your personal and professional life
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
            
            <Link href="/traits/create">
              <Button variant="primary">
                List Your Trait
              </Button>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {/* Search Bar */}
          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search traits, skills, or providers..."
                value={filters.search || ''}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select a category"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (per hour)</label>
                  <input
                    type="number"
                    placeholder="$100"
                    value={filters.maxPrice ? filters.maxPrice / 100 : ''}
                    onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) * 100 : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                  <select
                    value={filters.minRating || ''}
                    onChange={(e) => handleFilterChange('minRating', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select minimum rating"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>

                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-') as [
                        'newest' | 'rating' | 'price' | 'popularity',
                        'asc' | 'desc'
                      ];
                      handleFilterChange('sortBy', sortBy);
                      handleFilterChange('sortOrder', sortOrder);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    title="Select sort option"
                  >
                    <option value="newest-desc">Newest First</option>
                    <option value="rating-desc">Highest Rated</option>
                    <option value="price-asc">Lowest Price</option>
                    <option value="price-desc">Highest Price</option>
                    <option value="popularity-desc">Most Popular</option>
                  </select>
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.verified || false}
                      onChange={(e) => handleFilterChange('verified', e.target.checked || undefined)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Verified providers only</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.available !== false}
                      onChange={(e) => handleFilterChange('available', e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Available only</span>
                  </label>
                </div>
                
                <Button variant="outline" size="sm" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <p>
            Showing {traits.length} of {total} traits
            {filters.search && ` for "${filters.search}"`}
          </p>
          <p>
            Page {currentPage} of {totalPages}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Traits Grid */}
        {!loading && !error && (
          <>
            {traits.length > 0 ? (
              <div className={cn(
                'grid gap-6',
                viewMode === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              )}>
                {traits.map((trait) => (
                  <TraitCard key={trait.id} trait={trait} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No traits found matching your criteria</p>
                <Button variant="outline" onClick={clearFilters} className="mt-4">
                  Clear Filters
                </Button>
              </div>
            )}
          </>
        )}

        {/* Pagination */}
        {!loading && traits.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Previous
            </Button>
            
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
            
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default TraitsBrowsePage;
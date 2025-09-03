'use client';

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
  List,
  Heart,
  TrendingUp,
  Award,
  Sparkles
} from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { PersonalityTrait, TraitCategory } from '@/lib/types';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';

const TraitCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">

      <div className="h-2 bg-gray-200"></div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-6 bg-gray-200 rounded-full w-24"></div>
          <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
        </div>

        <div className="h-6 bg-gray-200 rounded mb-3 w-3/4"></div>

        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>

        <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-xl">
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="text-center">
              <div className="h-6 bg-gray-200 rounded w-12 mx-auto mb-1"></div>
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-8 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="text-right">
            <div className="h-3 bg-gray-200 rounded w-12 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>

        <div className="h-12 bg-gray-200 rounded-xl w-full mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mx-auto"></div>
      </div>
    </div>
  );
};

const ModernizedTraitsBrowsePage: React.FC = () => {
  const [traits, setTraits] = useState<PersonalityTrait[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState('newest');

  // Mock data for demonstration
  useEffect(() => {
    const mockTraits: PersonalityTrait[] = [
      {
        id: '1',
        ownerId: '1',
        owner: {
          id: '1',
          email: 'sarah@example.com',
          username: 'sarahwilson',
          firstName: 'Sarah',
          lastName: 'Wilson',
          verified: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        name: 'Executive Presence & Leadership',
        description: 'Develop commanding presence in boardrooms and high-stakes meetings. Learn to communicate with authority while maintaining approachability.',
        category: TraitCategory.LEADERSHIP,
        hourlyRate: 8500,
        dailyRate: 60000,
        available: true,
        maxUsers: 2,
        successRate: 96,
        totalRentals: 128,
        averageRating: 4.9,
        verified: true,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        ownerId: '2',
        owner: {
          id: '2',
          email: 'marcus@example.com',
          username: 'marcuschen',
          firstName: 'Marcus',
          lastName: 'Chen',
          verified: true,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        name: 'Authentic Charisma',
        description: 'Master the art of genuine charm and magnetic personality. Learn to connect deeply with others while staying true to yourself.',
        category: TraitCategory.CHARISMA,
        hourlyRate: 7200,
        dailyRate: 50000,
        available: true,
        maxUsers: 3,
        successRate: 94,
        totalRentals: 89,
        averageRating: 4.8,
        verified: true,
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-14T14:20:00Z'
      },
      {
        id: '3',
        ownerId: '3',
        owner: {
          id: '3',
          email: 'alex@example.com',
          username: 'alexrivera',
          firstName: 'Alex',
          lastName: 'Rivera',
          verified: false,
          createdAt: '2024-01-01T00:00:00Z',
          updatedAt: '2024-01-01T00:00:00Z'
        },
        name: 'Confident Public Speaking',
        description: 'Transform your public speaking anxiety into powerful, engaging presentations that captivate any audience.',
        category: TraitCategory.CONFIDENCE,
        hourlyRate: 6500,
        available: true,
        maxUsers: 5,
        successRate: 92,
        totalRentals: 67,
        averageRating: 4.7,
        verified: true,
        createdAt: '2024-01-13T09:15:00Z',
        updatedAt: '2024-01-13T09:15:00Z'
      }
    ];
    
    setTimeout(() => {
      setTraits(mockTraits);
      setLoading(false);
    }, 1000);
  }, []);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'CONFIDENCE': 'from-blue-500 to-blue-600',
      'COMMUNICATION': 'from-green-500 to-green-600',
      'LEADERSHIP': 'from-purple-500 to-purple-600',
      'CREATIVITY': 'from-yellow-500 to-orange-500',
      'EMPATHY': 'from-pink-500 to-rose-600',
      'HUMOR': 'from-orange-500 to-red-500',
      'ASSERTIVENESS': 'from-red-500 to-red-600',
      'CHARISMA': 'from-indigo-500 to-purple-600',
      'PATIENCE': 'from-teal-500 to-teal-600',
      'NEGOTIATION': 'from-gray-500 to-gray-600',
      'PUBLIC_SPEAKING': 'from-cyan-500 to-blue-600',
      'OTHER': 'from-gray-400 to-gray-500',
    };
    return colors[category] || 'from-gray-400 to-gray-500';
  };

  const getCategoryBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      'CONFIDENCE': 'bg-blue-50 text-blue-700 border-blue-200',
      'COMMUNICATION': 'bg-green-50 text-green-700 border-green-200',
      'LEADERSHIP': 'bg-purple-50 text-purple-700 border-purple-200',
      'CREATIVITY': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'EMPATHY': 'bg-pink-50 text-pink-700 border-pink-200',
      'HUMOR': 'bg-orange-50 text-orange-700 border-orange-200',
      'ASSERTIVENESS': 'bg-red-50 text-red-700 border-red-200',
      'CHARISMA': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'PATIENCE': 'bg-teal-50 text-teal-700 border-teal-200',
      'NEGOTIATION': 'bg-gray-50 text-gray-700 border-gray-200',
      'PUBLIC_SPEAKING': 'bg-cyan-50 text-cyan-700 border-cyan-200',
      'OTHER': 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return colors[category] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const TraitCard: React.FC<{ trait: PersonalityTrait }> = ({ trait }) => {
    return (
      <div className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${getCategoryColor(trait.category)}`}></div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getCategoryBadgeColor(trait.category)}`}>
              <Sparkles className="h-3 w-3 mr-1" />
              {trait.category.replace(/_/g, ' ')}
            </span>
            <div className="flex items-center space-x-2">
              {trait.verified && (
                <div className="relative group">
                  <CheckCircle className="h-5 w-5 text-emerald-500" />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Verified Provider
                  </div>
                </div>
              )}
              <button 
                className="text-gray-400 hover:text-red-500 transition-colors"
                title="Save to favorites"
                aria-label="Save trait to favorites"
              >
                <Heart className="h-5 w-5" />
              </button>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {trait.name}
          </h3>

          <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
            {trait.description}
          </p>

          <div className="flex items-center space-x-3 mb-6 p-3 bg-gray-50 rounded-xl">
            {trait.owner?.avatar ? (
              <img
                src={trait.owner.avatar}
                alt={`${trait.owner.firstName} ${trait.owner.lastName}`}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-white"
              />
            ) : (
              <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                {getInitials(trait.owner?.firstName || '', trait.owner?.lastName || '')}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {trait.owner?.firstName} {trait.owner?.lastName}
              </p>
              <p className="text-xs text-gray-500 truncate">@{trait.owner?.username}</p>
            </div>
            {trait.owner?.verified && (
              <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-bold text-gray-900">{trait.averageRating.toFixed(1)}</span>
              </div>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-bold text-gray-900">{trait.totalRentals}</span>
              </div>
              <p className="text-xs text-gray-500">Students</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center space-x-1 mb-1">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-sm font-bold text-gray-900">{trait.successRate}%</span>
              </div>
              <p className="text-xs text-gray-500">Success</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-2xl font-bold text-gray-900">
                {formatCurrency(trait.hourlyRate)}
              </span>
              <span className="text-sm text-gray-500 ml-1">/hour</span>
              {trait.dailyRate && (
                <div className="text-sm text-gray-600 mt-1">
                  {formatCurrency(trait.dailyRate)}/day
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-500 mb-1">Listed</div>
              <div className="text-xs text-gray-600">
                {formatRelativeTime(trait.createdAt)}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              variant="primary"
              size="md"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
              onClick={() => {
                if (typeof window !== 'undefined') {
                  window.location.href = `/traits/${trait.id}`;
                }
              }}
            >
              View Details & Book
            </Button>
            
            {trait.available ? (
              <div className="flex items-center justify-center text-xs text-green-600 font-medium">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                Available for {trait.maxUsers} student{trait.maxUsers !== 1 ? 's' : ''}
              </div>
            ) : (
              <div className="flex items-center justify-center text-xs text-red-600 font-medium">
                <div className="h-2 w-2 bg-red-500 rounded-full mr-2"></div>
                Currently Unavailable
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const FilterSidebar = () => (
    <div className={`
      ${showFilters ? 'block' : 'hidden'} lg:block
      bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit sticky top-6
    `}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        <Filter className="h-5 w-5 text-gray-400" />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
          aria-label="Filter by trait category"
          title="Select a trait category to filter results"
        >
          <option value="">All Categories</option>
          {Object.values(TraitCategory).map(category => (
            <option key={category} value={category}>
              {category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Quick Filters
        </label>
        <div className="space-y-3">
          <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="ml-3 text-sm text-gray-700">Verified providers only</span>
          </label>
          <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="ml-3 text-sm text-gray-700">Available now</span>
          </label>
          <label className="flex items-center p-3 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer">
            <input type="checkbox" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
            <span className="ml-3 text-sm text-gray-700">High success rate (90%+)</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          Max Price (per hour)
        </label>
        <Input
          type="number"
          placeholder="$100"
          className="bg-gray-50 border-gray-200 focus:bg-white"
        />
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full border-gray-200 hover:border-gray-300"
        onClick={() => {
          setSelectedCategory('');
          setSearchQuery('');
        }}
      >
        Clear All Filters
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 border border-gray-100">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Discover Personality Traits
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Transform yourself with expert-guided personality development from verified providers
                </p>
                <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                  <div className="flex items-center space-x-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    <span>500+ Verified Traits</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-green-500" />
                    <span>10,000+ Students</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>4.9 Avg Rating</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                  className="border-gray-200 hover:border-gray-300"
                >
                  {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden border-gray-200 hover:border-gray-300"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>
            </div>
          </div>
          
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-blue-100 rounded-full opacity-20"></div>
          <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-purple-100 rounded-full opacity-20"></div>
        </div>

        <div className="relative max-w-3xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search for confidence, leadership, charisma, or any skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-6 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all"
            />
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
              aria-label="Sort traits by different criteria"
              title="Choose how to sort the trait results"
            >
              <option value="newest">Newest First</option>
              <option value="rating">Highest Rated</option>
              <option value="price">Lowest Price</option>
              <option value="popularity">Most Popular</option>
            </select>
          </div>
          
          <p className="text-sm text-gray-600">
            {loading ? 'Loading...' : `${traits.length} traits available`}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterSidebar />
          </div>

          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <TraitCardSkeleton key={i} />
                ))}
              </div>
            ) : traits.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {traits.map((trait) => (
                  <TraitCard key={trait.id} trait={trait} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-6">
                  <Search className="h-16 w-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No traits found</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                  Try adjusting your search criteria or explore different categories to find the perfect trait for you.
                </p>
                <Button
                  variant="primary"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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

export default ModernizedTraitsBrowsePage;
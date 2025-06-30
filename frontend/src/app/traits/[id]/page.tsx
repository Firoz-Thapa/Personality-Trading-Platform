'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  Heart,
  Share2,
  MessageCircle,
  Calendar,
  DollarSign
} from 'lucide-react';
import { PersonalityTrait } from '@/lib/types';
import { api } from '@/lib/api/client';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';
import { withAuth } from '@/lib/contexts/AuthContext';

const TraitDetailPage: React.FC = () => {
  const params = useParams();
  const traitId = params.id as string;
  
  const [trait, setTrait] = useState<PersonalityTrait | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (traitId) {
      fetchTrait();
    }
  }, [traitId]);

  const fetchTrait = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get<PersonalityTrait>(`/traits/${traitId}`);
      
      if (response.success && response.data) {
        setTrait(response.data);
      } else {
        setError('Trait not found');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load trait');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !trait) {
    return (
      <Layout>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trait Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The trait you\'re looking for doesn\'t exist.'}</p>
          <Button variant="primary" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </div>
      </Layout>
    );
  }

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
    <Layout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-4">
                <span className="text-3xl">🧠</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(trait.category)}`}>
                  {trait.category.replace(/_/g, ' ')}
                </span>
                {trait.verified && (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
              </div>
              
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{trait.name}</h1>
              <p className="text-lg text-gray-600 leading-relaxed">{trait.description}</p>
            </div>
            
            <div className="flex items-center space-x-3 ml-8">
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center space-x-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{trait.averageRating.toFixed(1)}</span>
              <span>({trait.totalRentals} reviews)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>{trait.totalRentals} rentals</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>{trait.successRate}% success rate</span>
            </div>
            <div className="text-gray-400">
              Listed {formatRelativeTime(trait.createdAt)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Provider Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Meet Your Provider</h2>
              
              <div className="flex items-start space-x-4">
                {trait.owner?.avatar ? (
                  <img
                    src={trait.owner.avatar}
                    alt={`${trait.owner.firstName} ${trait.owner.lastName}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {getInitials(trait.owner?.firstName || '', trait.owner?.lastName || '')}
                  </div>
                )}
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {trait.owner?.firstName} {trait.owner?.lastName}
                    </h3>
                    {trait.owner?.verified && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <p className="text-gray-600 mb-3">@{trait.owner?.username}</p>
                  {trait.owner?.bio && (
                    <p className="text-gray-700">{trait.owner.bio}</p>
                  )}
                </div>
                
                <Button variant="outline">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              </div>
            </div>

            {/* What You'll Learn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What You'll Develop</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  This {trait.category.toLowerCase().replace(/_/g, ' ')} trait will help you develop essential skills 
                  through personalized coaching sessions. You'll practice real-world scenarios and receive 
                  AI-powered feedback to accelerate your growth.
                </p>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Reviews</h2>
              <div className="text-center py-8 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Reviews will be available here once the feature is implemented.</p>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  {formatCurrency(trait.hourlyRate)}<span className="text-lg font-normal text-gray-600">/hour</span>
                </div>
                {trait.dailyRate && (
                  <div className="text-lg text-gray-700">
                    {formatCurrency(trait.dailyRate)}<span className="text-sm text-gray-600">/day</span>
                  </div>
                )}
                {trait.weeklyRate && (
                  <div className="text-lg text-gray-700">
                    {formatCurrency(trait.weeklyRate)}<span className="text-sm text-gray-600">/week</span>
                  </div>
                )}
              </div>

              {trait.available ? (
                <div className="space-y-4">
                  <Button variant="primary" size="lg" className="w-full">
                    <Calendar className="h-5 w-5 mr-2" />
                    Book Session
                  </Button>
                  
                  <Button variant="outline" size="lg" className="w-full">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Rent Trait
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Available for up to {trait.maxUsers} user{trait.maxUsers !== 1 ? 's' : ''}
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Button variant="secondary" size="lg" className="w-full" disabled>
                    Currently Unavailable
                  </Button>
                  <p className="text-sm text-gray-600 mt-2">
                    This trait is not available for booking right now.
                  </p>
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    AI-powered coaching sessions
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Real-time feedback
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Progress tracking
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    Practice scenarios
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(TraitDetailPage);
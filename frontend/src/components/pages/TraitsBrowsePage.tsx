import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Clock, 
  Users, 
  CheckCircle,
  Heart,
  Share2,
  Eye,
  Calendar,
  MessageCircle,
  Bookmark,
  BookmarkCheck
} from 'lucide-react';
import { PersonalityTrait } from '@/lib/types';
import { formatCurrency, formatRelativeTime, getInitials } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface EnhancedTraitCardProps {
  trait: PersonalityTrait;
  onSave?: (traitId: string) => void;
  onShare?: (trait: PersonalityTrait) => void;
  isSaved?: boolean;
}

const EnhancedTraitCard: React.FC<EnhancedTraitCardProps> = ({ 
  trait, 
  onSave,
  onShare,
  isSaved = false
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickPreview, setShowQuickPreview] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'CONFIDENCE': 'bg-blue-100 text-blue-800 border-blue-200',
      'COMMUNICATION': 'bg-green-100 text-green-800 border-green-200',
      'LEADERSHIP': 'bg-purple-100 text-purple-800 border-purple-200',
      'CREATIVITY': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'EMPATHY': 'bg-pink-100 text-pink-800 border-pink-200',
      'HUMOR': 'bg-orange-100 text-orange-800 border-orange-200',
      'ASSERTIVENESS': 'bg-red-100 text-red-800 border-red-200',
      'CHARISMA': 'bg-indigo-100 text-indigo-800 border-indigo-200',
      'PATIENCE': 'bg-teal-100 text-teal-800 border-teal-200',
      'NEGOTIATION': 'bg-gray-100 text-gray-800 border-gray-200',
      'PUBLIC_SPEAKING': 'bg-cyan-100 text-cyan-800 border-cyan-200',
      'OTHER': 'bg-gray-100 text-gray-800 border-gray-200',
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      'CONFIDENCE': '💪',
      'COMMUNICATION': '💬',
      'LEADERSHIP': '👑',
      'CREATIVITY': '🎨',
      'EMPATHY': '❤️',
      'HUMOR': '😄',
      'ASSERTIVENESS': '⚡',
      'CHARISMA': '✨',
      'PATIENCE': '🧘',
      'NEGOTIATION': '🤝',
      'PUBLIC_SPEAKING': '🎤',
      'OTHER': '🧠',
    };
    return icons[category] || '🧠';
  };

  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onSave?.(trait.id);
  };

  const handleShareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onShare?.(trait);
  };

  const handleQuickPreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowQuickPreview(!showQuickPreview);
  };

  return (
    <div 
      className={`
        relative bg-white rounded-xl shadow-sm border border-gray-200 
        transition-all duration-300 ease-out
        ${isHovered ? 'shadow-lg transform -translate-y-1 border-blue-200' : ''}
        hover:shadow-lg hover:transform hover:-translate-y-1 hover:border-blue-200
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Actions Overlay */}
      <div className={`
        absolute top-3 right-3 flex items-center space-x-2 z-10
        transition-all duration-300
        ${isHovered ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform -translate-y-2'}
      `}>
        <button
          onClick={handleSaveClick}
          className={`
            p-2 rounded-full transition-all duration-200
            ${isSaved 
              ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
              : 'bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-gray-100 hover:text-blue-600'
            }
            shadow-sm border border-gray-200
          `}
          title={isSaved ? 'Remove from saved' : 'Save for later'}
        >
          {isSaved ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
        
        <button
          onClick={handleShareClick}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-gray-100 hover:text-green-600 transition-all duration-200 shadow-sm border border-gray-200"
          title="Share trait"
        >
          <Share2 className="h-4 w-4" />
        </button>
        
        <button
          onClick={handleQuickPreview}
          className="p-2 rounded-full bg-white/90 backdrop-blur-sm text-gray-600 hover:bg-gray-100 hover:text-purple-600 transition-all duration-200 shadow-sm border border-gray-200"
          title="Quick preview"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-blue-50 to-indigo-100">
              <span className="text-lg">{getCategoryIcon(trait.category)}</span>
            </div>
            <div>
              <span className={`
                px-3 py-1 rounded-full text-xs font-medium border
                ${getCategoryColor(trait.category)}
              `}>
                {trait.category.replace(/_/g, ' ')}
              </span>
              {trait.verified && (
                <div className="flex items-center mt-1">
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-xs text-green-600 font-medium">Verified</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Availability indicator */}
          <div className={`
            px-2 py-1 rounded-full text-xs font-medium
            ${trait.available 
              ? 'bg-green-100 text-green-800 border border-green-200' 
              : 'bg-red-100 text-red-800 border border-red-200'
            }
          `}>
            {trait.available ? 'Available' : 'Busy'}
          </div>
        </div>

        {/* Trait Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 leading-tight">
            {trait.name}
          </h3>
          <p className={`
            text-gray-600 text-sm leading-relaxed
            ${showQuickPreview ? 'line-clamp-none' : 'line-clamp-2'}
            transition-all duration-300
          `}>
            {trait.description}
          </p>
          {!showQuickPreview && trait.description.length > 120 && (
            <button
              onClick={handleQuickPreview}
              className="text-blue-600 text-xs hover:text-blue-700 mt-1"
            >
              Read more...
            </button>
          )}
        </div>

        {/* Provider Info */}
        <div className="flex items-center space-x-3 mb-4 p-3 bg-gray-50 rounded-lg">
          {trait.owner?.avatar ? (
            <img
              src={trait.owner.avatar}
              alt={`${trait.owner.firstName} ${trait.owner.lastName}`}
              className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-sm">
              {getInitials(trait.owner?.firstName || '', trait.owner?.lastName || '')}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <p className="text-sm font-medium text-gray-900 truncate">
                {trait.owner?.firstName} {trait.owner?.lastName}
              </p>
              {trait.owner?.verified && (
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
              )}
            </div>
            <p className="text-xs text-gray-500">@{trait.owner?.username}</p>
          </div>
          <button
            className="text-blue-600 hover:text-blue-700 transition-colors"
            title="Send message"
          >
            <MessageCircle className="h-4 w-4" />
          </button>
        </div>

        {/* Enhanced Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center p-2 bg-yellow-50 rounded-lg border border-yellow-100">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Star className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-bold text-gray-900">{trait.averageRating.toFixed(1)}</span>
            </div>
            <span className="text-xs text-gray-600">Rating</span>
          </div>
          
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-bold text-gray-900">{trait.totalRentals}</span>
            </div>
            <span className="text-xs text-gray-600">Rentals</span>
          </div>
          
          <div className="text-center p-2 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Clock className="h-4 w-4 text-green-500" />
              <span className="text-sm font-bold text-gray-900">{trait.successRate}%</span>
            </div>
            <span className="text-xs text-gray-600">Success</span>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg mb-4 border border-blue-100">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(trait.hourlyRate)}
                <span className="text-sm font-normal text-gray-600">/hr</span>
              </p>
              {trait.dailyRate && (
                <p className="text-sm text-gray-600">
                  {formatCurrency(trait.dailyRate)}/day
                </p>
              )}
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500 mb-1">Max {trait.maxUsers} users</p>
              <p className="text-xs text-gray-500">
                Listed {formatRelativeTime(trait.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <Link href={`/traits/${trait.id}`} className="flex-1">
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full group"
            >
              <Eye className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              View Details
            </Button>
          </Link>
          
          {trait.available && (
            <button
              className="px-3 py-2 border-2 border-gray-300 hover:border-green-300 bg-transparent hover:bg-green-50 text-gray-700 hover:text-green-700 font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-gray-500 group"
              title="Quick book"
            >
              <Calendar className="h-4 w-4 group-hover:scale-110 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* Hover overlay effect */}
      <div className={`
        absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-xl
        transition-opacity duration-300 pointer-events-none
        ${isHovered ? 'opacity-100' : 'opacity-0'}
      `} />
    </div>
  );
};

export default EnhancedTraitCard;
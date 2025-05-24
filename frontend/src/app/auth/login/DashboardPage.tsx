import React, { useEffect, useState } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { 
  TrendingUp, 
  Users, 
  Star, 
  DollarSign, 
  Brain,
  Clock,
  Award,
  ArrowRight,
  Plus
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';

interface DashboardStats {
  totalTraitsOffered: number;
  totalTraitsRented: number;
  totalEarnings: number;
  totalSpent: number;
  averageRating: number;
  activeRentals: number;
  completedSessions: number;
  improvementScore: number;
}

interface RecentActivity {
  id: string;
  type: 'rental' | 'session' | 'review' | 'trait_created';
  title: string;
  description: string;
  timestamp: string;
  avatar?: string;
  rating?: number;
}

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalTraitsOffered: 0,
    totalTraitsRented: 0,
    totalEarnings: 0,
    totalSpent: 0,
    averageRating: 0,
    activeRentals: 0,
    completedSessions: 0,
    improvementScore: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API calls
    const fetchDashboardData = async () => {
      try {
        // Simulated data - replace with actual API calls
        setStats({
          totalTraitsOffered: 3,
          totalTraitsRented: 7,
          totalEarnings: 24500, // in cents
          totalSpent: 18200, // in cents
          averageRating: 4.8,
          activeRentals: 2,
          completedSessions: 15,
          improvementScore: 82,
        });

        setRecentActivity([
          {
            id: '1',
            type: 'rental',
            title: 'New trait rental',
            description: 'Sarah M. rented your "Public Speaking Confidence"',
            timestamp: '2024-05-24T10:30:00Z',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          },
          {
            id: '2',
            type: 'session',
            title: 'Coaching session completed',
            description: 'Completed "Assertiveness Training" with John D.',
            timestamp: '2024-05-23T16:45:00Z',
          },
          {
            id: '3',
            type: 'review',
            title: 'New 5-star review',
            description: 'Alex gave you 5 stars for "Leadership Presence"',
            timestamp: '2024-05-23T14:20:00Z',
            rating: 5,
          },
          {
            id: '4',
            type: 'trait_created',
            title: 'New trait published',
            description: 'Your "Creative Problem Solving" trait is now live',
            timestamp: '2024-05-22T09:15:00Z',
          },
        ]);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const StatCard: React.FC<{
    title: string;
    value: string;
    icon: React.ReactNode;
    change?: string;
    changeType?: 'positive' | 'negative' | 'neutral';
  }> = ({ title, value, icon, change, changeType = 'neutral' }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 flex items-center ${
              changeType === 'positive' ? 'text-green-600' : 
              changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
            }`}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {change}
            </p>
          )}
        </div>
        <div className="text-blue-600">
          {icon}
        </div>
      </div>
    </div>
  );

  const ActivityItem: React.FC<{ activity: RecentActivity }> = ({ activity }) => {
    const getActivityIcon = () => {
      switch (activity.type) {
        case 'rental':
          return <Users className="h-4 w-4 text-blue-600" />;
        case 'session':
          return <Clock className="h-4 w-4 text-green-600" />;
        case 'review':
          return <Star className="h-4 w-4 text-yellow-600" />;
        case 'trait_created':
          return <Brain className="h-4 w-4 text-purple-600" />;
        default:
          return <Brain className="h-4 w-4 text-gray-600" />;
      }
    };

    return (
      <div className="flex items-start space-x-3 p-4 hover:bg-gray-50 rounded-lg transition-colors">
        <div className="flex-shrink-0">
          {activity.avatar ? (
            <img
              src={activity.avatar}
              alt=""
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              {getActivityIcon()}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{activity.title}</p>
          <p className="text-sm text-gray-600">{activity.description}</p>
          <div className="flex items-center mt-1">
            <p className="text-xs text-gray-500">
              {formatRelativeTime(activity.timestamp)}
            </p>
            {activity.rating && (
              <div className="flex items-center ml-2">
                {[...Array(activity.rating)].map((_, i) => (
                  <Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
          <div className="h-96 bg-gray-200 rounded-xl"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-gray-600 mt-1">
              Here's what's happening with your personality traits today.
            </p>
          </div>
          <div className="flex space-x-3">
            <Link href="/traits/create">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Trait
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Traits Offered"
            value={stats.totalTraitsOffered.toString()}
            icon={<Brain className="h-6 w-6" />}
            change="+2 this month"
            changeType="positive"
          />
          <StatCard
            title="Total Earnings"
            value={formatCurrency(stats.totalEarnings)}
            icon={<DollarSign className="h-6 w-6" />}
            change="+$45 this week"
            changeType="positive"
          />
          <StatCard
            title="Average Rating"
            value={stats.averageRating.toFixed(1)}
            icon={<Star className="h-6 w-6" />}
            change="Excellent!"
            changeType="positive"
          />
          <StatCard
            title="Active Rentals"
            value={stats.activeRentals.toString()}
            icon={<Users className="h-6 w-6" />}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                  <Link href="/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View all
                  </Link>
                </div>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivity.map((activity) => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/traits/browse">
                  <Button variant="outline" className="w-full justify-between">
                    Browse Traits
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/coaching">
                  <Button variant="outline" className="w-full justify-between">
                    Start Coaching
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/analytics">
                  <Button variant="outline" className="w-full justify-between">
                    View Analytics
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Progress Card */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Your Progress</h3>
                <Award className="h-6 w-6" />
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Improvement Score</span>
                    <span>{stats.improvementScore}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-2">
                    <div
                      className="bg-white rounded-full h-2 transition-all duration-500"
                      style={{ width: `${stats.improvementScore}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm opacity-90">
                  You're in the top 15% of users! Keep up the great work.
                </p>
                <Link href="/profile/growth">
                  <Button variant="ghost" size="sm" className="text-white border-white/30 hover:bg-white/10">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">5-Star Provider</p>
                    <p className="text-xs text-gray-600">Maintained 5.0 rating</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Popular Mentor</p>
                    <p className="text-xs text-gray-600">10+ successful rentals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DashboardPage);
'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, withAuth } from '@/lib/contexts/AuthContext';
import Layout from '@/components/layout/Layout';
import { 
  Clock, 
  Calendar, 
  TrendingUp, 
  Users, 
  Star, 
  DollarSign,
  BookOpen,
  Target,
  Award,
  Activity,
  ChevronRight,
  Brain,
  Zap
} from 'lucide-react';

// Disable SSR for this page
export const dynamic = 'force-dynamic';

const LiveClock: React.FC = () => {
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
      hour12: true,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeOfDayGreeting = (): string => {
    const hour = time.getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl p-8 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">
              {getTimeOfDayGreeting()}, {user?.firstName || 'Welcome'}!
            </h2>
            <p className="text-blue-100">
              Ready to develop some amazing personality traits today?
            </p>
          </div>
          <Clock className="h-8 w-8 text-blue-200" />
        </div>
        
        <div className="space-y-4">
          {/* Live Time Display */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-mono font-bold mb-2 tracking-wider">
                {formatTime(time)}
              </div>
              <div className="text-lg text-blue-100">
                {formatDate(time)}
              </div>
            </div>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">7</div>
                <div className="text-sm text-blue-100">Traits Mastered</div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
              <div className="text-center">
                <div className="text-2xl font-bold">23</div>
                <div className="text-sm text-blue-100">Days Streak</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  icon: React.ComponentType<any>;
  title: string;
  value: string;
  change?: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, title, value, change, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    orange: "from-orange-500 to-orange-600"
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} text-white transition-transform duration-300 group-hover:scale-105`}>
          <Icon className="h-6 w-6" />
        </div>
        {change && (
          <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
            {change}
          </span>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl font-bold text-gray-900 transition-colors duration-300 group-hover:text-gray-700">{value}</p>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  time: string;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const ActivityItem: React.FC<ActivityItemProps> = ({ icon: Icon, title, description, time, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600",
    green: "bg-green-100 text-green-600",
    purple: "bg-purple-100 text-purple-600",
    orange: "bg-orange-100 text-orange-600"
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-gray-50 rounded-xl transition-colors">
      <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">{title}</p>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
      </div>
      <div className="text-xs text-gray-500">{time}</div>
    </div>
  );
};

interface QuickActionCardProps {
  icon: React.ComponentType<any>;
  title: string;
  description: string;
  onClick: () => void;
  color?: 'blue' | 'green' | 'purple' | 'orange';
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({ icon: Icon, title, description, onClick, color = "blue" }) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
  };

  return (
    <button
      onClick={onClick}
      className={`w-full p-6 bg-gradient-to-br ${colorClasses[color]} text-white rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 text-left group`}
    >
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8" />
        <ChevronRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  );
};

const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  const recentActivities = [
    {
      icon: BookOpen,
      title: "Completed Confidence Session",
      description: "Mastered public speaking techniques",
      time: "2 hours ago",
      color: "blue" as const
    },
    {
      icon: Star,
      title: "Received 5-Star Review",
      description: "For your Leadership trait coaching",
      time: "4 hours ago",
      color: "orange" as const
    },
    {
      icon: Target,
      title: "Achieved Weekly Goal",
      description: "Completed 5 coaching sessions this week",
      time: "1 day ago",
      color: "green" as const
    },
    {
      icon: Users,
      title: "New Trait Renter",
      description: "Someone rented your Charisma trait",
      time: "2 days ago",
      color: "purple" as const
    }
  ];

  const handleStartSession = () => {
    console.log('Starting new session...');
    // Navigate to session page when implemented
  };

  const handleBrowseTraits = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/traits';
    }
  };

  const handleCreateTrait = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/traits/create';
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
         {/* Header with Live Clock */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <LiveClock />
          </div>
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Today's Focus</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Empathy Session</p>
                  <p className="text-xs text-gray-600">2:00 PM - 3:00 PM</p>
                </div>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl">
                <Target className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Practice Presentation</p>
                  <p className="text-xs text-gray-600">4:30 PM - 5:30 PM</p>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-1 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Quick Stats</h3>
            <div className="space-y-3">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">23</div>
                <div className="text-xs text-gray-500">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">92%</div>
                <div className="text-xs text-gray-500">Success Rate</div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard 
            icon={TrendingUp} 
            title="Confidence Level" 
            value="92%" 
            change="+8%" 
            color="blue"
          />
          <StatCard 
            icon={Users} 
            title="Traits Rented" 
            value="156" 
            change="+12" 
            color="green"
          />
          <StatCard 
            icon={Star} 
            title="Average Rating" 
            value="4.9" 
            change="+0.2" 
            color="orange"
          />
          <StatCard 
            icon={DollarSign} 
            title="Earnings This Month" 
            value="$2,340" 
            change="+$420" 
            color="purple"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
                <Activity className="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div className="p-2">
              {recentActivities.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-4">
                <QuickActionCard
                  icon={BookOpen}
                  title="Start Session"
                  description="Begin a new coaching session"
                  color="blue"
                  onClick={handleStartSession}
                />
                <QuickActionCard
                  icon={Users}
                  title="Browse Traits"
                  description="Discover new personality traits"
                  color="green"
                  onClick={handleBrowseTraits}
                />
                <QuickActionCard
                  icon={Target}
                  title="List Your Trait"
                  description="Share your expertise with others"
                  color="purple"
                  onClick={handleCreateTrait}
                />
              </div>
            </div>

            {/* Achievement Badge */}
            <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-6 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <Award className="h-8 w-8" />
                <div>
                  <h3 className="text-lg font-bold">Achievement Unlocked!</h3>
                  <p className="text-sm opacity-90">Consistency Champion</p>
                </div>
              </div>
              <p className="text-sm opacity-90">
                You've maintained a 23-day learning streak. Keep it up!
              </p>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">How PersonaTrade Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Discover Traits</h4>
              <p className="text-gray-600">Browse our marketplace of personality traits like confidence, charisma, and leadership skills.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Rent & Practice</h4>
              <p className="text-gray-600">Rent traits from experienced providers and practice with AI-powered coaching scenarios.</p>
            </div>
            
            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Transform Yourself</h4>
              <p className="text-gray-600">Track your progress and integrate new traits into your daily interactions and professional life.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(DashboardPage);
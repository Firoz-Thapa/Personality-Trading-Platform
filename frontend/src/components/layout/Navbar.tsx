'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/contexts/AuthContext';
import Button from '@/components/ui/Button';
import { 
  User, 
  Bell, 
  Search, 
  LogOut, 
  Settings, 
  ChevronDown,
  Brain,
  Home,
  Star,
  Plus
} from 'lucide-react';
import { getInitials } from '@/lib/utils';

const Navbar: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
  }, []);

  const isAuthenticated = !!user;

  const handleLogout = () => {
    logout();
    // Use window.location instead of router to avoid SSR issues
    if (typeof window !== 'undefined') {
      window.location.href = '/auth/login';
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && typeof window !== 'undefined') {
      window.location.href = `/traits?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  // Don't render navbar until component is mounted on client
  if (!mounted) {
    return (
      <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="flex items-center space-x-2">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span className="text-xl font-bold text-gray-900">PersonaTrade</span>
                </div>
              </Link>
            </div>
            <div className="animate-pulse flex space-x-4">
              <div className="h-8 w-16 bg-gray-200 rounded"></div>
              <div className="h-8 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and brand */}
          <div className="flex items-center space-x-8">
            <Link href={isAuthenticated ? '/dashboard' : '/'} className="flex items-center">
              <div className="flex items-center space-x-2">
                <Brain className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">PersonaTrade</span>
              </div>
            </Link>

            {/* Navigation Links - only for authenticated users */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-6">
                <Link
                  href="/dashboard"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
                
                <Link
                  href="/traits"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Star className="h-4 w-4 mr-2" />
                  Browse Traits
                </Link>
                
                <Link
                  href="/traits/create"
                  className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List Trait
                </Link>
              </div>
            )}
          </div>

          {/* Search bar - only for authenticated users */}
          {isAuthenticated && (
            <div className="flex-1 max-w-lg mx-8 hidden lg:block">
              <form onSubmit={handleSearch} className="relative">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search personality traits..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </form>
            </div>
          )}

          {/* Right side navigation */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {/* Mobile menu for navigation links */}
                <div className="md:hidden">
                  <Link
                    href="/traits"
                    className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                    title="Browse Traits"
                  >
                    <Star className="h-5 w-5" />
                  </Link>
                </div>

                {/* Notifications */}
                <button className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <Bell className="h-5 w-5" />
                  {/* Notification badge */}
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User menu */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                        {getInitials(user.firstName, user.lastName)}
                      </div>
                    )}
                    <span className="text-sm font-medium text-gray-700 hidden sm:block">
                      {user.firstName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </button>

                  {/* Dropdown menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <Link
                        href="/profile"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      <Link
                        href="/dashboard"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Home className="h-4 w-4 mr-2" />
                        Dashboard
                      </Link>
                      <Link
                        href="/traits"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Browse Traits
                      </Link>
                      <Link
                        href="/traits/create"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 md:hidden"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        List Trait
                      </Link>
                      <Link
                        href="/settings"
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Settings
                      </Link>
                      <hr className="my-1" />
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* Guest navigation */
              <div className="flex items-center space-x-4">
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button variant="primary" size="sm">
                    Get started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
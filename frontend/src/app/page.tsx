'use client';

import React from 'react';
import Link from 'next/link';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import { Brain, ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <Layout showSidebar={false}>
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Logo */}
            <div className="flex justify-center items-center mb-8">
              <Brain className="h-16 w-16 text-blue-600 mr-4" />
              <h1 className="text-4xl font-bold text-gray-900">PersonaTrade</h1>
            </div>
            
            {/* Hero Content */}
            <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Rent & Develop
              <span className="text-blue-600 block">Personality Traits</span>
            </h2>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover, rent, and master personality traits through AI-powered coaching. 
              Transform your social interactions and professional relationships.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                  Get Started Free
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
              
              <Link href="/auth/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Sign In
                </Button>
              </Link>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center text-sm text-gray-500 space-x-6">
              <div className="flex items-center">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span>4.9/5 Rating</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 text-blue-500 mr-1" />
                <span>10,000+ Users</span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-1" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How PersonaTrade Works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Our unique platform combines personality psychology with AI coaching 
              to help you develop the traits you need for success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Discover Traits
              </h4>
              <p className="text-gray-600">
                Browse our marketplace of personality traits like confidence, 
                charisma, and leadership skills.
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Rent & Practice
              </h4>
              <p className="text-gray-600">
                Rent traits from experienced providers and practice with 
                AI-powered coaching scenarios.
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">
                Transform Yourself
              </h4>
              <p className="text-gray-600">
                Track your progress and integrate new traits into your 
                daily interactions and professional life.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Personality?
          </h3>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users who are already developing their ideal personality traits.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                Start Your Journey
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
            
            <Link href="/traits/browse">
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                Browse Traits
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Layout from '@/components/layout/Layout';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { TraitCategory } from '@/lib/types';
import { api } from '@/lib/api/client';
import { validation } from '@/lib/utils';
import { withAuth } from '@/lib/contexts/AuthContext';
import { CheckCircle, AlertCircle, DollarSign, Users, Info } from 'lucide-react';

interface TraitFormData {
  name: string;
  description: string;
  category: TraitCategory | '';
  hourlyRate: string;
  dailyRate: string;
  weeklyRate: string;
  maxUsers: string;
}

const CreateTraitPage: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [formData, setFormData] = useState<TraitFormData>({
    name: '',
    description: '',
    category: '',
    hourlyRate: '',
    dailyRate: '',
    weeklyRate: '',
    maxUsers: '1',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof TraitFormData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general message
    if (message) setMessage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Required fields
    if (!formData.name.trim()) newErrors.name = 'Trait name is required';
    else if (formData.name.trim().length < 3) newErrors.name = 'Name must be at least 3 characters';
    else if (formData.name.trim().length > 200) newErrors.name = 'Name must be less than 200 characters';
    
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    else if (formData.description.trim().length < 10) newErrors.description = 'Description must be at least 10 characters';
    else if (formData.description.trim().length > 2000) newErrors.description = 'Description must be less than 2000 characters';
    
    if (!formData.category) newErrors.category = 'Category is required';
    
    if (!formData.hourlyRate) {
      newErrors.hourlyRate = 'Hourly rate is required';
    } else {
      const rate = parseFloat(formData.hourlyRate);
      if (isNaN(rate) || rate < 1) newErrors.hourlyRate = 'Hourly rate must be at least $1.00';
      if (rate > 500) newErrors.hourlyRate = 'Hourly rate cannot exceed $500.00';
    }
    
    // Optional fields validation
    if (formData.dailyRate) {
      const rate = parseFloat(formData.dailyRate);
      if (isNaN(rate) || rate < 5) newErrors.dailyRate = 'Daily rate must be at least $5.00';
      if (rate > 2000) newErrors.dailyRate = 'Daily rate cannot exceed $2000.00';
    }
    
    if (formData.weeklyRate) {
      const rate = parseFloat(formData.weeklyRate);
      if (isNaN(rate) || rate < 20) newErrors.weeklyRate = 'Weekly rate must be at least $20.00';
      if (rate > 10000) newErrors.weeklyRate = 'Weekly rate cannot exceed $10,000.00';
    }
    
    if (formData.maxUsers) {
      const users = parseInt(formData.maxUsers);
      if (isNaN(users) || users < 1) newErrors.maxUsers = 'Max users must be at least 1';
      if (users > 100) newErrors.maxUsers = 'Max users cannot exceed 100';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setMessage(null);
    
    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category as TraitCategory,
        hourlyRate: Math.round(parseFloat(formData.hourlyRate) * 100), // Convert to cents
        dailyRate: formData.dailyRate ? Math.round(parseFloat(formData.dailyRate) * 100) : undefined,
        weeklyRate: formData.weeklyRate ? Math.round(parseFloat(formData.weeklyRate) * 100) : undefined,
        maxUsers: parseInt(formData.maxUsers),
      };
      
      console.log('Creating trait with payload:', payload);
      
      const response = await api.post('/traits', payload);
      
      if (response.success && response.data) {
        setMessage({ type: 'success', text: 'Trait created successfully!' });
        
        // Redirect to trait detail page after a short delay
        setTimeout(() => {
          router.push(`/traits/${(response.data as any).id}`);
        }, 1500);
      } else {
        setMessage({ type: 'error', text: response.message || 'Failed to create trait' });
      }
    } catch (error: any) {
      console.error('Create trait error:', error);
      setMessage({ type: 'error', text: error.message || 'Failed to create trait' });
    } finally {
      setLoading(false);
    }
  };

  const getCategoryOptions = () => {
    return Object.values(TraitCategory).map(category => ({
      value: category,
      label: category.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    }));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">List Your Personality Trait</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your unique personality traits with others and help them develop new skills through AI-powered coaching.
          </p>
        </div>

        {/* Success/Error Message */}
        {message && (
          <div className={`
            flex items-center p-4 rounded-lg border
            ${message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
            }
          `}>
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {message.text}
          </div>
        )}

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Trait Name"
                    placeholder="e.g., Confident Public Speaking, Empathetic Leadership"
                    value={formData.name}
                    onChange={handleInputChange('name')}
                    error={errors.name}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description')(e.target.value)}
                    placeholder="Describe what makes this trait unique and how it can help others..."
                    rows={4}
                    className={`
                      w-full px-3 py-2 border rounded-lg
                      text-gray-900 placeholder-gray-400
                      bg-white
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-1
                      ${errors.description 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }
                    `}
                    required
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.description}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleInputChange('category')(e.target.value)}
                    className={`
                      w-full px-3 py-2 border rounded-lg
                      text-gray-900 bg-white
                      transition-colors duration-200
                      focus:outline-none focus:ring-2 focus:ring-offset-1
                      ${errors.category 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                      }
                    `}
                    title="Select a category for your trait"
                    required
                  >
                    <option value="">Select a category</option>
                    {getCategoryOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.category}
                    </p>
                  )}
                </div>
                
                <div>
                  <Input
                    label="Max Concurrent Users"
                    type="number"
                    placeholder="1"
                    value={formData.maxUsers}
                    onChange={handleInputChange('maxUsers')}
                    error={errors.maxUsers}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    How many people can rent this trait at the same time?
                  </p>
                </div>
              </div>
            </div>

            {/* Pricing */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                <DollarSign className="inline h-5 w-5 mr-2" />
                Pricing
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <Input
                    label="Hourly Rate"
                    type="number"
                    step="0.01"
                    min="1"
                    max="500"
                    placeholder="25.00"
                    value={formData.hourlyRate}
                    onChange={handleInputChange('hourlyRate')}
                    error={errors.hourlyRate}
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">Required - Base rate per hour</p>
                </div>
                
                <div>
                  <Input
                    label="Daily Rate"
                    type="number"
                    step="0.01"
                    min="5"
                    max="2000"
                    placeholder="150.00"
                    value={formData.dailyRate}
                    onChange={handleInputChange('dailyRate')}
                    error={errors.dailyRate}
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - Discounted day rate</p>
                </div>
                
                <div>
                  <Input
                    label="Weekly Rate"
                    type="number"
                    step="0.01"
                    min="20"
                    max="10000"
                    placeholder="600.00"
                    value={formData.weeklyRate}
                    onChange={handleInputChange('weeklyRate')}
                    error={errors.weeklyRate}
                  />
                  <p className="mt-1 text-xs text-gray-500">Optional - Discounted week rate</p>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Pricing Tips:</p>
                    <ul className="space-y-1 text-blue-700">
                      <li>• Research similar traits to price competitively</li>
                      <li>• Offer daily/weekly discounts to encourage longer rentals</li>
                      <li>• You can adjust pricing anytime after listing</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                Cancel
              </Button>
              
              <Button
                type="submit"
                variant="primary"
                loading={loading}
                disabled={loading}
                size="lg"
              >
                {loading ? 'Creating Trait...' : 'Create Trait'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default withAuth(CreateTraitPage);
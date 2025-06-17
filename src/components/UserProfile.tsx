'use client';

import { useState } from 'react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import { Mail, MapPin, Calendar, Settings, Save, X } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<any>({
    name: user.name,
    email: user.email,
    department: user.department,
    preferences: user.preferences,
  });

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // INTENTIONAL BUG: Function that gets called during form reset, but corrupts data due to any typing
  const handleFormReset = () => {
    // BUG: Due to any typing, this accidentally sets wrong data types
    // This simulates a common bug where any types allow incorrect data flow
    setFormData((prev: any) => {
      // Oops! Instead of resetting to original user data, we're setting problematic values
      // This could happen due to a copy-paste error or refactoring mistake that any types don't catch
      return {
        name: prev.name === '' ? null : prev.name, // BUG: Sets null instead of empty string
        email: prev.email === '' ? undefined : prev.email, // BUG: Sets undefined instead of empty string  
        department: prev.department || 'Engineering',
        preferences: {
          theme: prev.preferences?.theme || 'light',
          notifications: prev.preferences?.notifications === false ? 'disabled' : prev.preferences?.notifications, // BUG: Converts boolean to string
          timezone: prev.preferences?.timezone || 'UTC'
        }
      };
    });
  };

  // INTENTIONAL BUG: Function with any type that breaks when called
  const validateFormData = (data: any) => {
    // This will break because 'data' is typed as 'any' 
    // and we're trying to call methods that don't exist
    const errors = [];
    
    // BUG: Assumes data.name has .trim() method, but could be undefined/null
    if (!data.name.trim()) {
      errors.push('Name is required');
    }
    
    // BUG: Assumes data.email has string methods
    if (!data.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    // BUG: Assumes preferences exists and has specific structure
    if (data.preferences.notifications.toString() === 'invalid') {
      errors.push('Invalid notification setting');
    }
    
    return errors;
  };

  // INTENTIONAL BUG: Function with implicit any return type
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    
    try {
      // INTENTIONAL BUG: This will crash the form when validation runs
      const validationErrors = validateFormData(formData);
      
      if (validationErrors.length > 0) {
        alert('Validation failed: ' + validationErrors.join(', '));
        return;
      }
      
      // INTENTIONAL BUG: Variable with any type
      const updateData: any = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating user profile:', updateData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  // INTENTIONAL BUG: Function that clears form but due to any typing, sets wrong data types
  const handleClearForm = () => {
    // BUG: This tries to "clear" the form but due to any typing, sets problematic values
    // This simulates what happens when developers make mistakes that any types don't catch
    setFormData((prev: any) => ({
      name: '', // This will become null after handleFormReset processes it
      email: '', // This will become undefined after handleFormReset processes it  
      department: prev.department,
      preferences: {
        ...prev.preferences,
        notifications: false // This will become 'disabled' string after handleFormReset
      }
    }));
    
    // Then the problematic reset function runs
    setTimeout(() => handleFormReset(), 100);
  };

  // INTENTIONAL BUG: Function with any parameter type
  const renderPreferenceField = (label: string, name: string, value: any, type: string = 'text') => {
    if (type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={value}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor={name} className="ml-2 block text-sm text-gray-900">
            {label}
          </label>
        </div>
      );
    }

    return (
      <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
          className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="mt-2 text-gray-600">Manage your account settings and preferences</p>
        </div>
        
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Settings className="mr-2 h-4 w-4" />
            Edit Profile
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Edit Profile</h2>
                
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                      Department
                    </label>
                    <select
                      name="department"
                      id="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Sales">Sales</option>
                      <option value="Support">Support</option>
                    </select>
                  </div>
                </div>

                {/* Clear form button - this triggers the bug through normal user action */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleClearForm}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Clear Form
                  </button>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      // Reset form data to original values
                      setFormData({
                        name: user.name,
                        email: user.email,
                        department: user.department,
                        preferences: user.preferences,
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {user.avatar ? (
                        <img className="h-16 w-16 rounded-full" src={user.avatar} alt={user.name} />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-blue-500 flex items-center justify-center">
                          <span className="text-white text-xl font-medium">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-xl font-medium text-gray-900">{user.name}</h3>
                      <p className="text-gray-500 capitalize">{user.role}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="flex items-center text-gray-600">
                      <Mail className="mr-3 h-5 w-5" />
                      {user.email}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="mr-3 h-5 w-5" />
                      {user.department}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-3 h-5 w-5" />
                      Joined {formatDate(user.createdAt)}
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="mr-3 h-5 w-5" />
                      Last active {formatDate(user.lastActive)}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div>
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Preferences</h2>
            
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="preferences.theme" className="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    name="preferences.theme"
                    id="preferences.theme"
                    value={formData.preferences.theme}
                    onChange={handleChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                
                {renderPreferenceField(
                  'Email Notifications',
                  'preferences.notifications',
                  formData.preferences.notifications,
                  'checkbox'
                )}
                
                {renderPreferenceField(
                  'Timezone',
                  'preferences.timezone',
                  formData.preferences.timezone
                )}
              </div>
            ) : (
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Theme</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{user.preferences.theme}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email Notifications</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.preferences.notifications ? 'Enabled' : 'Disabled'}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Timezone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.preferences.timezone}</dd>
                </div>
              </dl>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
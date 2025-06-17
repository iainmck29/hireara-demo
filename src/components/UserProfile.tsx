'use client';

import { useState } from 'react';
import { User } from '@/types';
import { formatDate } from '@/lib/utils';
import { Mail, MapPin, Calendar, Settings, Save, X } from 'lucide-react';

interface UserFormData {
  name: string;
  email: string;
  department: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
    timezone: string;
  };
}

interface UserProfileProps {
  user: User;
}

export function UserProfile({ user }: UserProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState<UserFormData>({
    name: user.name,
    email: user.email,
    department: user.department,
    preferences: user.preferences,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = 'checked' in e.target ? e.target.checked : false;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setFormData((prev: UserFormData) => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setFormData((prev: UserFormData) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFormReset = () => {
    setFormData((prev: UserFormData) => ({
      name: prev.name === '' ? '' : prev.name,
      email: prev.email === '' ? '' : prev.email,
      department: prev.department || 'Engineering',
      preferences: {
        theme: prev.preferences?.theme || 'light',
        notifications: typeof prev.preferences?.notifications === 'boolean' 
          ? prev.preferences.notifications 
          : false,
        timezone: prev.preferences?.timezone || 'UTC'
      }
    }));
  };

  const validateFormData = (data: UserFormData) => {
    const errors: string[] = [];
    
    if (!data.name?.trim?.()) {
      errors.push('Name is required');
    }
    
    if (typeof data.email !== 'string' || !data.email.includes('@')) {
      errors.push('Invalid email format');
    }
    
    if (typeof data.preferences.notifications !== 'boolean') {
      errors.push('Invalid notification setting');
    }
    
    return errors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // INTENTIONAL BUG: This will crash the form when validation runs
      const validationErrors = validateFormData(formData);
      
      if (validationErrors.length > 0) {
        alert('Validation failed: ' + validationErrors.join(', '));
        return;
      }
      
      const updateData = {
        ...formData,
        updatedAt: new Date().toISOString(),
      };
      
      console.log('Updating user profile:', updateData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const handleClearForm = () => {
    setFormData((prev: UserFormData) => ({
      name: '', 
      email: '', 
      department: prev.department,
      preferences: {
        ...prev.preferences,
        notifications: false
      }
    }));
    
    setTimeout(() => handleFormReset(), 100);
  };

  const renderPreferenceField = (
    label: string, 
    name: string, 
    value: string | boolean, 
    type: string = 'text'
  ) => {
    if (type === 'checkbox') {
      return (
        <div className="flex items-center">
          <input
            type="checkbox"
            id={name}
            name={name}
            checked={typeof value === 'boolean' ? value : false}
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
          value={typeof value === 'string' ? value : ''}
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

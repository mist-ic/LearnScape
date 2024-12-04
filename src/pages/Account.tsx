import React from 'react';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/Button';
import { UserCircle, Mail, Calendar } from 'lucide-react';
import { Navigate } from 'react-router-dom';

export function Account() {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Account Settings</h1>
        
        <div className="space-y-6">
          {/* Profile Section */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <UserCircle className="h-12 w-12 text-gray-400" />
                <div>
                  <p className="text-lg font-medium text-gray-900 dark:text-gray-100">{user?.name}</p>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Mail className="h-4 w-4" />
                    <p>{user?.email}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4" />
                    <p>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Edit Profile
              </Button>
            </div>
          </div>

          {/* Account Security */}
          <div className="border-b border-gray-200 dark:border-gray-700 pb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Account Security</h2>
            <div className="space-y-4">
              <Button variant="outline" size="sm">
                Change Password
              </Button>
            </div>
          </div>

          {/* Preferences */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Email Notifications</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
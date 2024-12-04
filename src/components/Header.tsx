import React from 'react';
import { Brain, LogOut, BookOpen, UserCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './Button';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3 hover:opacity-90 transition-opacity">
            <Brain className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">LearnScape</h1>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            {isAuthenticated ? (
              <>
                <Link to="/roadmaps">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    My Roadmaps
                  </Button>
                </Link>
                <Link to="/account">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <UserCircle className="h-4 w-4" />
                    Account
                  </Button>
                </Link>
                <span className="text-sm text-gray-600 dark:text-gray-300">Welcome, {user?.name}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Sign In</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
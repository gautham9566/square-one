// Main layout wrapper component
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Layout = ({ children, title, showNavigation = true }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { path: '/admin', label: 'Admin', icon: '👤' },
    { path: '/staff', label: 'Staff', icon: '👥' },
    { path: '/passenger', label: 'Passenger', icon: '✈️' }
  ];

  const handleLogout = () => {
    // Clear any auth data
    localStorage.removeItem('authToken');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-6">
              <Link to="/" className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-flight-primary to-admin-primary rounded-xl flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-lg">✈</span>
                </div>
                <div>
                  <span className="font-bold text-xl text-neutral-900">AirlineMS</span>
                  <div className="text-xs text-neutral-500">Management System</div>
                </div>
              </Link>
              {title && (
                <div className="hidden md:block">
                  <div className="w-px h-6 bg-neutral-300"></div>
                  <span className="ml-6 text-lg font-semibold text-neutral-700">{title}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-6">
              {showNavigation && (
                <nav className="hidden md:flex space-x-2">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        location.pathname.startsWith(item.path)
                          ? 'bg-flight-primary text-white shadow-md'
                          : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                      }`}
                    >
                      <span className="mr-2 text-base">{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </nav>
              )}

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <div className="relative">
                  <button className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </button>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-status-refunded rounded-full"></div>
                </div>

                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-admin-primary to-admin-dark rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">A</span>
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-neutral-900">Admin User</div>
                    <div className="text-xs text-neutral-500">Administrator</div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={handleLogout}>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
};

export default Layout;

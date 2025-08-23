// Main layout wrapper component
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/Button';
import Badge from './ui/Badge';

const Layout = ({ children, title, showNavigation = true, user = null }) => {
  const location = useLocation();
  const navigate = useNavigate();

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
                {(() => {
                  const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');
                  const logoBg = isDemo ? 'bg-gradient-to-br from-flight-primary to-admin-primary' : 'bg-neutral-300';
                  const userBg = isDemo ? 'bg-gradient-to-br from-admin-primary to-admin-dark' : 'bg-neutral-400';
                  return (
                    <>
                      <div className={`w-10 h-10 ${logoBg} rounded-xl flex items-center justify-center shadow-md`}>
                        <span className="text-white font-bold text-lg">✈</span>
                      </div>
                    </>
                  )
                })()}
                <div>
                  <span className="font-bold text-xl text-neutral-900">Airline</span>
                  <div className="text-xs text-neutral-500">Management System</div>
                </div>
              </Link>
              {title && (
                <>
                  <div className="hidden md:block w-px h-6 bg-neutral-300 mx-4"></div>
                  <div className="hidden md:block">
                    <span className="text-lg font-semibold text-neutral-700">{title}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-4">
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  {(() => {
                    const isDemo = typeof window !== 'undefined' && window.location && window.location.pathname.startsWith('/demo');
                    const userBg = isDemo ? 'bg-gradient-to-br from-admin-primary to-admin-dark' : 'bg-neutral-400';
                    const userName = user?.name || 'User';
                    const userRole = user?.role || 'User';
                    const userInitial = userName.charAt(0).toUpperCase();
                    return (
                      <div className={`w-8 h-8 ${userBg} rounded-full flex items-center justify-center`}>
                        <span className="text-white text-sm font-semibold">{userInitial}</span>
                      </div>
                    )
                  })()}
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-neutral-900">{user?.name || 'User'}</div>
                    <div className="text-xs text-neutral-500">{user?.role || 'User'}</div>
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

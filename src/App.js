import React, { useState } from 'react';
import './styles/globals.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';

export default function App() {
  // Simple state management for demo - replace with real auth later
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('landing');

  // Mock authentication check - replace with real auth
  const checkAuth = () => {
    // For demo: check localStorage or JWT token
    const token = localStorage.getItem('authToken');
    return !!token;
  };

  // Handle navigation
  const handleSignIn = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
    localStorage.setItem('authToken', 'demo-token'); // Mock token
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    setCurrentPage('landing');
    localStorage.removeItem('authToken');
  };

  const handleUpgrade = () => {
    // After demo upload, prompt to sign up
    setCurrentPage('dashboard');
  };

  // Initialize auth state
  React.useEffect(() => {
    const authenticated = checkAuth();
    setIsAuthenticated(authenticated);
    setCurrentPage(authenticated ? 'dashboard' : 'landing');
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
      />

      <main className="container flex-1 py-10">
        {currentPage === 'landing' ? (
          <Landing onUpgrade={handleUpgrade} />
        ) : (
          <Dashboard />
        )}
      </main>

      <Footer />
    </div>
  );
}

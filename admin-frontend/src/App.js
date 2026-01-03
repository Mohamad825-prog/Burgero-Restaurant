// admin-frontend/src/App.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, BrowserRouter as Router } from "react-router-dom";
import adminApiService from './services/adminApiService';

import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MealsPage from './pages/MealsPage';
import SpecialMenuPage from './pages/SpecialMenuPage';
import TestimonialPage from './pages/TestimonialPage';
import ContactMessagesPage from './pages/ContactMessagesPage';
import OrderManagementPage from './pages/OrderManagementPage';
import AddItemPage from './pages/AddItemPage';
import EditMenuItemPage from './pages/EditMenuItemPage';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user has a valid token
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');

        if (!token) {
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        // Verify token validity with backend
        const isValid = await adminApiService.validateToken();

        if (isValid) {
          setIsAuthenticated(true);
        } else {
          // Token is invalid, clear it
          handleLogout();
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    adminApiService.setToken(token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    // Clear all authentication data
    adminApiService.removeToken();
    setIsAuthenticated(false);

    // Clear form data from localStorage if any
    localStorage.removeItem('burgero_orders_fallback');
    localStorage.removeItem('burgero_messages_fallback');

    // Force navigation to login
    window.location.href = "/login";
  };

  // Show loading screen while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen bg-tertiary flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Not authenticated - show login page
  if (!isAuthenticated) {
    return (
      <Router>
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    );
  }

  // Authenticated - show admin dashboard
  return (
    <Router>
      <div className="bg-tertiary min-h-screen">
        <Navbar onLogout={handleLogout} />

        <div className="pt-16">
          <Routes>
            <Route path="/" element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            } />
            <Route path="/menu" element={
              <ProtectedRoute>
                <MenuPage />
              </ProtectedRoute>
            } />
            <Route path="/meals" element={
              <ProtectedRoute>
                <MealsPage />
              </ProtectedRoute>
            } />
            <Route path="/special" element={
              <ProtectedRoute>
                <SpecialMenuPage />
              </ProtectedRoute>
            } />
            <Route path="/testimonial" element={
              <ProtectedRoute>
                <TestimonialPage />
              </ProtectedRoute>
            } />
            <Route path="/contact-messages" element={
              <ProtectedRoute>
                <ContactMessagesPage />
              </ProtectedRoute>
            } />
            <Route path="/orders" element={
              <ProtectedRoute>
                <OrderManagementPage />
              </ProtectedRoute>
            } />
            <Route path="/add-item" element={
              <ProtectedRoute>
                <AddItemPage />
              </ProtectedRoute>
            } />
            <Route path="/edit-item/:id" element={
              <ProtectedRoute>
                <EditMenuItemPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>

        <Footer />
      </div>
    </Router>
  );
};

export default App;
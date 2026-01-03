import React, { useState } from 'react';
import { Routes, Route } from "react-router-dom";

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import MealsPage from './pages/MealsPage';
import SpecialMenuPage from './pages/SpecialMenuPage';
import TestimonialPage from './pages/TestimonialPage';
import ContactPage from './pages/ContactPage';

const App = () => {
  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const openOrderModal = () => setIsOrderOpen(true);
  const closeOrderModal = () => setIsOrderOpen(false);

  return (
    <div>
      {/* Navbar */}
      <Navbar openOrderModal={openOrderModal} />

      {/* Pages */}
      <Routes>
        <Route path="/" element={<HomePage openOrderModal={openOrderModal} />} />
        <Route path="/menu" element={<MenuPage />} />
        <Route path="/meals" element={<MealsPage />} />
        <Route path="/special" element={<SpecialMenuPage />} />
        <Route path="/testimonial" element={<TestimonialPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      {/* Modal */}
      <OrderModal isOpen={isOrderOpen} onClose={closeOrderModal} />

      {/* Footer */}
      <Footer />
    </div>
  );
};
export default App;

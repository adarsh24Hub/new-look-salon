import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Services from '../components/Services';

export default function ServicesPage() {
  const [gender, setGender] = useState('both');

  // Initialize gender state from localStorage
  useEffect(() => {
    const savedGender = localStorage.getItem('salon_preferred_gender');
    if (savedGender === 'men' || savedGender === 'women') {
      setGender(savedGender);
    }
  }, []);

  const handleToggleGender = () => {
    const nextGender = gender === 'men' ? 'women' : 'men';
    setGender(nextGender);
    localStorage.setItem('salon_preferred_gender', nextGender);
  };

  useEffect(() => {
    document.body.className = `theme-${gender}`;
  }, [gender]);

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="services-page" style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar gender={gender} onToggleGender={handleToggleGender} />
      
      <main style={{ padding: '80px 0 40px 0' }}>
        <Services gender={gender} />
      </main>

      <Footer gender={gender} />
    </div>
  );
}

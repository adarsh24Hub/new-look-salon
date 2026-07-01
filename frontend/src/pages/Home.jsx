import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Services from '../components/Services';
import Gallery from '../components/Gallery';
import Reels from '../components/Reels';
import Footer from '../components/Footer';
import Reviews from '../components/Reviews';
import GenderGate from '../components/GenderGate';
import { MessageCircle } from 'lucide-react';

export default function Home() {
  const [gender, setGender] = useState('both');
  const [showGate, setShowGate] = useState(true);

  useEffect(() => {
    // Check if user has already chosen a gender segment in their current session
    const savedGender = localStorage.getItem('salon_preferred_gender');
    if (savedGender === 'men' || savedGender === 'women') {
      setGender(savedGender);
      setShowGate(false);
    }
  }, []);

  const handleSelectGender = (selectedGender) => {
    setGender(selectedGender);
    localStorage.setItem('salon_preferred_gender', selectedGender);
    setShowGate(false);
  };

  const handleToggleGender = () => {
    const nextGender = gender === 'men' ? 'women' : 'men';
    setGender(nextGender);
    localStorage.setItem('salon_preferred_gender', nextGender);
  };

  const handleWhatsAppFloatClick = () => {
    const phone = '06391763738';
    const message = `Hello New Look Salon! I'd like to book an appointment for today. Please let me know available slots.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Add the dynamic gender class to the main body element
  useEffect(() => {
    document.body.className = `theme-${gender}`;
  }, [gender]);

  return (
    <div className="home-page-container">
      {showGate && <GenderGate onSelectGender={handleSelectGender} />}
      
      {!showGate && (
        <div className="main-content-flow animate-fade-in">
          {/* Header Navigation */}
          <Navbar gender={gender} onToggleGender={handleToggleGender} />
          
          {/* Hero Banner Section */}
          <Hero gender={gender} />
          
          {/* Services Section */}
          <Services gender={gender} />
          
          {/* Showcase / Photo Gallery Section */}
          <Gallery gender={gender} />
          
          {/* Instagram / Facebook Reels Section */}
          <Reels gender={gender} />
          
          {/* Client Reviews Section */}
          <Reviews gender={gender} />
          
          {/* Footer Contact Details Section */}
          <Footer gender={gender} />

          {/* Floating WhatsApp Action Bubble */}
          <button 
            className="whatsapp-float" 
            onClick={handleWhatsAppFloatClick}
            title="Book session on WhatsApp"
          >
            <MessageCircle size={32} style={{ fill: 'white' }} />
          </button>
        </div>
      )}
    </div>
  );
}

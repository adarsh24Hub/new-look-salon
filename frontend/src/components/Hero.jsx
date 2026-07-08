import React from 'react';
import { Calendar, MapPin, Phone, MessageSquare } from 'lucide-react';

export default function Hero({ gender }) {
  
  const handleWhatsApp = () => {
    const phone = '9984527769';
    const message = `Hello! I want to book a session at New Look Unisex Salon. Please let me know the available timings today.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleScrollToServices = () => {
    const servicesSection = document.getElementById('services');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Background configurations for Men vs Women
  const bgImage = gender === 'men' 
    ? 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=1600&auto=format&fit=crop'
    : 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1600&auto=format&fit=crop';

  return (
    <div id="home" className="hero-container" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="hero-overlay"></div>
      
      <div className="hero-content animate-slide-up">


        {/* Bilingual Header */}
        <h1 className="hero-title">
          <span className="title-en">NEW LOOK UNISEX SALON</span>
          <span className="title-hi">न्यू लुक यूनिसेक्स सालों</span>
        </h1>
        
        <p className="hero-subtitle">
          {gender === 'men' 
            ? 'Premium Barbering, Hair Styling & Grooming Rituals' 
            : 'Luxury Spa, Beauty Makeovers & Premium Aesthetics'}
        </p>

        <p className="hero-description">
          Experience world-class hair styling, rejuvenating spa sessions, and premium skincare in a fully furnished, air-conditioned luxury environment. Separate grooming zones for men and women.
        </p>

        {/* Action Buttons */}
        <div className="hero-actions">
          <button className="btn-gold" onClick={handleWhatsApp}>
            <MessageSquare size={18} />
            <span>Book via WhatsApp</span>
          </button>
          
          <button className="btn-outline" onClick={handleScrollToServices}>
            <span>View Services</span>
          </button>
        </div>

        {/* Quick Details Bar */}
        <div className="hero-details-bar glass-panel">
          <div className="detail-item">
            <MapPin size={18} className="detail-icon" />
            <div>
              <h4>Location</h4>
              <p>Naini, Prayagraj</p>
            </div>
          </div>
          <div className="detail-item">
            <Calendar size={18} className="detail-icon" />
            <div>
              <h4>Timings</h4>
              <p>7:00 AM - 9:00 PM <span className="closed-tag">(Closed Tue)</span></p>
            </div>
          </div>
          <div className="detail-item">
            <Phone size={18} className="detail-icon" />
            <div>
              <h4>Call to Book</h4>
              <p>99845 27769</p>
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .hero-container {
          position: relative;
          height: 100vh;
          width: 100%;
          background-size: cover;
          background-position: center;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 5%;
          transition: background-image 0.8s ease-in-out;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            to bottom,
            rgba(8, 8, 10, 0.4) 0%,
            rgba(8, 8, 10, 0.8) 70%,
            var(--bg-primary) 100%
          ),
          linear-gradient(
            to right,
            rgba(8, 8, 10, 0.8) 0%,
            rgba(8, 8, 10, 0.5) 50%,
            rgba(8, 8, 10, 0.8) 100%
          );
          z-index: 1;
        }

        .hero-content {
          position: relative;
          z-index: 2;
          max-width: 900px;
          text-align: center;
          margin-top: 60px;
        }

        .ratings-badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.8rem;
          font-weight: 600;
          letter-spacing: 0.05em;
          color: #ffffff;
          margin-bottom: 2rem;
          border-color: rgba(197, 168, 128, 0.3);
        }

        .star-icon {
          color: #fbbf24;
          fill: #fbbf24;
          margin-right: 6px;
        }

        .rating-score {
          color: #ffffff;
          font-weight: 700;
        }

        .rating-divider {
          margin: 0 8px;
          color: rgba(255,255,255,0.3);
        }

        .reviews-count {
          color: var(--accent-color);
        }

        .hero-title {
          margin-bottom: 1.5rem;
        }

        .title-en {
          display: block;
          font-size: 3.8rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          line-height: 1.1;
          color: #ffffff;
          text-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }

        .title-hi {
          display: block;
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: var(--accent-color);
          margin-top: 0.5rem;
          letter-spacing: 0.02em;
          font-weight: 400;
          text-shadow: 0 2px 10px rgba(0,0,0,0.5);
        }

        .hero-subtitle {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          color: #ffffff;
          font-style: italic;
          margin-bottom: 1.5rem;
          letter-spacing: 0.05em;
        }

        .hero-description {
          font-size: 1rem;
          color: var(--text-secondary);
          max-width: 720px;
          margin: 0 auto 2.5rem auto;
          line-height: 1.7;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 4rem;
        }

        .hero-details-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          padding: 1.5rem;
          border-color: rgba(197, 168, 128, 0.2);
          text-align: left;
          gap: 1.5rem;
        }

        .detail-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-right: 1px solid rgba(197, 168, 128, 0.15);
        }

        .detail-item:last-child {
          border-right: none;
        }

        .detail-icon {
          color: var(--accent-color);
          flex-shrink: 0;
        }

        .detail-item h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-secondary);
          margin-bottom: 2px;
        }

        .detail-item p {
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
        }

        .closed-tag {
          font-size: 0.75rem;
          color: #f87171;
          font-weight: 500;
        }


        @media (max-width: 900px) {
          .hero-container {
            height: auto;
            min-height: 100vh;
            padding: 95px 5% 40px 5%;
          }
          .hero-content {
            margin-top: 0;
          }
          .title-en {
            font-size: 2.5rem;
          }
          .title-hi {
            font-size: 1.6rem;
          }
          .hero-subtitle {
            font-size: 1.1rem;
          }
          .hero-details-bar {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1.2rem;
          }
          .detail-item {
            border-right: none;
            border-bottom: 1px solid rgba(197, 168, 128, 0.1);
            padding-bottom: 1rem;
            justify-content: center;
          }
          .detail-item:last-child {
            border-bottom: none;
            padding-bottom: 0;
          }
          .hero-actions {
            flex-direction: column;
            gap: 1rem;
            align-items: stretch;
            max-width: 320px;
            margin-left: auto;
            margin-right: auto;
          }
        }
      `}} />
    </div>
  );
}

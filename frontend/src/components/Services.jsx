import React, { useState, useEffect } from 'react';
import { Scissors, Sparkles, ShieldCheck, HeartHandshake } from 'lucide-react';

const SERVICES_DATA = {
  men: [
    { name: 'Classic Haircut & Style', price: '₹150 - ₹250', desc: 'Expert haircut tailored to your head shape, including hair wash and styling.' },
    { name: 'Royal Shave & Beard Design', price: '₹100 - ₹200', desc: 'Relaxing hot towel shave, edge lining, and premium beard oil application.' },
    { name: 'Nourishing Hair Spa', price: '₹500+', desc: 'Deep conditioning treatment to strengthen roots, repair hair damage, and remove dandruff.' },
    { name: 'Hydrating Facial & De-Tan', price: '₹400+', desc: 'Rejuvenates skin pores, removes tan, and adds a natural glow. Includes face massage.' },
    { name: 'Charcoal Deep Clean Mask', price: '₹200', desc: 'Peel-off blackhead removal mask for clear and fresh skin.' },
    { name: 'Stress-Relief Head Massage', price: '₹150', desc: '15-minute relaxing head massage using premium ayurvedic/almond oils.' }
  ],
  women: [
    { name: 'Precision Haircut & Blowdry', price: '₹400 - ₹800', desc: 'Modern haircuts, styling, layers, bob, including professional blowdry.' },
    { name: 'Keratin & Smoothing Spa', price: '₹1500+', desc: 'Premium chemical-free smoothing spa to make your hair silk-soft and frizz-free.' },
    { name: 'Bridal & Party Makeover', price: 'On Request', desc: 'Professional HD makeup, hairstyling, and draping for special occasions.' },
    { name: 'Gold Radiant Facial', price: '₹800+', desc: 'Premium multi-step facial with gold leaf extracts for bridal-level glowing skin.' },
    { name: 'Organic Waxing & Threading', price: '₹150+', desc: 'Safe, hygienic waxing (honey/ricca) and precise eyebrow shaping.' },
    { name: 'Luxury Pedicure / Manicure', price: '₹400 - ₹700', desc: 'Detoxifying bubble bath for hands & feet, scrubbing, cuticle care, and massage.' }
  ]
};

export default function Services({ gender }) {
  // Sync tab with active gender mode automatically, but allow clicking to change
  const [activeTab, setActiveTab] = useState(gender);

  useEffect(() => {
    setActiveTab(gender);
  }, [gender]);

  const handleBookService = (serviceName) => {
    const phone = '06391763738';
    const message = `Hello! I would like to book a slot for the "${serviceName}" service. Please let me know when you have an open session.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="services" className="services-section">
      <div className="section-header">
        <h2>Our <span>Premium Services</span></h2>
        <div className="divider"></div>
        <p>Choose from our specialized beauty & grooming menus. Enjoy the luxury treatments you deserve.</p>
      </div>

      {/* Tabs Selector */}
      <div className="services-tabs">
        <button 
          className={`tab-btn ${activeTab === 'men' ? 'active' : ''}`}
          onClick={() => setActiveTab('men')}
        >
          Gentlemen Menu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'women' ? 'active' : ''}`}
          onClick={() => setActiveTab('women')}
        >
          Ladies Menu
        </button>
      </div>

      {/* Services Grid */}
      <div className="services-grid animate-fade-in">
        {SERVICES_DATA[activeTab].map((service, index) => (
          <div key={index} className="service-card glass-panel">
            <div className="service-card-header">
              <div className="service-icon-box">
                {activeTab === 'men' ? <Scissors size={18} /> : <Sparkles size={18} />}
              </div>
              <span className="service-price">{service.price}</span>
            </div>
            <h3 className="service-title">{service.name}</h3>
            <p className="service-desc">{service.desc}</p>
            
            <button className="service-book-btn" onClick={() => handleBookService(service.name)}>
              Book Service
            </button>
          </div>
        ))}
      </div>

      {/* Salon USP Banner */}
      <div className="salon-usp-banner glass-panel">
        <div className="usp-item">
          <ShieldCheck size={28} className="usp-icon" />
          <div>
            <h3>Separate Grooming Areas</h3>
            <p>Dedicated private areas for men and women for complete comfort and privacy.</p>
          </div>
        </div>
        <div className="usp-item">
          <Sparkles size={28} className="usp-icon" />
          <div>
            <h3>Fully Furnished AC Interiors</h3>
            <p>Beat the heat and relax in our fully air-conditioned, luxury design space.</p>
          </div>
        </div>
        <div className="usp-item">
          <HeartHandshake size={28} className="usp-icon" />
          <div>
            <h3>Premium Sanitization</h3>
            <p>100% sanitized tools and single-use towels for the highest hygiene standards.</p>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .services-section {
          background-color: var(--bg-secondary);
        }

        .services-tabs {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 3.5rem;
          position: relative;
          z-index: 10;
        }

        .tab-btn {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 1rem;
          font-weight: 600;
          padding: 0.8rem 2.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .tab-btn:hover {
          color: #ffffff;
          border-color: var(--accent-color);
        }

        .tab-btn.active {
          background: var(--gold-gradient);
          color: #0d0d0f;
          border-color: transparent;
          box-shadow: 0 4px 15px rgba(197, 168, 128, 0.3);
        }

        .services-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto 5rem auto;
          position: relative;
          z-index: 10;
        }

        .service-card {
          padding: 2.2rem;
          display: flex;
          flex-direction: column;
          border-color: rgba(255, 255, 255, 0.05);
          transition: var(--transition-smooth);
        }

        .service-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-color);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.2rem;
        }

        .service-icon-box {
          background: rgba(197, 168, 128, 0.1);
          color: var(--accent-color);
          width: 42px;
          height: 42px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .service-card:hover .service-icon-box {
          background: var(--accent-color);
          color: #0d0d0f;
        }

        .service-price {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--accent-color);
        }

        .service-title {
          font-size: 1.3rem;
          margin-bottom: 0.8rem;
          letter-spacing: 0.02em;
        }

        .service-desc {
          font-size: 0.88rem;
          color: var(--text-secondary);
          margin-bottom: 2rem;
          flex-grow: 1;
        }

        .service-book-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #ffffff;
          padding: 0.6rem 1.2rem;
          font-weight: 600;
          font-size: 0.8rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .service-card:hover .service-book-btn {
          background: var(--accent-color);
          border-color: transparent;
          color: #0d0d0f;
        }

        .salon-usp-banner {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem;
          border-color: rgba(197, 168, 128, 0.1);
          position: relative;
          z-index: 10;
        }

        .usp-item {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
        }

        .usp-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .usp-item h3 {
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
        }

        .usp-item p {
          font-size: 0.85rem;
          color: var(--text-secondary);
        }

        @media (max-width: 900px) {
          .salon-usp-banner {
            grid-template-columns: 1fr;
            padding: 2rem;
            gap: 1.8rem;
          }
        }
      `}} />
    </section>
  );
}

import React, { useState, useEffect } from 'react';
import { Phone, MessageSquare, Instagram, Gift, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { API_BASE_URL, optimizeCloudinaryUrl } from '../config';

export default function Mehndi() {
  const [gender, setGender] = useState('both');
  const [services, setServices] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);

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

  // Fetch Mehndi Services and Reels
  useEffect(() => {
    const fetchMehndiData = async () => {
      setLoading(true);
      try {
        // Fetch services
        const servicesRes = await fetch(`${API_BASE_URL}/api/services`);
        if (servicesRes.ok) {
          const servicesData = await servicesRes.json();
          // Filter for mehndi services
          const mehndiServices = servicesData.filter(s => s.category === 'mehndi');
          setServices(mehndiServices);
        }

        // Fetch mehndi reels
        const reelsRes = await fetch(`${API_BASE_URL}/api/reels?category=mehndi`);
        if (reelsRes.ok) {
          const reelsData = await reelsRes.json();
          setReels(reelsData);
        }
      } catch (err) {
        console.error('Error fetching Mehndi data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMehndiData();
  }, []);

  // Imran's contacts
  const phone = '6393105968';
  const instaUsername = 'mehindi_arts_imran';
  const instaUrl = `https://instagram.com/${instaUsername}`;

  const handleCall = () => {
    window.open(`tel:+91${phone}`, '_self');
  };

  const handleWhatsApp = () => {
    const message = "Hello Imran! I saw your Mehndi designs on the website and would like to book a slot or ask about pricing. Please let me know your availability.";
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Fallback/Default Mehndi Services if DB is empty
  const defaultServices = [
    {
      _id: 'default-arabic',
      name: 'Premium Arabic Mehndi',
      price: '₹500+',
      desc: 'Elegant flowy vines, floral patterns, shading, and leafy trails. Perfect for casual events and festivals.',
      imageUrl: 'https://images.unsplash.com/photo-1601625903708-3604f323a63b?q=80&w=800&auto=format&fit=crop'
    },
    {
      _id: 'default-bridal',
      name: 'Full Intricate Bridal Mehndi',
      price: '₹5,100+',
      desc: 'Intricate personalized patterns from elbows to fingertips. Includes customized figures, portrait arts, and traditional storytelling designs.',
      imageUrl: 'https://images.unsplash.com/photo-1590156221120-e223a0df446c?q=80&w=800&auto=format&fit=crop'
    },
    {
      _id: 'default-engagement',
      name: 'Designer Bridal / Engagement Trail',
      price: '₹2,100+',
      desc: 'Stylish mandala patterns, bracelet cuffs, and delicate negative-space shading. Curated for modern brides.',
      imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop'
    }
  ];

  const displayedServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="mehndi-page">
      <Navbar gender={gender} onToggleGender={handleToggleGender} />

      {/* Main Container */}
      <main className="mehndi-main-container">
        
        {/* Page Hero Header */}
        <section className="mehndi-hero glass-panel">
          <div className="mehndi-hero-content">
            <div className="badge-highlight">
              <Sparkles size={16} />
              <span>Premium Artist</span>
            </div>
            <h1>Imran Mehndi Arts</h1>
            <p className="artist-description">
              Professional, custom-tailored, and highly detailed Mehndi designs for every special occasion. From stunning traditional Bridal artwork to minimalist modern designer trails, Imran creates breathtaking hand-drawn pieces using 100% natural, deep-staining organic henna.
            </p>

            {/* Contact Actions Area */}
            <div className="artist-contact-box">
              <div className="insta-meta">
                <Instagram size={22} className="text-pink-insta" />
                <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="insta-handle">
                  @{instaUsername}
                </a>
              </div>
              
              <div className="contact-actions-row">
                <button className="btn-whatsapp" onClick={handleWhatsApp}>
                  <MessageSquare size={18} />
                  <span>WhatsApp Imran</span>
                </button>
                <button className="btn-call" onClick={handleCall}>
                  <Phone size={18} />
                  <span>Call: +91 {phone}</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Portfolio Services Grid */}
        <section className="mehndi-portfolio-section">
          <div className="section-header-centered">
            <h2>Mehndi Designs & Packages</h2>
            <div className="section-divider"></div>
            <p>Explore our trending designs and book your appointments in advance for weddings and festivals.</p>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading Mehndi designs...</div>
          ) : (
            <div className="mehndi-cards-grid">
              {displayedServices.map((service) => (
                <div key={service._id} className="mehndi-card glass-panel animate-slide-up">
                  <div className="mehndi-card-banner">
                    <img 
                      src={optimizeCloudinaryUrl(service.imageUrl, 500)} 
                      alt={service.name} 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1601625903708-3604f323a63b?q=80&w=800';
                      }}
                    />
                    <div className="price-tag">{service.price}</div>
                  </div>
                  <div className="mehndi-card-body">
                    <h3>{service.name}</h3>
                    <p>{service.desc}</p>
                    <button className="btn-gold card-booking-btn" onClick={handleWhatsApp}>
                      <MessageSquare size={16} />
                      <span>Book Design</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Reels Section */}
        <section className="mehndi-reels-section">
          <div className="section-header-centered">
            <h2>Watch Imran's Live Artistry</h2>
            <div className="section-divider"></div>
            <p>Catch the speed-art, detailing, and final henna stains in action.</p>
          </div>

          {loading ? (
            <div className="loading-spinner">Loading Mehndi video reels...</div>
          ) : reels.length > 0 ? (
            <div className="reels-display-grid">
              {reels.map((reel) => (
                <div key={reel._id} className="reel-card glass-panel">
                  <div className="reel-video-wrapper">
                    <iframe 
                      src={reel.embedUrl}
                      title={reel.title}
                      scrolling="no"
                      allowTransparency="true"
                      allow="encrypted-media"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  <div className="reel-caption-info">
                    <h4>{reel.title || 'Mehndi Design Video'}</h4>
                    <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="reel-creator-tag">
                      <Instagram size={12} />
                      <span>@{instaUsername}</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-reels-box glass-panel">
              <Instagram size={36} className="text-muted" />
              <h3>Looking for video reels?</h3>
              <p>Explore Imran's full collection of live speed-arts and tutorial clips on his official Instagram profile.</p>
              <a href={instaUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-insta">
                <Instagram size={16} />
                <span>Visit Instagram Feed</span>
              </a>
            </div>
          )}
        </section>

      </main>

      <Footer gender={gender} />

      {/* Styled JSX specifically for Mehndi Page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .mehndi-page {
          min-height: 100vh;
          background-color: var(--bg-primary);
          color: #ffffff;
        }

        .mehndi-main-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 120px 24px 60px 24px;
          display: flex;
          flex-direction: column;
          gap: 5rem;
        }

        /* Hero styling */
        .mehndi-hero {
          padding: 4rem;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(20, 16, 12, 0.7) 0%, rgba(10, 8, 6, 0.9) 100%);
          border: 1px solid rgba(197, 168, 128, 0.15);
          text-align: center;
          position: relative;
          overflow: hidden;
        }

        .mehndi-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(circle at 10% 20%, rgba(197, 168, 128, 0.05) 0%, transparent 60%);
          pointer-events: none;
        }

        .mehndi-hero-content {
          max-width: 800px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
        }

        .badge-highlight {
          display: flex;
          align-items: center;
          gap: 6px;
          background: rgba(197, 168, 128, 0.1);
          border: 1px solid var(--accent-color);
          color: var(--accent-color);
          padding: 6px 14px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .mehndi-hero h1 {
          font-family: var(--font-serif);
          font-size: 3.2rem;
          color: #ffffff;
          line-height: 1.2;
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .artist-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
          text-align: center;
        }

        /* Contacts area */
        .artist-contact-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          margin-top: 1rem;
          width: 100%;
        }

        .insta-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.06);
          padding: 8px 18px;
          border-radius: 30px;
        }

        .insta-handle {
          font-weight: 600;
          color: #f472b6;
          font-size: 1rem;
        }

        .insta-handle:hover {
          text-decoration: underline;
        }

        .contact-actions-row {
          display: flex;
          gap: 1.2rem;
          flex-wrap: wrap;
          justify-content: center;
          width: 100%;
        }

        .btn-whatsapp, .btn-call {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0.85rem 2.2rem;
          border-radius: 8px;
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .btn-whatsapp {
          background: #25d366;
          color: #ffffff;
          border: none;
        }

        .btn-whatsapp:hover {
          background: #20ba5a;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(37, 211, 102, 0.3);
        }

        .btn-call {
          background: transparent;
          border: 1px solid var(--accent-color);
          color: var(--accent-color);
        }

        .btn-call:hover {
          background: var(--accent-color);
          color: #000000;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(197, 168, 128, 0.2);
        }

        /* Portfolio styling */
        .section-header-centered {
          text-align: center;
          margin-bottom: 3.5rem;
        }

        .section-header-centered h2 {
          font-family: var(--font-serif);
          font-size: 2.2rem;
          color: #ffffff;
          margin-bottom: 0.8rem;
        }

        .section-divider {
          width: 60px;
          height: 2px;
          background: var(--gold-gradient);
          margin: 0 auto 1.2rem auto;
        }

        .section-header-centered p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        /* Grid configuration */
        .mehndi-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 360px));
          justify-content: center;
          gap: 2.5rem;
        }

        .mehndi-card {
          display: flex;
          flex-direction: column;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(18, 14, 11, 0.6);
          border: 1px solid rgba(197, 168, 128, 0.12);
          transition: var(--transition-smooth);
          height: 100%;
        }

        .mehndi-card:hover {
          transform: translateY(-8px);
          border-color: rgba(197, 168, 128, 0.4);
          box-shadow: 0 12px 30px rgba(197, 168, 128, 0.15);
        }

        .mehndi-card-banner {
          position: relative;
          height: 260px;
          overflow: hidden;
          background: #000000;
        }

        .mehndi-card-banner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-smooth);
        }

        .mehndi-card:hover .mehndi-card-banner img {
          transform: scale(1.06);
        }

        .price-tag {
          position: absolute;
          top: 15px;
          right: 15px;
          background: var(--gold-gradient);
          color: #0c0c0e;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 6px 14px;
          border-radius: 30px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          letter-spacing: 0.02em;
        }

        .mehndi-card-body {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 12px;
        }

        .mehndi-card-body h3 {
          font-size: 1.25rem;
          font-family: var(--font-serif);
          color: #ffffff;
          font-weight: 700;
        }

        .mehndi-card-body p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex-grow: 1;
        }

        .card-booking-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 0.75rem;
          margin-top: 8px;
          border-radius: 6px;
        }

        /* Reels section styling */
        .reels-display-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 330px));
          justify-content: center;
          gap: 2.2rem;
        }

        .reel-card {
          border-radius: 12px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
        }

        .reel-video-wrapper {
          position: relative;
          width: 100%;
          padding-top: 177.78%; /* 9:16 aspect ratio */
          background: #000;
        }

        .reel-video-wrapper iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
        }

        .reel-caption-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 5px;
          background: #0c0c0e;
        }

        .reel-caption-info h4 {
          font-size: 0.9rem;
          color: #ffffff;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .reel-creator-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          color: #f472b6;
          font-weight: 500;
        }

        .reel-creator-tag:hover {
          text-decoration: underline;
        }

        /* Empty reels styling */
        .no-reels-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          padding: 4rem 2rem;
          max-width: 500px;
          margin: 0 auto;
          text-align: center;
          border-radius: 12px;
        }

        .no-reels-box h3 {
          font-size: 1.25rem;
          color: #ffffff;
          margin-top: 6px;
        }

        .no-reels-box p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .btn-outline-insta {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 0.75rem 1.8rem;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85rem;
          border: 1px solid rgba(244, 114, 182, 0.4);
          color: #f472b6;
          margin-top: 8px;
          transition: var(--transition-smooth);
        }

        .btn-outline-insta:hover {
          background: rgba(244, 114, 182, 0.05);
          border-color: #f472b6;
        }

        .loading-spinner {
          text-align: center;
          padding: 3rem;
          color: var(--text-muted);
          font-size: 1rem;
        }

        @media (max-width: 768px) {
          .mehndi-main-container {
            padding: 95px 16px 40px 16px;
            gap: 3.5rem;
          }
          .mehndi-hero {
            padding: 2rem 1.5rem;
          }
          .mehndi-hero h1 {
            font-size: 2.2rem;
          }
          .artist-description {
            font-size: 0.95rem;
          }
          .contact-actions-row {
            flex-direction: column;
            width: 100%;
            gap: 0.8rem;
          }
          .btn-whatsapp, .btn-call {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}

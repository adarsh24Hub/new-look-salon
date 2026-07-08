import React, { useState } from 'react';
import { Menu, X, MessageSquare, ToggleLeft, ToggleRight, Sparkles } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function Navbar({ gender, onToggleGender }) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isMainPage = location.pathname === '/';

  const handleNavClick = (e, targetId) => {
    setIsOpen(false);
    if (!isMainPage) {
      navigate('/');
      // Wait for navigation before scrolling
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      e.preventDefault();
      const element = document.getElementById(targetId);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleWhatsAppBooking = () => {
    const phone = '06391763738';
    const message = `Hello New Look Salon! I would like to book a slot for some ${gender === 'men' ? 'men\'s grooming' : 'women\'s beauty'} services. Please confirm availability.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <nav className="nav-container glass-panel">
      <div className="nav-wrapper">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <span className="logo-main">NEW LOOK</span>
          <span className="logo-sub">{gender === 'men' ? 'UNISEX SALON' : 'SPA & BEAUTY'}</span>
        </Link>

        {/* Desktop Links */}
        <div className="desktop-menu">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#offers" onClick={(e) => handleNavClick(e, 'offers')}>Offers</a>
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Services</a>
          <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a>
          <a href="#reels" onClick={(e) => handleNavClick(e, 'reels')}>Trending Reels</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>
        </div>

        {/* Gender Toggle and CTA */}
        <div className="nav-actions">
          {/* Gender Switch Toggle */}
          <button 
            className={`gender-toggle-btn ${gender}`}
            onClick={onToggleGender}
            title={`Switch to ${gender === 'men' ? 'Women' : 'Men'} Mode`}
          >
            <Sparkles size={14} className="sparkle-accent" />
            <span>{gender === 'men' ? 'Gents' : 'Ladies'}</span>
            {gender === 'men' ? (
              <ToggleLeft size={24} className="toggle-icon text-blue" />
            ) : (
              <ToggleRight size={24} className="toggle-icon text-pink" />
            )}
          </button>

          <button className="btn-gold nav-cta" onClick={handleWhatsAppBooking}>
            <MessageSquare size={16} />
            <span>Book Now</span>
          </button>

          {/* Hamburger Menu Icon */}
          <button className="mobile-menu-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="mobile-drawer glass-panel animate-fade-in">
          <a href="#home" onClick={(e) => handleNavClick(e, 'home')}>Home</a>
          <a href="#offers" onClick={(e) => handleNavClick(e, 'offers')}>Offers & Discounts</a>
          <a href="#services" onClick={(e) => handleNavClick(e, 'services')}>Services</a>
          <a href="#gallery" onClick={(e) => handleNavClick(e, 'gallery')}>Gallery</a>
          <a href="#reels" onClick={(e) => handleNavClick(e, 'reels')}>Trending Reels</a>
          <a href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>Contact</a>

          <div className="drawer-actions">
            <button className="btn-gold w-full" onClick={handleWhatsAppBooking}>
              <MessageSquare size={16} />
              <span>Book via WhatsApp</span>
            </button>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .nav-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          z-index: 1000;
          border-radius: 0;
          border-left: none;
          border-right: none;
          border-top: none;
          padding: 0 5%;
          display: flex;
          align-items: center;
        }

        .nav-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .brand-logo {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-family: var(--font-serif);
          font-size: 1.5rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          color: #ffffff;
          line-height: 1.1;
        }

        .logo-sub {
          font-size: 0.7rem;
          letter-spacing: 0.35em;
          color: var(--accent-color);
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .desktop-menu {
          display: flex;
          gap: 2.2rem;
          font-weight: 500;
          font-size: 0.9rem;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .desktop-menu a {
          position: relative;
          color: var(--text-secondary);
        }

        .desktop-menu a:hover, .desktop-menu .admin-nav-link:hover {
          color: var(--accent-color);
        }

        .desktop-menu a::after {
          content: '';
          position: absolute;
          width: 0;
          height: 1.5px;
          bottom: -4px;
          left: 0;
          background: var(--gold-gradient);
          transition: var(--transition-smooth);
        }

        .desktop-menu a:hover::after {
          width: 100%;
        }

        .admin-nav-link {
          color: var(--text-muted);
          font-size: 0.9rem;
          font-weight: 500;
          text-transform: uppercase;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .gender-toggle-btn {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--card-border);
          padding: 6px 12px;
          border-radius: 20px;
          color: #ffffff;
          display: flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .gender-toggle-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          border-color: var(--accent-color);
        }

        .toggle-icon {
          color: var(--accent-color);
        }

        .sparkle-accent {
          color: var(--accent-color);
        }

        .mobile-menu-btn {
          display: none;
          background: transparent;
          border: none;
          color: #ffffff;
          cursor: pointer;
        }

        .mobile-drawer {
          position: absolute;
          top: 80px;
          left: 0;
          width: 100%;
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          border-radius: 0 0 12px 12px;
          border-left: none;
          border-right: none;
        }

        .mobile-drawer a {
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.5rem;
        }

        @media (max-width: 1024px) {
          .desktop-menu {
            display: none;
          }
          .mobile-menu-btn {
            display: block;
          }
          .nav-cta {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .nav-container {
            height: 70px;
            padding: 0 4%;
          }
          .mobile-drawer {
            top: 70px;
            padding: 1.5rem;
            gap: 1.2rem;
          }
          .logo-main {
            font-size: 1.25rem;
          }
          .logo-sub {
            font-size: 0.62rem;
            letter-spacing: 0.28em;
          }
          .gender-toggle-btn {
            padding: 5px 10px;
            font-size: 0.75rem;
            gap: 5px;
          }
          .nav-actions {
            gap: 0.8rem;
          }
        }

        @media (max-width: 480px) {
          .nav-container {
            height: 65px;
            padding: 0 3%;
          }
          .mobile-drawer {
            top: 65px;
            padding: 1.2rem;
            gap: 1rem;
          }
          .logo-main {
            font-size: 1.15rem;
          }
          .logo-sub {
            font-size: 0.55rem;
            letter-spacing: 0.22em;
          }
          .gender-toggle-btn {
            padding: 4px 8px;
            font-size: 0.7rem;
            gap: 4px;
          }
          .nav-actions {
            gap: 0.5rem;
          }
        }
      `}} />
    </nav>
  );
}

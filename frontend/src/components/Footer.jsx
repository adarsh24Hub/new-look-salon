import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, MessageSquare, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer({ gender }) {
  
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    const phone = '06391763738';
    const message = 'Hello! I would like to query about services at New Look Salon.';
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <footer id="contact" className="footer-section">
      <div className="footer-top">
        <div className="footer-grid">
          
          {/* Brand Info */}
          <div className="footer-col brand-col">
            <h2>NEW LOOK</h2>
            <p className="brand-hindi">न्यू लुक यूनिसेक्स सालों</p>
            <p className="brand-desc">
              Prayagraj's premier styling destination. Step in to transform your look with our professional barbers, makeup artists, and spa therapists.
            </p>
            <div className="social-links">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn insta" title="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon-btn fb" title="Facebook">
                <Facebook size={18} />
              </a>
              <button onClick={handleWhatsApp} className="social-icon-btn wa" title="WhatsApp">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>

          {/* Quick Contact Details */}
          <div className="footer-col">
            <h3>Get In Touch</h3>
            <div className="divider-left"></div>
            <ul className="contact-list">
              <li>
                <MapPin size={18} className="contact-icon" />
                <span>D Block, ADA Colony, Naini, Prayagraj, Uttar Pradesh 211008</span>
              </li>
              <li>
                <Phone size={18} className="contact-icon" />
                <div className="phones">
                  <a href="tel:06391763738">063917 63738</a>
                  <a href="tel:09984527769">099845 27769</a>
                </div>
              </li>
              <li>
                <Mail size={18} className="contact-icon" />
                <a href="mailto:husainsaddam65463@gmail.com">husainsaddam65463@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Business Hours */}
          <div className="footer-col">
            <h3>Salon Hours</h3>
            <div className="divider-left"></div>
            <ul className="hours-list">
              <li>
                <Clock size={16} className="contact-icon" />
                <div className="hours-detail">
                  <span className="days">Wed - Mon:</span>
                  <span className="time">7:00 AM - 9:00 PM</span>
                </div>
              </li>
              <li className="closed-day-row">
                <Clock size={16} className="contact-icon text-red" />
                <div className="hours-detail text-red">
                  <span className="days">Tuesday:</span>
                  <span className="time">Closed (Weekly Holiday)</span>
                </div>
              </li>
            </ul>
            <div className="map-btn-box">
              <a 
                href="https://maps.google.com/?q=New+Look+Unisex+Salon+Naini+Prayagraj" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-outline map-link-btn"
              >
                Get Directions on Map
              </a>
            </div>
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-wrapper">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} New Look Unisex Salon. All Rights Reserved.
          </p>
          <div className="footer-bottom-links">
            <Link to="/admin" className="admin-portal-link">Admin Portal</Link>
            <button className="scroll-top-btn" onClick={handleScrollTop} title="Scroll to Top">
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .footer-section {
          background-color: #070709;
          border-top: 1px solid rgba(197, 168, 128, 0.1);
          color: #ffffff;
        }

        .footer-top {
          padding: 5rem 5% 3rem 5%;
          max-width: 1400px;
          margin: 0 auto;
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 4rem;
        }

        .footer-col h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .divider-left {
          width: 40px;
          height: 2px;
          background: var(--gold-gradient);
          margin-bottom: 2rem;
        }

        .brand-col h2 {
          font-size: 2.2rem;
          letter-spacing: 0.05em;
          margin-bottom: 2px;
        }

        .brand-hindi {
          font-family: var(--font-serif);
          font-size: 1.1rem;
          color: var(--accent-color);
          margin-bottom: 1.2rem;
        }

        .brand-desc {
          color: var(--text-secondary);
          font-size: 0.92rem;
          margin-bottom: 2rem;
          line-height: 1.6;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-icon-btn {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .social-icon-btn:hover {
          color: #0d0d0f;
          transform: translateY(-3px);
          border-color: transparent;
        }

        .social-icon-btn.insta:hover {
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
        }

        .social-icon-btn.fb:hover {
          background: #1877f2;
        }

        .social-icon-btn.wa:hover {
          background: #25d366;
        }

        .contact-list, .hours-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .contact-list li, .hours-list li {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .contact-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 3px;
        }

        .phones {
          display: flex;
          flex-direction: column;
        }

        .phones a:hover, .contact-list a:hover {
          color: var(--accent-color);
        }

        .hours-detail {
          display: flex;
          flex-direction: column;
        }

        .hours-detail .days {
          font-weight: 600;
          color: #ffffff;
        }

        .hours-detail .time {
          font-size: 0.9rem;
        }

        .text-red {
          color: #f87171 !important;
        }

        .map-btn-box {
          margin-top: 2rem;
        }

        .map-link-btn {
          width: 100%;
          text-align: center;
          justify-content: center;
          padding: 0.6rem 1.2rem;
          font-size: 0.8rem;
        }

        .footer-bottom {
          padding: 1.8rem 5%;
          background-color: #040405;
          border-top: 1px solid rgba(255,255,255,0.03);
        }

        .footer-bottom-wrapper {
          display: flex;
          justify-content: space-between;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
        }

        .copyright-text {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .footer-bottom-links {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .admin-portal-link {
          color: var(--text-muted);
          font-size: 0.82rem;
          font-weight: 500;
        }

        .admin-portal-link:hover {
          color: var(--accent-color);
        }

        .scroll-top-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .scroll-top-btn:hover {
          background: var(--accent-color);
          color: #0d0d0f;
          border-color: transparent;
        }

        @media (max-width: 1024px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }
          .footer-bottom-wrapper {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}} />
    </footer>
  );
}

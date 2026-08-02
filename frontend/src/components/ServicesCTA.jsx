import React from 'react';
import { Link } from 'react-router-dom';
import { Scissors, Sparkles, ShieldCheck, HeartHandshake, ArrowRight } from 'lucide-react';

export default function ServicesCTA({ gender }) {
  const isMen = gender === 'men';
  const isWomen = gender === 'women';

  return (
    <section id="services-cta" className="services-cta-section">
      <div className="cta-container">
        
        {/* Left Side: Text and Features */}
        <div className="cta-text-content">
          <span className="welcome-tag">New Look Experience</span>
          
          <h2>
            {isMen ? (
              <>Premium Barbering & <span className="gold-text">Grooming Rituals</span></>
            ) : isWomen ? (
              <>Luxury Beauty & <span className="gold-text">Premium Aesthetics</span></>
            ) : (
              <>World-Class Beauty & <span className="gold-text">Grooming Care</span></>
            )}
          </h2>
          
          <div className="section-divider"></div>
          
          <p className="cta-desc">
            Step into our premium unisex salon for a tailored transformation. We provide state-of-the-art styling services, skin therapies, and relaxing hair spa treatments designed to bring out your best look.
          </p>

          {/* Value Propositions Grid */}
          <div className="usp-grid">
            <div className="usp-card glass-panel">
              <ShieldCheck className="usp-icon" size={24} />
              <div className="usp-info">
                <h3>Separate Grooming Lounges</h3>
                <p>Private, dedicated styling zones for gentlemen and ladies for complete privacy and comfort.</p>
              </div>
            </div>
            
            <div className="usp-card glass-panel">
              <Sparkles className="usp-icon" size={24} />
              <div className="usp-info">
                <h3>International Brands</h3>
                <p>We use top-tier global brands including L'Oréal, O3+, and premium organic skin care products.</p>
              </div>
            </div>

            <div className="usp-card glass-panel">
              <HeartHandshake className="usp-icon" size={24} />
              <div className="usp-info">
                <h3>Hygienic & AC Interiors</h3>
                <p>Fully air-conditioned luxury space with 100% sanitized tools and single-use towels.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Visual Card Overlay */}
        <div className="cta-visual-showcase">
          <div className="interactive-promo-box glass-panel">
            <div className="promo-image-wrapper">
              <img 
                src={isMen 
                  ? 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=800&auto=format&fit=crop'
                  : 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=800&auto=format&fit=crop'
                } 
                alt="Salon Interior" 
                className="promo-image"
              />
              <div className="promo-overlay"></div>
              <div className="promo-badge">
                <Scissors size={14} />
                <span>Premium Quality</span>
              </div>
            </div>
            
            <div className="promo-body">
              <h3>Explore Our Services Menu</h3>
              <p>Discover our competitive pricing for haircuts, facials, waxing, bridal makeups, and hair treatments.</p>
              
              <Link to="/services" className="btn-gold explore-btn">
                <span>View Full Menu</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .services-cta-section {
          padding: 6rem 5%;
          background-color: var(--bg-secondary);
          position: relative;
          overflow: hidden;
        }

        .services-cta-section::before {
          content: '';
          position: absolute;
          width: 300px;
          height: 300px;
          background: radial-gradient(circle, rgba(197, 168, 128, 0.05) 0%, transparent 70%);
          bottom: -50px;
          left: -50px;
          pointer-events: none;
        }

        .cta-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          gap: 4rem;
        }

        .cta-text-content {
          flex: 1.2;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          text-align: left;
        }

        .welcome-tag {
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          color: var(--accent-color);
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .cta-text-content h2 {
          font-size: 2.5rem;
          line-height: 1.2;
          margin-bottom: 1rem;
        }

        .gold-text {
          color: var(--accent-color);
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .section-divider {
          width: 80px;
          height: 3px;
          background: var(--gold-gradient);
          margin-bottom: 1.5rem;
        }

        .cta-desc {
          color: var(--text-secondary);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2.2rem;
        }

        .usp-grid {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          width: 100%;
        }

        .usp-card {
          display: flex;
          align-items: flex-start;
          gap: 1.2rem;
          padding: 1.2rem;
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          transition: var(--transition-smooth);
        }

        .usp-card:hover {
          background: rgba(197, 168, 128, 0.03);
          border-color: rgba(197, 168, 128, 0.25);
          transform: translateX(5px);
        }

        .usp-icon {
          color: var(--accent-color);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .usp-info h3 {
          font-size: 1.05rem;
          margin-bottom: 0.2rem;
          font-weight: 600;
          color: #ffffff;
        }

        .usp-info p {
          font-size: 0.85rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        /* Visual showcase side */
        .cta-visual-showcase {
          flex: 0.8;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
        }

        .interactive-promo-box {
          width: 100%;
          max-width: 400px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.9);
          border: 1px solid rgba(197, 168, 128, 0.2);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6);
          transition: var(--transition-smooth);
        }

        .interactive-promo-box:hover {
          transform: translateY(-5px);
          border-color: rgba(197, 168, 128, 0.4);
          box-shadow: 0 20px 45px rgba(197, 168, 128, 0.15);
        }

        .promo-image-wrapper {
          position: relative;
          height: 240px;
          overflow: hidden;
        }

        .promo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .interactive-promo-box:hover .promo-image {
          transform: scale(1.05);
        }

        .promo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(18, 18, 22, 0.95) 0%, transparent 60%);
        }

        .promo-badge {
          position: absolute;
          top: 15px;
          left: 15px;
          background: rgba(13, 13, 15, 0.8);
          border: 1px solid var(--accent-color);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .promo-body {
          padding: 2rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .promo-body h3 {
          font-size: 1.3rem;
          color: #ffffff;
        }

        .promo-body p {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
        }

        .explore-btn {
          width: 100%;
          justify-content: center;
          margin-top: 0.5rem;
          padding: 0.8rem;
        }

        @media (max-width: 968px) {
          .cta-container {
            flex-direction: column;
            gap: 3rem;
          }
          
          .cta-text-content {
            align-items: center;
            text-align: center;
          }
          
          .section-divider {
            margin: 0 auto 1.5rem auto;
          }
          
          .usp-card {
            text-align: left;
          }

          .cta-visual-showcase {
            max-width: 450px;
            margin: 0 auto;
          }
        }

        @media (max-width: 480px) {
          .services-cta-section {
            padding: 4rem 4%;
          }
          
          .cta-text-content h2 {
            font-size: 2rem;
          }
          
          .promo-body {
            padding: 1.5rem;
          }
        }
      `}} />
    </section>
  );
}

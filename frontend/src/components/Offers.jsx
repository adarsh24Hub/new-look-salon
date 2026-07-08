import React, { useState, useEffect } from 'react';
import { Gift, Copy, Check, MessageSquare, X, Calendar, Sparkles, AlertCircle } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Offers({ gender }) {
  const [offers, setOffers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUnwrapped, setIsUnwrapped] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch offers from backend
  useEffect(() => {
    const fetchActiveOffers = async () => {
      try {
        setLoading(true);
        // Fetch active offers targeted at the current gender or 'both'
        const res = await fetch(`${API_BASE_URL}/api/offers?gender=${gender}`);
        if (res.ok) {
          const data = await res.json();
          setOffers(data);

          // Auto-trigger the popup after a 3-second delay, but only ONCE per browser session
          // and only if there is at least one active offer.
          if (data.length > 0) {
            const hasSeenPopup = sessionStorage.getItem('salon_seen_offer_popup');
            if (!hasSeenPopup) {
              const timer = setTimeout(() => {
                setIsModalOpen(true);
                sessionStorage.setItem('salon_seen_offer_popup', 'true');
              }, 3000);
              return () => clearTimeout(timer);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching offers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOffers();
  }, [gender]);

  const triggerUnwrap = () => {
    setIsUnwrapped(true);
    setShowSparkles(true);
    // Hide sparkles after animation completes
    setTimeout(() => {
      setShowSparkles(false);
    }, 2500);
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  const handleBookOffer = (offer) => {
    const phone = '9984527769';
    const message = `Hello New Look Salon! I want to claim the offer "${offer.title}"${
      offer.discountCode ? ` (Code: ${offer.discountCode})` : ''
    }. Please let me know available slots to book this.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset unwrapped state so they can unwrap it again from the floating button
    setTimeout(() => {
      setIsUnwrapped(false);
    }, 400);
  };

  if (loading) {
    return null; // Don't block the UI with a big loading spinner for offers
  }

  // If there are no offers, do not display anything
  if (offers.length === 0) {
    return null;
  }

  // Find the primary featured offer for the pop-up (usually the newest one)
  const featuredOffer = offers[0];

  // Helper to generate random particles for pure CSS confetti
  const sparklesArray = Array.from({ length: 45 }, (_, i) => {
    const angle = (i * 360) / 45 + Math.random() * 15;
    const distance = 80 + Math.random() * 120;
    const size = 6 + Math.random() * 10;
    const color = i % 3 === 0 ? '#ffea7a' : i % 3 === 1 ? '#c5a880' : '#ffffff';
    const delay = Math.random() * 0.4;
    return { angle, distance, size, color, delay };
  });

  return (
    <>
      {/* 1. FLOATING GIFT TRIGGER BUTTON */}
      <button
        className="floating-gift-trigger"
        onClick={() => {
          setIsModalOpen(true);
          setIsUnwrapped(false);
        }}
        title="Unwrap Special Offers!"
      >
        <div className="gift-pulse-ring"></div>
        <Gift size={28} className="gift-icon-bounce" />
        <span className="gift-tooltip">Special Offers!</span>
      </button>

      {/* 2. MAIN OFFERS SECTION ON HOME PAGE */}
      <section className="offers-section" id="offers">
        <div className="section-header">
          <h2>
            Exclusive <span>Offers & Deals</span>
          </h2>
          <div className="divider"></div>
          <p>Treat yourself with our special seasonal promotions and discounts. Don't wait, book your slots now!</p>
        </div>

        <div className="offers-grid-container max-w-7xl mx-auto px-4">
          <div className="offers-display-grid">
            {offers.map((offer) => (
              <div 
                key={offer._id} 
                className="offer-card-wrapper glass-panel animate-slide-up"
              >
                {offer.imageUrl ? (
                  <div className="offer-card-banner">
                    <img src={offer.imageUrl} alt={offer.title} />
                    {offer.discountValue && (
                      <div className="offer-badge-value">
                        {offer.discountValue}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="offer-card-ticket-header">
                    <Gift size={40} className="ticket-icon" />
                    <span className="ticket-badge">{offer.discountValue || 'SPECIAL DEAL'}</span>
                  </div>
                )}

                <div className="offer-card-content">
                  <div className="offer-title-row">
                    <h3>{offer.title}</h3>
                  </div>
                  <p className="offer-description">{offer.description}</p>

                  <div className="offer-meta-row">
                    {offer.expiryDate && (
                      <div className="offer-expiry">
                        <Calendar size={14} />
                        <span>Expires: {new Date(offer.expiryDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    <span className={`offer-gender-tag ${offer.gender}`}>
                      Target: {offer.gender === 'both' ? 'All Sessions' : offer.gender === 'men' ? 'Gentlemen' : 'Ladies'}
                    </span>
                  </div>

                  <div className="offer-action-area">
                    {offer.discountCode ? (
                      <div className="offer-code-copy-box">
                        <span className="code-text">{offer.discountCode}</span>
                        <button
                          className="copy-btn"
                          onClick={() => handleCopyCode(offer.discountCode)}
                          title="Copy Code"
                        >
                          {copiedCode === offer.discountCode ? (
                            <Check size={16} className="text-emerald" />
                          ) : (
                            <Copy size={16} />
                          )}
                          <span>{copiedCode === offer.discountCode ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    ) : (
                      <div className="offer-code-spacer">Apply on booking</div>
                    )}

                    <button 
                      className="btn-gold offer-booking-cta"
                      onClick={() => handleBookOffer(offer)}
                    >
                      <MessageSquare size={16} />
                      <span>Book Slot Now</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE CONFETTI & GIFT BOX MODAL */}
      {isModalOpen && (
        <div className="gift-modal-overlay">
          <div className="gift-modal-wrapper glass-panel">
            <button className="gift-modal-close" onClick={handleCloseModal}>
              <X size={20} />
            </button>

            {/* UNOPENED STATE: Clicking the Gift Box opens it */}
            {!isUnwrapped ? (
              <div className="gift-unopened-view" onClick={triggerUnwrap}>
                <div className="gift-unopened-glow"></div>
                <div className="interactive-gift-box">
                  <div className="gift-box-lid"></div>
                  <div className="gift-box-ribbon-vertical"></div>
                  <div className="gift-box-ribbon-horizontal"></div>
                  <div className="gift-box-body"></div>
                </div>
                <h2 className="gift-box-prompt">You've Got a Gift!</h2>
                <p className="gift-box-subprompt">Tap the box to unlock your exclusive offer</p>
              </div>
            ) : (
              /* OPENED STATE: Shows Confetti Sparkles, then the active offer banner */
              <div className="gift-opened-view">
                {/* CSS Sparkle Confetti Explosion */}
                {showSparkles && (
                  <div className="sparkles-container">
                    {sparklesArray.map((spark, idx) => (
                      <div
                        key={idx}
                        className="sparkle-particle"
                        style={{
                          '--angle': `${spark.angle}deg`,
                          '--dist': `${spark.distance}px`,
                          '--size': `${spark.size}px`,
                          backgroundColor: spark.color,
                          animationDelay: `${spark.delay}s`,
                        }}
                      />
                    ))}
                  </div>
                )}

                <div className="gift-opened-content animate-pop-in">
                  <div className="opened-header">
                    <Sparkles className="sparkles-gold-icon" size={24} />
                    <h2>OFFER UNLOCKED!</h2>
                    <Sparkles className="sparkles-gold-icon" size={24} />
                  </div>

                  {featuredOffer.imageUrl ? (
                    <div className="opened-banner-container">
                      <img src={featuredOffer.imageUrl} alt={featuredOffer.title} className="opened-banner-img" />
                    </div>
                  ) : (
                    <div className="opened-ticket-container">
                      <div className="ticket-inner">
                        <span className="ticket-accent">{featuredOffer.discountValue || 'FREE GIFT'}</span>
                        <h3>{featuredOffer.title}</h3>
                        <p>{featuredOffer.description}</p>
                      </div>
                    </div>
                  )}

                  {featuredOffer.imageUrl && (
                    <div className="opened-details">
                      <h3>{featuredOffer.title}</h3>
                      <p>{featuredOffer.description}</p>
                    </div>
                  )}

                  <div className="opened-action-box">
                    {featuredOffer.discountCode && (
                      <div className="opened-code-box">
                        <span className="code-label">PROMO CODE:</span>
                        <div className="code-copier" onClick={() => handleCopyCode(featuredOffer.discountCode)}>
                          <span className="code-value">{featuredOffer.discountCode}</span>
                          {copiedCode === featuredOffer.discountCode ? <Check size={16} className="text-emerald" /> : <Copy size={16} />}
                        </div>
                      </div>
                    )}

                    <div className="opened-buttons">
                      <button 
                        className="btn-gold opened-claim-btn"
                        onClick={() => handleBookOffer(featuredOffer)}
                      >
                        <MessageSquare size={18} />
                        <span>Book Slot via WhatsApp</span>
                      </button>
                      <button className="btn-outline opened-close-btn" onClick={handleCloseModal}>
                        See Other Offers
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PREMIUM CSS STYLING SPECIFIC TO OFFERS */}
      <style dangerouslySetInnerHTML={{ __html: `
        /* Offers Section Layout */
        .offers-section {
          background-color: var(--bg-secondary);
          position: relative;
          z-index: 10;
        }

        .offers-display-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 2.2rem;
          margin-top: 1rem;
        }

        .offer-card-wrapper {
          display: flex;
          flex-direction: column;
          border-radius: 12px;
          overflow: hidden;
          background: rgba(18, 18, 22, 0.7);
          border: 1px solid rgba(197, 168, 128, 0.12);
          transition: var(--transition-smooth);
          height: 100%;
        }

        .offer-card-wrapper:hover {
          transform: translateY(-8px);
          border-color: rgba(197, 168, 128, 0.4);
          box-shadow: 0 12px 30px rgba(197, 168, 128, 0.1);
        }

        .offer-card-banner {
          position: relative;
          height: 240px;
          overflow: hidden;
          background: #070709;
          display: flex;
          align-items: center;
          justify-content: center;
          border-bottom: 1px solid rgba(197, 168, 128, 0.1);
        }

        .offer-card-banner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          transition: var(--transition-smooth);
        }

        .offer-card-wrapper:hover .offer-card-banner img {
          transform: scale(1.05);
        }

        .offer-badge-value {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background: var(--gold-gradient);
          color: #0c0c0e;
          font-weight: 800;
          font-size: 0.9rem;
          padding: 4px 12px;
          border-radius: 4px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.5);
          letter-spacing: 0.05em;
        }

        .offer-card-ticket-header {
          height: 160px;
          background: linear-gradient(135deg, #18181f 0%, #0d0d10 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          border-bottom: 2px dashed rgba(197, 168, 128, 0.15);
          position: relative;
        }

        /* Circular cutouts for coupon look */
        .offer-card-ticket-header::before,
        .offer-card-ticket-header::after {
          content: '';
          position: absolute;
          bottom: -10px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background-color: var(--bg-secondary);
        }
        .offer-card-ticket-header::before { left: -10px; }
        .offer-card-ticket-header::after { right: -10px; }

        .ticket-icon {
          color: var(--gold-primary);
          animation: slow-wiggle 4s ease-in-out infinite;
        }

        .ticket-badge {
          background: rgba(197, 168, 128, 0.1);
          border: 1px solid var(--gold-primary);
          color: var(--gold-primary);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          letter-spacing: 0.05em;
        }

        .offer-card-content {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          gap: 12px;
        }

        .offer-title-row h3 {
          font-size: 1.25rem;
          font-family: var(--font-serif);
          font-weight: 700;
          color: #ffffff;
        }

        .offer-description {
          font-size: 0.9rem;
          color: var(--text-secondary);
          line-height: 1.5;
          flex-grow: 1;
        }

        .offer-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.75rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255,255,255,0.04);
          padding-top: 10px;
          margin-top: 5px;
        }

        .offer-expiry {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .offer-gender-tag {
          font-weight: 700;
          text-transform: uppercase;
          font-size: 0.65rem;
          padding: 2px 8px;
          border-radius: 10px;
        }

        .offer-gender-tag.both {
          background: rgba(197, 168, 128, 0.1);
          color: var(--gold-primary);
        }

        .offer-gender-tag.men {
          background: rgba(59, 130, 246, 0.1);
          color: #60a5fa;
        }

        .offer-gender-tag.women {
          background: rgba(236, 72, 153, 0.1);
          color: #f472b6;
        }

        .offer-action-area {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 8px;
        }

        .offer-code-copy-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.02);
          border: 1px dashed rgba(197, 168, 128, 0.25);
          padding: 8px 12px;
          border-radius: 6px;
        }

        .code-text {
          font-family: monospace;
          font-size: 1rem;
          font-weight: 700;
          color: var(--gold-light);
          letter-spacing: 0.05em;
        }

        .copy-btn {
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .copy-btn:hover {
          color: var(--gold-primary);
        }

        .text-emerald {
          color: #10b981;
        }

        .offer-code-spacer {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: center;
          font-style: italic;
          padding: 8px 0;
        }

        .offer-booking-cta {
          width: 100%;
          justify-content: center;
          padding: 0.7rem;
          font-size: 0.85rem;
        }

        /* Floating Gift Box Trigger Button */
        .floating-gift-trigger {
          position: fixed;
          bottom: 30px;
          left: 30px;
          background: var(--gold-gradient);
          color: #0c0c0e;
          width: 56px;
          height: 56px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 6px 20px rgba(197, 168, 128, 0.4);
          z-index: 999;
          cursor: pointer;
          border: none;
          transition: var(--transition-smooth);
        }

        .floating-gift-trigger:hover {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 8px 25px rgba(197, 168, 128, 0.6);
        }

        .gift-pulse-ring {
          position: absolute;
          width: 100%;
          height: 100%;
          border: 2px solid var(--gold-primary);
          border-radius: 50%;
          animation: ring-pulse 2s infinite ease-out;
        }

        .gift-icon-bounce {
          animation: slow-bounce 2s infinite ease-in-out;
        }

        .gift-tooltip {
          position: absolute;
          left: 70px;
          background: rgba(8, 8, 10, 0.95);
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          white-space: nowrap;
          border: 1px solid var(--gold-primary);
          pointer-events: none;
          opacity: 0;
          transform: translateX(-10px);
          transition: var(--transition-smooth);
          box-shadow: 0 4px 15px rgba(0,0,0,0.5);
        }

        .floating-gift-trigger:hover .gift-tooltip {
          opacity: 1;
          transform: translateX(0);
        }

        /* Interactive Gift Modal */
        .gift-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.4s ease forwards;
        }

        .gift-modal-wrapper {
          width: 100%;
          max-width: 520px;
          padding: 2.5rem;
          border-color: rgba(197, 168, 128, 0.25);
          box-shadow: 0 20px 50px rgba(0,0,0,0.6), inset 0 0 40px rgba(197, 168, 128, 0.05);
          position: relative;
          overflow: hidden;
        }

        .gift-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
          z-index: 10;
        }

        .gift-modal-close:hover {
          color: #ffffff;
          transform: scale(1.1);
        }

        /* Unopened Gift State */
        .gift-unopened-view {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 0;
          cursor: pointer;
        }

        .gift-unopened-glow {
          position: absolute;
          width: 250px;
          height: 250px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(197, 168, 128, 0.15) 0%, rgba(197,168,128,0) 70%);
          animation: rotate-glow 8s linear infinite;
        }

        .interactive-gift-box {
          position: relative;
          width: 120px;
          height: 120px;
          margin-bottom: 2rem;
          animation: gentle-wobble 2.5s ease-in-out infinite;
        }

        .interactive-gift-box:hover {
          animation: rapid-shake 0.5s ease-in-out infinite;
        }

        /* Gift box elements */
        .gift-box-lid {
          position: absolute;
          top: 0;
          left: -5px;
          width: 130px;
          height: 25px;
          background: linear-gradient(135deg, var(--gold-primary), var(--gold-dark));
          border-radius: 3px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.3);
          z-index: 5;
        }

        .gift-box-body {
          position: absolute;
          top: 25px;
          left: 5px;
          width: 110px;
          height: 95px;
          background: linear-gradient(135deg, #16161c, #0a0a0d);
          border: 1px solid rgba(197, 168, 128, 0.2);
          border-radius: 0 0 5px 5px;
          z-index: 1;
        }

        .gift-box-ribbon-vertical {
          position: absolute;
          top: 0;
          left: 50px;
          width: 20px;
          height: 120px;
          background: linear-gradient(to bottom, var(--gold-light), var(--gold-primary));
          z-index: 3;
          box-shadow: 2px 0 5px rgba(0,0,0,0.2);
        }

        .gift-box-ribbon-horizontal {
          position: absolute;
          top: 45px;
          left: 5px;
          width: 110px;
          height: 20px;
          background: linear-gradient(to right, var(--gold-light), var(--gold-primary));
          z-index: 3;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .gift-box-prompt {
          font-family: var(--font-serif);
          font-size: 1.8rem;
          color: #ffffff;
          margin-bottom: 5px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          text-align: center;
        }

        .gift-box-subprompt {
          color: var(--gold-primary);
          font-size: 0.9rem;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-align: center;
        }

        /* Opened Gift State */
        .gift-opened-view {
          position: relative;
          width: 100%;
        }

        .opened-header {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 1.5rem;
        }

        .opened-header h2 {
          font-size: 1.6rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sparkles-gold-icon {
          color: var(--gold-primary);
          animation: slow-wiggle 2s infinite ease-in-out;
        }

        .opened-banner-container {
          width: 100%;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(197, 168, 128, 0.3);
          box-shadow: 0 8px 25px rgba(0,0,0,0.5);
          margin-bottom: 1.5rem;
          background: #070709;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .opened-banner-img {
          width: 100%;
          display: block;
          max-height: 380px;
          object-fit: contain;
        }

        .opened-ticket-container {
          background: linear-gradient(135deg, #181822 0%, #0d0d10 100%);
          border: 1.5px dashed var(--gold-primary);
          border-radius: 8px;
          padding: 2rem;
          text-align: center;
          margin-bottom: 1.5rem;
          box-shadow: 0 8px 25px rgba(0,0,0,0.5);
        }

        .ticket-inner {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .ticket-accent {
          background: var(--gold-gradient);
          color: #0c0c0e;
          font-weight: 800;
          font-size: 1.1rem;
          padding: 4px 16px;
          border-radius: 4px;
          width: fit-content;
          margin: 0 auto;
          letter-spacing: 0.05em;
        }

        .ticket-inner h3 {
          font-size: 1.4rem;
          font-family: var(--font-serif);
          color: #ffffff;
        }

        .ticket-inner p {
          color: var(--text-secondary);
          font-size: 0.9rem;
          line-height: 1.5;
        }

        .opened-details {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .opened-details h3 {
          font-size: 1.3rem;
          color: #ffffff;
          margin-bottom: 5px;
        }

        .opened-details p {
          color: var(--text-secondary);
          font-size: 0.95rem;
        }

        .opened-action-box {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .opened-code-box {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(197, 168, 128, 0.2);
          padding: 10px;
          border-radius: 6px;
        }

        .code-label {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--text-muted);
          letter-spacing: 0.05em;
        }

        .code-copier {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(197, 168, 128, 0.1);
          padding: 4px 12px;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .code-copier:hover {
          background: rgba(197, 168, 128, 0.2);
        }

        .code-value {
          font-family: monospace;
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--gold-light);
          letter-spacing: 0.05em;
        }

        .opened-buttons {
          display: flex;
          gap: 12px;
        }

        .opened-claim-btn {
          flex: 1.4;
          justify-content: center;
          padding: 0.9rem;
          font-size: 0.9rem;
        }

        .opened-close-btn {
          flex: 1;
          justify-content: center;
          padding: 0.9rem;
          font-size: 0.9rem;
        }

        /* Sparkle particles confetti explosion styles */
        .sparkles-container {
          position: absolute;
          top: 40%;
          left: 50%;
          width: 0;
          height: 0;
          pointer-events: none;
          z-index: 8;
        }

        .sparkle-particle {
          position: absolute;
          width: var(--size);
          height: var(--size);
          border-radius: 50%;
          opacity: 0;
          animation: burst 2s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Animations */
        @keyframes burst {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          15% {
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(var(--angle)) translateY(calc(-1 * var(--dist))) scale(1);
            opacity: 0;
          }
        }

        @keyframes ring-pulse {
          0% {
            transform: scale(0.95);
            opacity: 0.8;
          }
          70% {
            transform: scale(1.6);
            opacity: 0;
          }
          100% {
            transform: scale(0.95);
            opacity: 0;
          }
        }

        @keyframes slow-bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        @keyframes slow-wiggle {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(8deg); }
        }

        @keyframes rotate-glow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes gentle-wobble {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(-3deg) scale(1.02); }
          75% { transform: rotate(3deg) scale(0.98); }
        }

        @keyframes rapid-shake {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 1px) rotate(-1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-1px, 2px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(1deg); }
        }

        .animate-pop-in {
          animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0.7) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @media (max-width: 640px) {
          .opened-buttons {
            flex-direction: column;
          }
          .floating-gift-trigger {
            bottom: 20px;
            left: 20px;
            width: 48px;
            height: 48px;
          }
          .floating-gift-trigger .gift-icon-bounce {
            width: 22px;
            height: 22px;
          }
          .gift-modal-wrapper {
            padding: 1.5rem;
          }
        }
      ` }} />
    </>
  );
}

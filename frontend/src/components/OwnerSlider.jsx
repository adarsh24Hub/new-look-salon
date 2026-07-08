import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Award, User, Sparkles, Percent, Calendar } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function OwnerSlider({ gender }) {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(true);
  const timeoutRef = useRef(null);

  // Fetch active slides from database
  useEffect(() => {
    const fetchSlides = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_BASE_URL}/api/slides`);
        if (res.ok) {
          const data = await res.json();
          setSlides(data);
        }
      } catch (err) {
        console.error('Error fetching slides:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Handle slide autoplay rotation
  useEffect(() => {
    // Clear any existing timer
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (slides.length <= 1) return;

    // Trigger next slide if playing and not hovered
    if (isPlaying && !isHovered) {
      timeoutRef.current = setTimeout(() => {
        handleNextSlide();
      }, 6000); // 6 seconds slow rotation
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, isPlaying, isHovered, slides]);

  const handleNextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const togglePlayPause = (e) => {
    e.stopPropagation(); // Avoid triggering any container click handler
    setIsPlaying(!isPlaying);
  };

  const handleWhatsAppAction = (slide) => {
    const phone = '06391763738';
    const message = `Hello New Look Salon! I read the homepage slide "${slide.title}" and would like to inquire or book a service.`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  // Helper to get category details
  const getCategoryBadge = (category) => {
    switch (category) {
      case 'owner':
        return (
          <div className="slide-badge badge-owner">
            <User size={14} />
            <span>Founder & Expert</span>
          </div>
        );
      case 'certificate':
        return (
          <div className="slide-badge badge-cert">
            <Award size={14} />
            <span>Award & Certification</span>
          </div>
        );
      case 'offer':
        return (
          <div className="slide-badge badge-offer">
            <Percent size={14} />
            <span>Exclusive Deal</span>
          </div>
        );
      default:
        return (
          <div className="slide-badge badge-other">
            <Sparkles size={14} />
            <span>Announcement</span>
          </div>
        );
    }
  };

  if (loading || slides.length === 0) {
    return null; // Silent return if loading or empty
  }

  const activeSlide = slides[currentIndex];

  return (
    <section 
      className="owner-slider-section" 
      id="about-owner"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="section-header">
        <h2><span>OUR ROOTS</span> & AWARDS</h2>
        <div className="divider"></div>
        <p>Explore the legacy of excellence, owner biography, credentials, and special deals that set us apart.</p>
      </div>

      <div className="slider-wrapper">
        <div className="slider-container glass-panel animate-fade-in">
          {/* Main Content Grid */}
          <div className="slide-grid" key={currentIndex}>
            
            {/* Left Side: Photo with custom shape & frame */}
            <div className="slide-image-container">
              <div className="image-frame">
                <img 
                  src={activeSlide.imageUrl} 
                  alt={activeSlide.title} 
                  className="slide-img"
                />
                <div className="image-overlay-glow"></div>
              </div>
            </div>

            {/* Right Side: Information Content */}
            <div className="slide-text-container">
              <div className="slide-meta-row">
                {getCategoryBadge(activeSlide.category)}
                
                {/* Visual Status Indicator: Active autoplay status */}
                {(!isPlaying || isHovered) && (
                  <span className="paused-pill">
                    <Pause size={10} style={{ marginRight: '4px' }} />
                    PAUSED
                  </span>
                )}
              </div>

              <h3 className="slide-title">{activeSlide.title}</h3>
              <p className="slide-description">{activeSlide.description}</p>

              {/* Call-to-action custom actions depending on slide category */}
              <div className="slide-action-row">
                {activeSlide.category === 'offer' ? (
                  <button 
                    className="btn-gold btn-slide-cta"
                    onClick={() => handleWhatsAppAction(activeSlide)}
                  >
                    <span>Claim Offer Now</span>
                  </button>
                ) : activeSlide.category === 'owner' ? (
                  <button 
                    className="btn-outline btn-slide-cta"
                    onClick={() => handleWhatsAppAction(activeSlide)}
                  >
                    <span>Consult with Owner</span>
                  </button>
                ) : (
                  <button 
                    className="btn-outline btn-slide-cta"
                    onClick={() => handleWhatsAppAction(activeSlide)}
                  >
                    <span>Inquire Details</span>
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Slider Navigation & Pause Interface */}
          <div className="slider-controls-bar">
            {/* Left navigation arrow */}
            <button 
              className="ctrl-nav-btn" 
              onClick={handlePrevSlide}
              title="Previous Slide"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Play/Pause Button */}
            <button 
              className={`ctrl-play-pause-btn ${!isPlaying ? 'is-paused' : ''}`}
              onClick={togglePlayPause}
              title={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
              aria-label={isPlaying ? "Pause Autoplay" : "Play Autoplay"}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            {/* Pagination dots */}
            <div className="slider-dots-group">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  className={`slider-dot-indicator ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => handleDotClick(idx)}
                  title={`Go to slide ${idx + 1}`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>

            {/* Right navigation arrow */}
            <button 
              className="ctrl-nav-btn" 
              onClick={handleNextSlide}
              title="Next Slide"
              aria-label="Next Slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .owner-slider-section {
          background-color: var(--bg-primary);
          position: relative;
          z-index: 5;
        }

        .slider-wrapper {
          max-width: 1100px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .slider-container {
          position: relative;
          width: 100%;
          min-height: 480px;
          padding: 3rem;
          overflow: hidden;
          border-color: rgba(197, 168, 128, 0.25);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .slide-grid {
          display: grid;
          grid-template-columns: 1.1fr 1.3fr;
          gap: 3.5rem;
          align-items: center;
          animation: slideFadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideFadeIn {
          from {
            opacity: 0;
            transform: translateX(15px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        /* Image styling */
        .slide-image-container {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .image-frame {
          position: relative;
          width: 100%;
          height: 340px;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(197, 168, 128, 0.3);
          box-shadow: 0 10px 25px rgba(0,0,0,0.4);
        }

        .slide-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 6s ease;
        }

        .slider-container:hover .slide-img {
          transform: scale(1.05);
        }

        .image-overlay-glow {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.4) 0%, transparent 60%);
          pointer-events: none;
        }

        /* Text styling */
        .slide-text-container {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
          text-align: left;
        }

        .slide-meta-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .slide-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 30px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .badge-owner {
          background-color: rgba(197, 168, 128, 0.15);
          color: var(--gold-primary);
          border: 1px solid rgba(197, 168, 128, 0.3);
        }

        .badge-cert {
          background-color: rgba(168, 85, 247, 0.15);
          color: #c084fc;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .badge-offer {
          background-color: rgba(236, 72, 153, 0.15);
          color: #f472b6;
          border: 1px solid rgba(236, 72, 153, 0.3);
        }

        .badge-other {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }

        .paused-pill {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          display: inline-flex;
          align-items: center;
        }

        .slide-title {
          font-size: 2.2rem;
          line-height: 1.25;
          color: #ffffff;
          font-family: var(--font-serif);
        }

        .slide-description {
          font-size: 1.05rem;
          color: var(--text-secondary);
          line-height: 1.7;
        }

        .slide-action-row {
          margin-top: 1rem;
        }

        .btn-slide-cta {
          padding: 0.7rem 1.6rem;
          font-size: 0.85rem;
        }

        /* Controls bar */
        .slider-controls-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.5rem;
          margin-top: 2.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          padding-top: 1.5rem;
        }

        .ctrl-nav-btn {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: var(--text-secondary);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .ctrl-nav-btn:hover {
          background: rgba(197, 168, 128, 0.1);
          border-color: var(--gold-primary);
          color: #ffffff;
        }

        .ctrl-play-pause-btn {
          background: rgba(197, 168, 128, 0.15);
          border: 1px solid rgba(197, 168, 128, 0.3);
          color: var(--gold-primary);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-smooth);
        }

        .ctrl-play-pause-btn:hover {
          background: var(--gold-primary);
          color: #0d0d0f;
          box-shadow: 0 0 15px var(--accent-glow);
        }

        .ctrl-play-pause-btn.is-paused {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
          color: #ef4444;
        }

        .ctrl-play-pause-btn.is-paused:hover {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 0 15px rgba(239, 68, 68, 0.3);
        }

        .slider-dots-group {
          display: flex;
          gap: 8px;
        }

        .slider-dot-indicator {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .slider-dot-indicator:hover {
          background: rgba(255, 255, 255, 0.5);
        }

        .slider-dot-indicator.active {
          background: var(--gold-primary);
          width: 24px;
          border-radius: 4px;
          box-shadow: 0 0 8px var(--accent-glow);
        }

        /* Mobile responsiveness */
        @media (max-width: 900px) {
          .slider-container {
            padding: 2rem 1.5rem;
            min-height: auto;
          }

          .slide-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .image-frame {
            height: 260px;
          }

          .slide-title {
            font-size: 1.6rem;
          }

          .slide-description {
            font-size: 0.95rem;
          }
        }
      `}} />
    </section>
  );
}

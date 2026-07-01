import React, { useState, useEffect, useRef } from 'react';
import { Play, Video, Instagram, Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '../config';

const FALLBACK_REELS = [
  {
    _id: 'r1',
    title: 'Precision Fade & Grooming Reel',
    url: 'https://www.instagram.com/reel/C3z4p4qM8wZ/',
    embedUrl: 'https://www.instagram.com/reel/C8_k-b0J5g2/embed/captioned/', // mock or actual public embed
    platform: 'instagram',
    gender: 'men'
  },
  {
    _id: 'r2',
    title: 'Bridal Makeover Transformation',
    url: 'https://www.instagram.com/reel/C321m9oMxX3/',
    embedUrl: 'https://www.instagram.com/reel/C9_k-b0J5g3/embed/captioned/',
    platform: 'instagram',
    gender: 'women'
  }
];

export default function Reels({ gender }) {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    fetchReels();
  }, []);

  const fetchReels = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/reels`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setReels(data);
        } else {
          setReels(FALLBACK_REELS);
        }
      } else {
        setReels(FALLBACK_REELS);
      }
    } catch (err) {
      console.error('Error fetching reels, using fallbacks:', err);
      setReels(FALLBACK_REELS);
    } finally {
      setLoading(false);
    }
  };

  // Filter reels matching active gender context
  const filteredReels = reels.filter(reel => {
    return gender === 'all' || reel.gender === 'both' || reel.gender === gender;
  });

  return (
    <section id="reels" className="reels-section">
      <div className="section-header">
        <h2>Trending <span>Reels & Videos</span></h2>
        <div className="divider"></div>
        <p>Watch our latest work and viral transformations directly from our Instagram & Facebook pages.</p>
      </div>

      {loading ? (
        <div className="reels-loading">
          <div className="spinner"></div>
          <p>Loading trending videos...</p>
        </div>
      ) : (
        filteredReels.length > 0 && (
          <div className="scroll-wrapper">
            <button className="scroll-btn left" onClick={() => scroll('left')} aria-label="Scroll left">
              <ChevronLeft size={20} />
            </button>
            <div className="reels-grid" ref={scrollRef}>
              {filteredReels.map((reel) => (
                <div key={reel._id} className="reel-card glass-panel">
                  <div className="reel-header-info">
                    {reel.platform === 'instagram' ? (
                      <Instagram size={18} className="platform-icon insta" />
                    ) : (
                      <Facebook size={18} className="platform-icon fb" />
                    )}
                    <h3>{reel.title}</h3>
                  </div>

                  {/* Video/Iframe Container */}
                  <div className="reel-video-container">
                    <iframe
                      src={reel.embedUrl}
                      title={reel.title}
                      className="reel-iframe"
                      scrolling="no"
                      allowFullScreen
                      allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                      frameBorder="0"
                    ></iframe>
                  </div>
                  
                  <div className="reel-footer-actions">
                    <a href={reel.url} target="_blank" rel="noopener noreferrer" className="view-original-link">
                      Open on {reel.platform === 'instagram' ? 'Instagram' : 'Facebook'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <button className="scroll-btn right" onClick={() => scroll('right')} aria-label="Scroll right">
              <ChevronRight size={20} />
            </button>
          </div>
        )
      )}

      {filteredReels.length === 0 && !loading && (
        <div className="no-reels glass-panel">
          <Video size={48} className="muted-icon" />
          <p>No video reels uploaded for this category yet.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .reels-section {
          background-color: var(--bg-secondary);
        }

        .reels-grid {
          display: flex;
          overflow-x: auto;
          gap: 2.5rem;
          padding: 0.5rem 0.2rem 1.5rem 0.2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) var(--bg-primary);
        }

        .reels-grid::-webkit-scrollbar {
          height: 6px;
        }

        .reels-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }

        .reels-grid::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 3px;
        }

        .reel-card {
          flex: 0 0 320px;
          scroll-snap-align: start;
          padding: 1.5rem;
          border-color: rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          transition: var(--transition-smooth);
        }

        .reel-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .reel-header-info {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          margin-bottom: 1rem;
        }

        .platform-icon {
          flex-shrink: 0;
        }

        .platform-icon.insta {
          color: #e1306c;
        }

        .platform-icon.fb {
          color: #1877f2;
        }

        .reel-header-info h3 {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .reel-video-container {
          position: relative;
          width: 100%;
          padding-top: 135%; /* vertical 4:5 or 9:16 aspect ratio */
          background-color: #050508;
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,0.03);
        }

        .reel-iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 0;
          overflow: hidden;
        }

        .reel-footer-actions {
          margin-top: 1.2rem;
          text-align: center;
        }

        .view-original-link {
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          transition: var(--transition-smooth);
        }

        .view-original-link:hover {
          color: var(--accent-color);
        }

        .reels-loading {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-secondary);
        }

        .no-reels {
          text-align: center;
          padding: 4rem 2rem;
          max-width: 500px;
          margin: 0 auto;
          color: var(--text-secondary);
        }

        .scroll-wrapper {
          position: relative;
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .scroll-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 20;
          background: rgba(8, 8, 10, 0.7);
          border: 1.5px solid var(--accent-color);
          color: var(--accent-color);
          border-radius: 50%;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 15px rgba(0,0,0,0.4);
        }

        .scroll-btn:hover {
          background: var(--accent-color);
          color: #0d0d0f;
          box-shadow: 0 4px 20px var(--accent-glow);
          transform: translateY(-50%) scale(1.05);
        }

        .scroll-btn.left {
          left: -22px;
        }

        .scroll-btn.right {
          right: -22px;
        }

        @media (max-width: 1280px) {
          .scroll-btn.left {
            left: 10px;
          }
          .scroll-btn.right {
            right: 10px;
          }
        }

        @media (max-width: 768px) {
          .scroll-btn {
            display: none;
          }
        }
      `}} />
    </section>
  );
}

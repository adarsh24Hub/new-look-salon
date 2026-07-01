import React, { useState, useEffect } from 'react';
import { Camera, Image as ImageIcon } from 'lucide-react';
import { BACKEND_URL, API_BASE_URL } from '../config';

const FALLBACK_GALLERY = [
  { _id: 'f1', imageUrl: 'https://images.unsplash.com/photo-1593702295094-aec22597af65?q=80&w=600&auto=format&fit=crop', caption: 'Classic Gentlemen Grooming', category: 'hair', gender: 'men' },
  { _id: 'f2', imageUrl: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=600&auto=format&fit=crop', caption: 'Luxury Hair Smoothing treatment', category: 'hair', gender: 'women' },
  { _id: 'f3', imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=600&auto=format&fit=crop', caption: 'High-end Bridal Party Makeup', category: 'makeup', gender: 'women' },
  { _id: 'f4', imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=600&auto=format&fit=crop', caption: 'Relaxing Ayurvedic Full Body Spa', category: 'spa', gender: 'women' },
  { _id: 'f5', imageUrl: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186?q=80&w=600&auto=format&fit=crop', caption: 'Expert Beard Shaving & Trimming', category: 'hair', gender: 'men' },
  { _id: 'f6', imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=600&auto=format&fit=crop', caption: 'Loreal Certified Stylist Training Session', category: 'experience', gender: 'both' },
  { _id: 'f7', imageUrl: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop', caption: 'Hands-on Advanced Hair Colour Workshop', category: 'experience', gender: 'both' },
  { _id: 'f8', imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=600&auto=format&fit=crop', caption: 'Men\'s Hydrating Facial Massage', category: 'spa', gender: 'men' }
];

export default function Gallery({ gender }) {
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/api/gallery`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setPhotos(data);
        } else {
          setPhotos(FALLBACK_GALLERY);
        }
      } else {
        setPhotos(FALLBACK_GALLERY);
      }
    } catch (err) {
      console.error('Error fetching gallery, using fallbacks:', err);
      setPhotos(FALLBACK_GALLERY);
    } finally {
      setLoading(false);
    }
  };

  // Filter photos based on (1) active category filter and (2) active gender mode
  const filteredPhotos = photos.filter(photo => {
    // Check gender context (only show gender-appropriate images + generic/both images)
    const matchesGender = gender === 'all' || photo.gender === 'both' || photo.gender === gender;
    
    // Check category filter
    const matchesCategory = activeFilter === 'all' || photo.category === activeFilter;
    
    return matchesGender && matchesCategory;
  });

  return (
    <section id="gallery" className="gallery-section">
      <div className="section-header">
        <h2>Salon <span>Showcase & Work</span></h2>
        <div className="divider"></div>
        <p>Witness our working experience, certified trainings, and styling transformations.</p>
      </div>

      {/* Category Filter Buttons */}
      <div className="gallery-filters">
        <button 
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All Photos
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'hair' ? 'active' : ''}`}
          onClick={() => setActiveFilter('hair')}
        >
          Hair Styling
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'makeup' ? 'active' : ''}`}
          onClick={() => setActiveFilter('makeup')}
        >
          Makeup & Glow
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'spa' ? 'active' : ''}`}
          onClick={() => setActiveFilter('spa')}
        >
          Spa Treatments
        </button>
        <button 
          className={`filter-btn ${activeFilter === 'experience' ? 'active' : ''}`}
          onClick={() => setActiveFilter('experience')}
        >
          Trainings & Work Experience
        </button>
      </div>

      {/* Gallery Grid */}
      {loading ? (
        <div className="gallery-loading">
          <div className="spinner"></div>
          <p>Loading gallery items...</p>
        </div>
      ) : (
        <div className="gallery-grid">
          {filteredPhotos.map((photo) => (
            <div key={photo._id} className="gallery-item glass-panel">
              <div className="img-container">
                <img src={photo.imageUrl.startsWith('/uploads') ? `${BACKEND_URL}${photo.imageUrl}` : photo.imageUrl} alt={photo.caption || 'Salon Style'} />
                <div className="gallery-item-overlay">
                  <div className="overlay-content">
                    <span className="photo-category">{photo.category.toUpperCase()}</span>
                    <h4 className="photo-caption">{photo.caption || 'New Look Styling'}</h4>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredPhotos.length === 0 && !loading && (
        <div className="no-photos">
          <ImageIcon size={48} className="muted-icon" />
          <p>No photos uploaded for this category yet.</p>
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .gallery-section {
          background-color: var(--bg-primary);
        }

        .gallery-filters {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 1rem;
          margin-bottom: 3.5rem;
          position: relative;
          z-index: 10;
        }

        .filter-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 0.85rem;
          font-weight: 500;
          padding: 0.6rem 1.5rem;
          border-radius: 4px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-btn:hover {
          color: #ffffff;
          border-color: var(--accent-color);
        }

        .filter-btn.active {
          border-color: var(--accent-color);
          color: var(--accent-color);
          background: var(--accent-glow);
        }

        .gallery-grid {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding: 0.5rem 0.2rem 1.5rem 0.2rem;
          max-width: 1200px;
          margin: 0 auto;
          position: relative;
          z-index: 10;
          scroll-snap-type: x mandatory;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) var(--bg-primary);
        }

        .gallery-grid::-webkit-scrollbar {
          height: 6px;
        }

        .gallery-grid::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.03);
          border-radius: 3px;
        }

        .gallery-grid::-webkit-scrollbar-thumb {
          background: var(--accent-color);
          border-radius: 3px;
        }

        .gallery-item {
          flex: 0 0 280px;
          scroll-snap-align: start;
          overflow: hidden;
          padding: 0;
          border-color: rgba(255,255,255,0.05);
          aspect-ratio: 1 / 1;
          border-radius: 8px;
        }

        .img-container {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item:hover img {
          transform: scale(1.1);
        }

        .gallery-item-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.9) 0%, rgba(8, 8, 10, 0.3) 60%, transparent 100%);
          opacity: 0;
          display: flex;
          align-items: flex-end;
          padding: 1.5rem;
          transition: opacity 0.4s ease;
        }

        .gallery-item:hover .gallery-item-overlay {
          opacity: 1;
        }

        .overlay-content {
          transform: translateY(10px);
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gallery-item:hover .overlay-content {
          transform: translateY(0);
        }

        .photo-category {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--accent-color);
          letter-spacing: 0.1em;
          display: block;
          margin-bottom: 4px;
        }

        .photo-caption {
          font-size: 1.05rem;
          color: #ffffff;
          font-weight: 500;
        }

        .gallery-loading {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-secondary);
        }

        .spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(197, 168, 128, 0.1);
          border-top-color: var(--accent-color);
          border-radius: 50%;
          margin: 0 auto 1rem auto;
          animation: spin 1s linear infinite;
        }

        .no-photos {
          text-align: center;
          padding: 4rem 0;
          color: var(--text-secondary);
        }

        .muted-icon {
          color: var(--text-muted);
          margin-bottom: 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}} />
    </section>
  );
}

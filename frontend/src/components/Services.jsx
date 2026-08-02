import React, { useState, useEffect, useRef } from 'react';
import { Scissors, Sparkles, ShieldCheck, HeartHandshake, Search, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL, optimizeCloudinaryUrl, formatPrice } from '../config';

export default function Services({ gender }) {
  const [activeTab, setActiveTab] = useState(gender);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const searchContainerRef = useRef(null);
  const scrollTrackRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getSuggestions = () => {
    if (!searchQuery.trim()) {
      return activeTab === 'men' 
        ? ['Classic Haircut', 'Beard Combo', 'Hair Spa', 'Head Massage', 'Face De-Tan']
        : ['Precision Ladies Hair Cut', 'Eyebrow Threading', 'O3+ Skin Whitening Facial', 'Normal Honey Wax', 'Blowdry & Hair Setting', 'Hair Spa'];
    }
    
    const query = searchQuery.toLowerCase();
    const matching = services
      .filter((service) => {
        const matchesGender = activeTab === 'all' || service.gender === 'both' || service.gender === activeTab;
        const nameMatches = service.name.toLowerCase().includes(query);
        const descMatches = service.desc && service.desc.toLowerCase().includes(query);
        return matchesGender && (nameMatches || descMatches);
      })
      .map(service => service.name);
      
    return [...new Set(matching)].slice(0, 8);
  };

  const suggestions = getSuggestions();

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) => 
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex((prevIndex) => 
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeSuggestionIndex >= 0 && activeSuggestionIndex < suggestions.length) {
        handleSelectSuggestion(suggestions[activeSuggestionIndex]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
    setActiveSuggestionIndex(-1);
  };

  const highlightMatch = (text, query) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${escapeRegExp(query)})`, 'gi'));
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() 
            ? <strong key={i} className="highlighted-text">{part}</strong>
            : part
        )}
      </>
    );
  };

  const escapeRegExp = (string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/api/services`);
      if (res.ok) {
        const data = await res.json();
        setServices(data);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredServices = services.filter((service) => {
    const matchesGender = activeTab === 'all' || service.gender === 'both' || service.gender === activeTab;
    const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (service.desc && service.desc.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGender && matchesCategory && matchesSearch;
  });

  useEffect(() => {
    fetchServices();
  }, []);

  useEffect(() => {
    setActiveTab(gender);
    setSelectedCategory('all');
    setSearchQuery('');
  }, [gender]);

  const scrollPrev = () => {
    const el = scrollTrackRef.current;
    if (el) {
      el.scrollBy({ left: -362, behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    const el = scrollTrackRef.current;
    if (el) {
      el.scrollBy({ left: 362, behavior: 'smooth' });
    }
  };

  const handleBookService = (serviceName) => {
    const phone = '9984527769';
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
          onClick={() => { setActiveTab('men'); setSelectedCategory('all'); }}
        >
          Gentlemen Menu
        </button>
        <button 
          className={`tab-btn ${activeTab === 'women' ? 'active' : ''}`}
          onClick={() => { setActiveTab('women'); setSelectedCategory('all'); }}
        >
          Ladies Menu
        </button>
      </div>

      {/* Search & Category Filter Row */}
      <div className="filter-controls-row">
        <div className="search-box-wrapper" ref={searchContainerRef}>
          <div className="search-input-inner-wrapper">
            <Search className="search-icon-left" size={18} />
            <input 
              type="text" 
              placeholder="Search for a service... (e.g. haircut)" 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onFocus={() => {
                setShowSuggestions(true);
                setActiveSuggestionIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="services-search-input"
            />
            {searchQuery && (
              <button 
                type="button" 
                className="search-clear-btn" 
                onClick={() => {
                  setSearchQuery('');
                  setActiveSuggestionIndex(-1);
                  setShowSuggestions(false);
                }}
                title="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && (suggestions.length > 0) && (
            <div className="suggestions-dropdown glass-panel animate-fade-in">
              <div className="suggestions-header">
                {!searchQuery ? 'Popular Searches' : 'Suggested Services'}
              </div>
              <ul className="suggestions-list">
                {suggestions.map((suggestion, index) => {
                  const isActive = index === activeSuggestionIndex;
                  return (
                    <li 
                      key={index}
                      className={`suggestion-item ${isActive ? 'active' : ''}`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                      onMouseEnter={() => setActiveSuggestionIndex(index)}
                    >
                      <Search size={14} className="suggestion-item-icon" />
                      <span className="suggestion-text">
                        {highlightMatch(suggestion, searchQuery)}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>
        
        <div className="category-filters-wrapper">
          {[
            { id: 'all', label: 'All Services' },
            { id: 'hair', label: 'Hair Styling' },
            { id: 'waxing', label: 'Waxing & Threading' },
            { id: 'facial', label: 'Facial & De-Tan' },
            { id: 'spa', label: 'Spa & Relaxation' },
            { id: 'makeup', label: 'Makeup & Bridal' }
          ].map((cat) => (
            <button
              key={cat.id}
              className={`filter-chip-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 10 }}>
          <p>Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-secondary)', position: 'relative', zIndex: 10 }}>
          <p style={{ fontSize: '1rem', fontStyle: 'italic' }}>No styling services found matching your criteria.</p>
        </div>
      ) : (
        <div className="services-slider-container">
          <button className="slider-nav-btn prev" onClick={scrollPrev} aria-label="Scroll left">
            <ChevronLeft size={20} />
          </button>
          
          <div 
            className="services-scroll-track" 
            ref={scrollTrackRef}
          >
            {filteredServices.map((service, index) => (
              <div key={index} className="service-card glass-panel">
                <div className="service-image-box">
                  <img src={optimizeCloudinaryUrl(service.imageUrl, 500)} alt={service.name} className="service-card-img" />
                  <div className="service-image-overlay"></div>
                </div>
                
                <div className="service-card-content">
                  <div className="service-card-header">
                    <div className="service-icon-box">
                      {activeTab === 'men' ? <Scissors size={18} /> : <Sparkles size={18} />}
                    </div>
                    <span className="service-price">{formatPrice(service.price)}</span>
                  </div>
                  <h3 className="service-title">{service.name}</h3>
                  <p className="service-desc">{service.desc}</p>
                  
                  <button className="service-book-btn" onClick={() => handleBookService(service.name)}>
                    Book Service
                  </button>
                </div>
              </div>
            ))}
          </div>

          <button className="slider-nav-btn next" onClick={scrollNext} aria-label="Scroll right">
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* AI Salon Banner Card */}
      <div className="services-promo-banner glass-panel animate-fade-in" style={{ backgroundImage: `url('/services_banner.png')` }}>
        <div className="promo-overlay"></div>
        <div className="promo-content">
          <span className="promo-tag">NEW LOOK PREMIUM EXPERIENCE</span>
          <h2>Ready for a Luxury Makeover?</h2>
          <p>
            Experience premium aesthetics, top-tier international products (L'Oréal, O3+), and separate dedicated spaces for gentlemen and ladies. Rest assured with our fully air-conditioned, ultra-hygienic facility.
          </p>
          <div className="promo-actions">
            <button className="btn-gold" onClick={() => handleBookService('Premium Luxury Treatment')}>
              Book Appointment
            </button>
            <a href="tel:09984527769" className="btn-outline" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Call 099845 27769
            </a>
          </div>
        </div>
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
          padding-top: 2rem;
        }

        .services-tabs {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
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

        /* Filter Row Styles */
        .filter-controls-row {
          max-width: 1200px;
          margin: 0 auto 3rem auto;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          padding: 0 1rem;
          position: relative;
          z-index: 40; /* Ensure search suggestions stay on top of the list */
        }

        .search-box-wrapper {
          width: 100%;
          max-width: 500px;
          margin: 0;
          position: relative;
          z-index: 50; /* Stay on top of other filter chips */
        }

        .search-input-inner-wrapper {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
        }

        .search-icon-left {
          position: absolute;
          left: 1.2rem;
          color: rgba(255, 255, 255, 0.4);
          pointer-events: none;
          transition: var(--transition-smooth);
        }

        .search-input-inner-wrapper:focus-within .search-icon-left {
          color: var(--accent-color);
        }

        .services-search-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 30px;
          padding: 0.8rem 3rem 0.8rem 2.8rem;
          color: #ffffff;
          font-size: 0.95rem;
          text-align: left;
          transition: var(--transition-smooth);
        }

        .services-search-input:focus {
          border-color: var(--accent-color);
          outline: none;
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 0 15px rgba(197, 168, 128, 0.15);
        }

        .search-clear-btn {
          position: absolute;
          right: 1.2rem;
          background: transparent;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 4px;
          border-radius: 50%;
          transition: var(--transition-smooth);
        }

        .search-clear-btn:hover {
          color: #ffffff;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Suggestions Dropdown Styles */
        .suggestions-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          width: 100%;
          background: rgba(13, 13, 15, 0.9);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(197, 168, 128, 0.15);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          z-index: 100;
          overflow: hidden;
          text-align: left;
        }

        .suggestions-header {
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.1rem;
          color: var(--accent-color);
          padding: 0.8rem 1.2rem 0.4rem 1.2rem;
          font-weight: 700;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          opacity: 0.8;
        }

        .suggestions-list {
          list-style: none;
          margin: 0;
          padding: 0.4rem 0;
          max-height: 250px;
          overflow-y: auto;
        }

        .suggestions-list::-webkit-scrollbar {
          width: 6px;
        }

        .suggestions-list::-webkit-scrollbar-track {
          background: transparent;
        }

        .suggestions-list::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
        }

        .suggestions-list::-webkit-scrollbar-thumb:hover {
          background: rgba(197, 168, 128, 0.3);
        }

        .suggestion-item {
          padding: 0.7rem 1.2rem;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          cursor: pointer;
          color: var(--text-secondary);
          transition: var(--transition-smooth);
          font-size: 0.9rem;
        }

        .suggestion-item:hover, .suggestion-item.active {
          background: rgba(197, 168, 128, 0.1);
          color: #ffffff;
        }

        .suggestion-item-icon {
          color: rgba(255, 255, 255, 0.25);
          flex-shrink: 0;
        }

        .suggestion-item:hover .suggestion-item-icon, .suggestion-item.active .suggestion-item-icon {
          color: var(--accent-color);
        }

        .suggestion-text {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .highlighted-text {
          color: var(--accent-color);
          font-weight: 700;
        }

        .category-filters-wrapper {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          flex-wrap: wrap;
          gap: 0.8rem;
        }

        .filter-chip-btn {
          background: rgba(255, 255, 255, 0.01);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: var(--text-secondary);
          font-size: 0.82rem;
          padding: 0.5rem 1.2rem;
          border-radius: 20px;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .filter-chip-btn:hover {
          color: #ffffff;
          border-color: var(--accent-color);
        }

        .filter-chip-btn.active {
          background: rgba(197, 168, 128, 0.15);
          color: var(--accent-color);
          border-color: var(--accent-color);
          box-shadow: 0 2px 10px rgba(197, 168, 128, 0.1);
        }

        .services-slider-container {
          position: relative;
          max-width: 1240px;
          margin: 0 auto 3rem auto;
          display: flex;
          align-items: center;
          padding: 0 40px;
          z-index: 10;
        }

        .services-scroll-track {
          display: flex;
          overflow-x: auto;
          scroll-behavior: smooth;
          gap: 2rem;
          width: 100%;
          padding: 1.5rem 0.5rem;
          scrollbar-width: none; /* Hide scrollbar in Firefox */
          scroll-snap-type: x mandatory;
        }

        .services-scroll-track::-webkit-scrollbar {
          display: none; /* Hide scrollbar in Chrome/Safari */
        }

        .slider-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: rgba(13, 13, 15, 0.85);
          border: 1px solid rgba(197, 168, 128, 0.3);
          color: var(--accent-color);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 20;
          transition: var(--transition-smooth);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .slider-nav-btn:hover {
          background: var(--accent-color);
          color: #0d0d0f;
          border-color: transparent;
          box-shadow: 0 0 15px rgba(197, 168, 128, 0.4);
        }

        .slider-nav-btn.prev {
          left: -10px;
        }

        .slider-nav-btn.next {
          right: -10px;
        }

        .service-card {
          flex: 0 0 330px; /* Fixed width so they stay in a horizontal row */
          padding: 0;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          border-color: rgba(255, 255, 255, 0.05);
          transition: var(--transition-smooth);
          scroll-snap-align: start;
        }

        .service-card:hover {
          transform: translateY(-8px);
          border-color: var(--accent-color);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.4);
        }

        .service-image-box {
          position: relative;
          height: 190px;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .service-card-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .service-card:hover .service-card-img {
          transform: scale(1.06);
        }

        .service-image-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(to top, rgba(8, 8, 10, 0.7) 0%, transparent 50%);
          pointer-events: none;
        }

        .service-card-content {
          padding: 1.8rem;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .service-card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .service-icon-box {
          background: rgba(197, 168, 128, 0.1);
          color: var(--accent-color);
          width: 38px;
          height: 38px;
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
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--accent-color);
        }

        .service-title {
          font-size: 1.25rem;
          margin-bottom: 0.6rem;
          letter-spacing: 0.02em;
        }

        .service-desc {
          font-size: 0.85rem;
          color: var(--text-secondary);
          margin-bottom: 1.8rem;
          line-height: 1.55;
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

        /* AI Promo Banner Card */
        .services-promo-banner {
          position: relative;
          max-width: 1200px;
          margin: 0 auto 5rem auto;
          border-radius: 16px;
          height: 340px;
          background-size: cover;
          background-position: center;
          overflow: hidden;
          display: flex;
          align-items: center;
          padding: 3.5rem;
          border-color: rgba(197, 168, 128, 0.2);
          box-shadow: 0 8px 32px rgba(0,0,0,0.5);
          z-index: 10;
        }

        .promo-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, rgba(8, 8, 10, 0.95) 0%, rgba(8, 8, 10, 0.85) 50%, rgba(8, 8, 10, 0.5) 100%);
          z-index: 1;
        }

        .promo-content {
          position: relative;
          z-index: 2;
          max-width: 600px;
          text-align: left;
        }

        .promo-tag {
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          color: var(--accent-color);
          text-transform: uppercase;
          margin-bottom: 0.8rem;
          display: inline-block;
        }

        .promo-content h2 {
          font-size: 2.2rem;
          font-family: var(--font-serif);
          color: #ffffff;
          margin-bottom: 1rem;
          letter-spacing: 0.02em;
        }

        .promo-content p {
          color: var(--text-secondary);
          font-size: 0.92rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }

        .promo-actions {
          display: flex;
          gap: 1rem;
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
          margin-right: 0px;
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

        @media (max-width: 768px) {
          .services-slider-container {
            padding: 0;
          }

          .slider-nav-btn {
            display: none;
          }

          .services-scroll-track {
            gap: 1.2rem;
            padding: 0.5rem 0.2rem 1.5rem 0.2rem;
          }

          .service-card {
            flex: 0 0 280px !important;
            scroll-snap-align: start;
          }

          /* Filter scroll row on mobile */
          .filter-controls-row {
            margin-bottom: 2rem;
            gap: 1rem;
          }

          .category-filters-wrapper {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            padding-bottom: 0.5rem;
            width: 100%;
            scrollbar-width: none;
          }

          .category-filters-wrapper::-webkit-scrollbar {
            display: none;
          }

          .filter-chip-btn {
            flex-shrink: 0;
          }

          /* Promo Banner styles on mobile */
          .services-promo-banner {
            height: auto;
            padding: 2.5rem 1.8rem;
            margin: 0 auto 3rem auto;
          }
          
          .promo-overlay {
            background: rgba(8, 8, 10, 0.88);
          }
          
          .promo-content h2 {
            font-size: 1.8rem;
          }
          
          .promo-actions {
            flex-direction: column;
            gap: 1rem;
          }
          
          .promo-actions .btn-gold, .promo-actions .btn-outline {
            width: 100%;
            text-align: center;
          }
        }
      `}} />
    </section>
  );
}

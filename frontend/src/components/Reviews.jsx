import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, X } from 'lucide-react';
import { API_BASE_URL } from '../config';

const REVIEWS_DATA = [
  {
    id: 1,
    name: 'Saumya Jaiswal',
    details: '2 reviews',
    time: '2 months ago',
    text: 'Really happy with my haircut here! They did exactly what I asked for and the result was great. Staff is friendly and the pricing is very reasonable. Definitely coming back! ⭐⭐⭐⭐⭐',
    rating: 5
  },
  {
    id: 2,
    name: 'Shubhranshu Tiwari',
    details: '5 reviews',
    time: '8 months ago',
    text: 'Absolutely love this salon! The staff are friendly and skilled, the place is clean, and the service is always on point. They really understand what you want—whether it’s a haircut, facial, or styling. Great experience every time!',
    rating: 5
  },
  {
    id: 3,
    name: 'Saurabh Bhardwaj',
    details: 'Local Guide · 66 reviews · 27 photos',
    time: '3 months ago',
    text: 'Good place for child and elders both and staff was also very good. My request style was given to me exact. Best place for hair colouring & styling.',
    rating: 5
  },
  {
    id: 4,
    name: 'sharad mishra',
    details: '6 reviews · 4 photos',
    time: '8 months ago',
    text: 'New look unisex salon is best salon in prayagraj. Saddam and Imran they are best worker in all over the prayagraj. Highly recommended!',
    rating: 5
  },
  {
    id: 5,
    name: 'Manas Pandey',
    details: '2 reviews',
    time: '8 months ago',
    text: 'It was a great experience. I would definitely recommend this salon to anyone looking for a stylish haircut, grooming, or a relaxing experience.',
    rating: 5
  },
  {
    id: 6,
    name: 'Kartikeya Sharma',
    details: '4 reviews',
    time: '6 months ago',
    text: 'Very nice service. Best service near me and in pocket friendly. Staff behaviour is very polite.',
    rating: 5
  },
  {
    id: 7,
    name: 'Gopi Yadav',
    details: '1 review',
    time: '8 months ago',
    text: 'Highly recommended; visited once, now its almost 7 years bond. Consistent quality over the years.',
    rating: 5
  },
  {
    id: 8,
    name: 'Saibya Singh',
    details: '1 review',
    time: '8 months ago',
    text: 'Best makeup artist 👌 Very professional styling and bridal makeups. Highly recommended!',
    rating: 5
  }
];

const getRelativeTime = (dateString) => {
  if (!dateString) return 'Just now';
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  const diffYears = Math.floor(diffMonths / 12);
  return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
};

const getRatingLabel = (ratingVal) => {
  switch (ratingVal) {
    case 5: return 'Excellent! ⭐⭐⭐⭐⭐';
    case 4: return 'Good! ⭐⭐⭐⭐';
    case 3: return 'Average ⭐⭐⭐';
    case 2: return 'Poor ⭐⭐';
    case 1: return 'Very Poor ⭐';
    default: return '';
  }
};

export default function Reviews({ gender }) {
  const [dynamicReviews, setDynamicReviews] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Feedback Form State
  const [name, setName] = useState('');
  const [details, setDetails] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState('');
  
  // Submitting States
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  // Fetch reviews from DB
  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews`);
      if (res.ok) {
        const data = await res.json();
        setDynamicReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const resetForm = () => {
    setName('');
    setDetails('');
    setRating(5);
    setHoverRating(0);
    setText('');
    setSubmitError('');
    setSubmitSuccess('');
  };

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!name || !text || !rating) {
      setSubmitError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setSubmitError('');
    setSubmitSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          details: details || 'Client Review',
          text,
          rating
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Something went wrong while submitting.');
      }

      setSubmitSuccess('Thank you! Your feedback has been submitted successfully.');
      fetchReviews();
      setTimeout(() => {
        setModalOpen(false);
        resetForm();
      }, 2000);
    } catch (err) {
      setSubmitError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const allReviews = [...dynamicReviews, ...REVIEWS_DATA];

  return (
    <section id="reviews" className="reviews-section">
      <div className="section-header">
        <h2>Google <span>Reviews & Ratings</span></h2>
        <div className="divider"></div>
        <p>What our clients say about their grooming and beauty experiences with us.</p>
      </div>

      <div className="reviews-container">
        {/* Google Reviews Overview Card */}
        <div className="google-badge-card glass-panel animate-fade-in">
          <div className="badge-g-logo">G</div>
          <div className="badge-info">
            <h3>Google Rating</h3>
            <div className="stars-row">
              <Star size={18} className="star-fill" />
              <Star size={18} className="star-fill" />
              <Star size={18} className="star-fill" />
              <Star size={18} className="star-fill" />
              <Star size={18} className="star-fill" />
            </div>
            <p className="rating-text">
              <span className="score">5.0</span>
              <span className="divider">/</span>
              <span className="out-of">5</span>
            </p>
            <p className="review-count">Based on 137+ Verified Reviews</p>
          </div>
          <div className="write-review-box">
            <button className="btn-primary write-review-btn" onClick={() => setModalOpen(true)}>
              <MessageSquare size={16} style={{ marginRight: '8px' }} />
              Write a Feedback
            </button>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid-layout">
          {allReviews.map((review) => {
            const isDynamic = !!review._id;
            const reviewId = isDynamic ? review._id : review.id;
            const displayTime = isDynamic ? getRelativeTime(review.createdAt) : review.time;

            return (
              <div key={reviewId} className="review-card glass-panel">
                <div className="review-card-header">
                  <div className="avatar-placeholder">
                    {review.name.charAt(0)}
                  </div>
                  <div className="user-info">
                    <h4>{review.name}</h4>
                    <span className="user-details">{review.details}</span>
                  </div>
                  <span className="review-time">{displayTime}</span>
                </div>
                <div className="stars-row-small">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} size={14} className="star-fill" />
                  ))}
                </div>
                <p className="review-text">{review.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Feedback Modal */}
      {modalOpen && (
        <div className="feedback-modal-overlay">
          <div className="feedback-modal-content glass-panel animate-scale-in">
            <button className="close-modal-btn" onClick={() => { setModalOpen(false); resetForm(); }}>
              <X size={20} />
            </button>
            <h3>Share Your Experience</h3>
            <p className="modal-subtitle">Your feedback helps us maintain our premium standards.</p>
            
            {submitError && <div className="modal-alert error">{submitError}</div>}
            {submitSuccess && <div className="modal-alert success">{submitSuccess}</div>}
            
            {!submitSuccess && (
              <form onSubmit={handleSubmitFeedback}>
                <div className="form-group">
                  <label htmlFor="client-name">Your Name *</label>
                  <input
                    id="client-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="client-details">Details (Optional)</label>
                  <input
                    id="client-details"
                    type="text"
                    placeholder="e.g. 1 review, Local Guide"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Your Rating *</label>
                  <div className="rating-select-stars">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="star-select-btn"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                      >
                        <Star
                          size={28}
                          className={(hoverRating || rating) >= star ? 'star-fill' : 'star-empty'}
                        />
                      </button>
                    ))}
                    <span className="rating-label">
                      {getRatingLabel(hoverRating || rating)}
                    </span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="client-text">Your Review *</label>
                  <textarea
                    id="client-text"
                    required
                    rows="4"
                    placeholder="Describe your styling experience at New Look Salon..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-primary submit-feedback-btn" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .reviews-section {
          background-color: var(--bg-primary);
          padding: 5rem 5% !important;
        }

        .reviews-container {
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 3.5rem;
          position: relative;
          z-index: 10;
        }

        .google-badge-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
          padding: 2rem 3rem;
          border-color: rgba(197, 168, 128, 0.3);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          border-radius: 16px;
          width: 100%;
          max-width: 800px;
        }

        .write-review-box {
          display: flex;
          align-items: center;
        }

        .write-review-btn {
          white-space: nowrap;
          padding: 0.8rem 1.6rem;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          cursor: pointer;
        }

        .badge-g-logo {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #4285F4 0%, #34A853 30%, #FBBC05 70%, #EA4335 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          line-height: 1;
        }

        .badge-info h3 {
          font-family: var(--font-sans);
          font-size: 1.1rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 0.2rem;
          color: var(--text-secondary);
        }

        .stars-row {
          display: flex;
          gap: 4px;
          margin-bottom: 0.4rem;
        }

        .star-fill {
          color: #fbbf24;
          fill: #fbbf24;
        }

        .rating-text {
          font-size: 1.3rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.1rem;
        }

        .rating-text .score {
          font-size: 1.8rem;
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .rating-text .divider {
          margin: 0 4px;
          color: var(--text-muted);
        }

        .rating-text .out-of {
          color: var(--text-secondary);
        }

        .review-count {
          font-size: 0.8rem;
          color: var(--accent-color);
          font-weight: 600;
        }

        .reviews-grid-layout {
          display: flex;
          overflow-x: auto;
          gap: 1.5rem;
          padding: 0.5rem 0.2rem 1.5rem 0.2rem;
          width: 100%;
          scroll-snap-type: x mandatory;
          scrollbar-width: none; /* Hide scrollbar in Firefox */
        }

        .reviews-grid-layout::-webkit-scrollbar {
          display: none; /* Hide scrollbar in Chrome/Safari */
        }

        .review-card {
          flex: 0 0 350px; /* Fixed width for review cards */
          scroll-snap-align: start;
          padding: 1.5rem;
          border-color: rgba(255,255,255,0.04);
          transition: var(--transition-smooth);
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
          border-radius: 12px;
        }

        .review-card:hover {
          transform: translateY(-5px);
          border-color: var(--accent-color);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }

        .review-card-header {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          position: relative;
        }

        .avatar-placeholder {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--gold-gradient);
          color: #0d0d0f;
          display: flex;
          justify-content: center;
          align-items: center;
          font-weight: 700;
          font-size: 1.1rem;
          flex-shrink: 0;
        }

        .user-info {
          display: flex;
          flex-direction: column;
          max-width: 60%;
        }

        .user-info h4 {
          font-family: var(--font-sans);
          font-size: 0.95rem;
          font-weight: 600;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-details {
          font-size: 0.72rem;
          color: var(--text-muted);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .review-time {
          font-size: 0.72rem;
          color: var(--text-muted);
          position: absolute;
          right: 0;
          top: 4px;
        }

        .stars-row-small {
          display: flex;
          gap: 2px;
        }

        .review-text {
          font-size: 0.88rem;
          color: var(--text-secondary);
          line-height: 1.6;
        }

        /* Modal Styles */
        .feedback-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 1.5rem;
        }

        .feedback-modal-content {
          width: 100%;
          max-width: 500px;
          background: rgba(13, 13, 15, 0.95);
          border: 1px solid rgba(197, 168, 128, 0.2);
          border-radius: 16px;
          padding: 2.5rem;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
        }

        .close-modal-btn {
          position: absolute;
          top: 1.2rem;
          right: 1.2rem;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .close-modal-btn:hover {
          color: var(--accent-color);
          transform: rotate(90deg);
        }

        .feedback-modal-content h3 {
          font-size: 1.6rem;
          font-family: var(--font-sans);
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.3rem;
        }

        .modal-subtitle {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 1.8rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.4rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-group input, .form-group textarea {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 0.8rem 1rem;
          color: #ffffff;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .form-group input:focus, .form-group textarea:focus {
          border-color: var(--accent-color);
          outline: none;
          background: rgba(255, 255, 255, 0.05);
        }

        .rating-select-stars {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .star-select-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          transition: transform 0.1s;
        }

        .star-select-btn:hover {
          transform: scale(1.15);
        }

        .star-empty {
          color: rgba(255, 255, 255, 0.2);
          fill: transparent;
        }

        .rating-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--accent-color);
          margin-left: 0.8rem;
        }

        .submit-feedback-btn {
          width: 100%;
          margin-top: 1rem;
          padding: 0.9rem;
          font-size: 0.95rem;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .modal-alert {
          padding: 0.8rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          margin-bottom: 1.5rem;
          font-weight: 500;
        }

        .modal-alert.error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: #f87171;
        }

        .modal-alert.success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: #34d399;
          text-align: center;
        }

        .animate-scale-in {
          animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes scaleIn {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        @media (max-width: 768px) {
          .review-card {
            flex: 0 0 290px !important;
          }

          .google-badge-card {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.5rem;
            padding: 1.5rem 2rem;
          }

          .write-review-box {
            width: 100%;
          }

          .write-review-btn {
            width: 100%;
            justify-content: center;
          }
        }
      ` }} />
    </section>
  );
}


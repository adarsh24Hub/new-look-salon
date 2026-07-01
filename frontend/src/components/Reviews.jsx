import React from 'react';
import { Star, MessageSquare } from 'lucide-react';

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

export default function Reviews({ gender }) {
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
        </div>

        {/* Reviews Grid */}
        <div className="reviews-grid-layout">
          {REVIEWS_DATA.map((review) => (
            <div key={review.id} className="review-card glass-panel">
              <div className="review-card-header">
                <div className="avatar-placeholder">
                  {review.name.charAt(0)}
                </div>
                <div className="user-info">
                  <h4>{review.name}</h4>
                  <span className="user-details">{review.details}</span>
                </div>
                <span className="review-time">{review.time}</span>
              </div>
              <div className="stars-row-small">
                {[...Array(review.rating)].map((_, i) => (
                  <Star key={i} size={14} className="star-fill" />
                ))}
              </div>
              <p className="review-text">{review.text}</p>
            </div>
          ))}
        </div>
      </div>

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
          gap: 1.5rem;
          padding: 2rem 3rem;
          border-color: rgba(197, 168, 128, 0.3);
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          border-radius: 16px;
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
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          width: 100%;
        }

        .review-card {
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

        @media (max-width: 1024px) {
          .reviews-grid-layout {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .reviews-grid-layout {
            display: flex;
            overflow-x: auto;
            gap: 1.5rem;
            padding: 0.5rem 0.2rem 1.5rem 0.2rem;
            scroll-snap-type: x mandatory;
            scrollbar-width: thin;
            scrollbar-color: var(--accent-color) var(--bg-secondary);
          }

          .reviews-grid-layout::-webkit-scrollbar {
            height: 6px;
          }

          .reviews-grid-layout::-webkit-scrollbar-track {
            background: rgba(255, 255, 255, 0.03);
            border-radius: 3px;
          }

          .reviews-grid-layout::-webkit-scrollbar-thumb {
            background: var(--accent-color);
            border-radius: 3px;
          }

          .review-card {
            flex: 0 0 290px;
            scroll-snap-align: start;
          }

          .google-badge-card {
            padding: 1.5rem 2rem;
          }
        }
      ` }} />
    </section>
  );
}

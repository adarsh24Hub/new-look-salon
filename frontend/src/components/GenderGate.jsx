import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function GenderGate({ onSelectGender }) {
  const [isFading, setIsFading] = useState(false);

  const handleSelect = (gender) => {
    setIsFading(true);
    setTimeout(() => {
      onSelectGender(gender);
    }, 600); // matches transition time
  };

  return (
    <div className={`gender-gate-container ${isFading ? 'fade-out' : ''}`}>
      {/* Absolute Logo Header */}
      <div className="gate-header">
        <Sparkles className="gold-icon" size={28} />
        <h1>NEW LOOK UNISEX SALON</h1>
        <p className="subtitle">न्यू लुक यूनिसेक्स सैलून</p>
      </div>

      <div className="gate-split">
        {/* Men Option */}
        <div 
          className="gate-option option-men" 
          onClick={() => handleSelect('men')}
        >
          <div className="bg-overlay"></div>
          <div className="content-box">
            <h2>GENTLEMEN</h2>
            <div className="accent-bar"></div>
            <p>Hair Styling, Beard Crafting, Spa & Detanning</p>
            <button className="gate-btn">Enter Salon</button>
          </div>
        </div>

        {/* Women Option */}
        <div 
          className="gate-option option-women" 
          onClick={() => handleSelect('women')}
        >
          <div className="bg-overlay"></div>
          <div className="content-box">
            <h2>LADIES</h2>
            <div className="accent-bar"></div>
            <p>Bridal Makeup, Spa, Hair Color & Skin Care</p>
            <button className="gate-btn">Enter Salon</button>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .gender-gate-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 99999;
          background-color: #08080a;
          display: flex;
          flex-direction: column;
          transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gender-gate-container.fade-out {
          opacity: 0;
          transform: scale(1.05);
          pointer-events: none;
        }

        .gate-header {
          position: absolute;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
          text-align: center;
          width: 100%;
          padding: 0 20px;
        }

        .gate-header h1 {
          font-size: 2.2rem;
          letter-spacing: 0.15em;
          margin: 10px 0 2px 0;
          color: #ffffff;
          text-shadow: 0 4px 15px rgba(0,0,0,0.8);
        }

        .gate-header .subtitle {
          font-family: var(--font-serif);
          font-size: 1.2rem;
          color: #c5a880;
          letter-spacing: 0.05em;
          text-shadow: 0 2px 10px rgba(0,0,0,0.8);
        }

        .gold-icon {
          color: #c5a880;
          filter: drop-shadow(0 2px 8px rgba(197,168,128,0.5));
          animation: pulse 2s infinite;
        }

        .gate-split {
          display: flex;
          height: 100%;
          width: 100%;
        }

        .gate-option {
          flex: 1;
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          overflow: hidden;
          transition: flex 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* Sample premium background images */
        .option-men {
          background-image: url('https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1200&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }

        .option-women {
          background-image: url('https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }

        .bg-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85));
          transition: background 0.4s ease;
        }

        .gate-option:hover .bg-overlay {
          background: linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.75));
        }

        .gate-option:hover {
          flex: 1.2;
        }

        .content-box {
          position: relative;
          z-index: 2;
          text-align: center;
          padding: 30px;
          max-width: 400px;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .gate-option:hover .content-box {
          transform: translateY(-10px);
        }

        .content-box h2 {
          font-size: 2.8rem;
          letter-spacing: 0.1em;
          color: #ffffff;
          margin-bottom: 12px;
          text-shadow: 0 4px 10px rgba(0,0,0,0.5);
        }

        .accent-bar {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #8c6c41, #c5a880, #e5d1b8);
          margin: 0 auto 20px auto;
          transition: width 0.4s ease;
        }

        .gate-option:hover .accent-bar {
          width: 120px;
        }

        .content-box p {
          color: #cbd5e1;
          font-size: 0.95rem;
          margin-bottom: 25px;
          font-weight: 400;
        }

        .gate-btn {
          background: transparent;
          color: #ffffff;
          border: 2px solid #ffffff;
          padding: 12px 28px;
          border-radius: 4px;
          font-weight: 600;
          font-family: var(--font-sans);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .gate-option:hover .gate-btn {
          background: linear-gradient(135deg, #8c6c41 0%, #c5a880 50%, #e5d1b8 100%);
          color: #08080a;
          border-color: transparent;
          box-shadow: 0 6px 20px rgba(197, 168, 128, 0.4);
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }

        @media (max-width: 768px) {
          .gate-split {
            flex-direction: column;
          }
          .gate-option:hover {
            flex: 1.5;
          }
          .gate-header h1 {
            font-size: 1.6rem;
          }
          .content-box h2 {
            font-size: 2rem;
          }
          .gate-header {
            top: 20px;
          }
        }
      `}} />
    </div>
  );
}

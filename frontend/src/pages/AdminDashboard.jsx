import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Image as ImageIcon, Video, Plus, Trash2, ArrowLeft, Check, AlertCircle } from 'lucide-react';
import { BACKEND_URL, API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [photos, setPhotos] = useState([]);
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Gallery Form State
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryCaption, setGalleryCaption] = useState('');
  const [galleryCategory, setGalleryCategory] = useState('general');
  const [galleryGender, setGalleryGender] = useState('both');
  
  // Reels Form State
  const [reelTitle, setReelTitle] = useState('');
  const [reelUrl, setReelUrl] = useState('');
  const [reelGender, setReelGender] = useState('both');

  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');
  const username = localStorage.getItem('admin_username') || 'Admin';

  useEffect(() => {
    // Auth Guard
    if (!token) {
      navigate('/admin/login');
      return;
    }
    
    fetchGallery();
    fetchReels();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    navigate('/admin/login');
  };

  const fetchGallery = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery`);
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setPhotos(data);
      }
    } catch (err) {
      console.error('Error fetching gallery:', err);
    }
  };

  const fetchReels = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reels`);
      if (res.ok) {
        const data = await res.json();
        setReels(data);
      }
    } catch (err) {
      console.error('Error fetching reels:', err);
    }
  };

  // Upload Gallery Action
  const handleUploadGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      setError('Please select an image file to upload');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('image', galleryFile);
    formData.append('caption', galleryCaption);
    formData.append('category', galleryCategory);
    formData.append('gender', galleryGender);

    try {
      const response = await fetch(`${API_BASE_URL}/api/gallery`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Image upload failed');
      }

      setSuccess('Photo added successfully!');
      setGalleryFile(null);
      setGalleryCaption('');
      setGalleryCategory('general');
      setGalleryGender('both');
      // Reset file input element
      document.getElementById('gallery-file-input').value = '';
      fetchGallery();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Add Reel Action
  const handleAddReel = async (e) => {
    e.preventDefault();
    if (!reelUrl) {
      setError('Please enter a Reel or Video URL');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`${API_BASE_URL}/api/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: reelTitle,
          url: reelUrl,
          gender: reelGender
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to add Reel');
      }

      setSuccess('Video Reel added successfully!');
      setReelTitle('');
      setReelUrl('');
      setReelGender('both');
      fetchReels();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete Gallery Photo
  const handleDeletePhoto = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;
    setError('');
    setSuccess('');
    
    try {
      const res = await fetch(`${API_BASE_URL}/api/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to delete photo');
      }

      setSuccess('Photo deleted successfully.');
      fetchGallery();
    } catch (err) {
      setError(err.message);
    }
  };

  // Delete Reel
  const handleDeleteReel = async (id) => {
    if (!window.confirm('Are you sure you want to delete this video reel?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/reels/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to delete reel');
      }

      setSuccess('Video Reel deleted successfully.');
      fetchReels();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-container">
      {/* Dashboard Top bar */}
      <header className="admin-header glass-panel">
        <div className="header-brand" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
          <span>New Look Salon Admin</span>
        </div>
        <div className="header-user">
          <span className="user-badge">Hello, {username}</span>
          <button className="btn-logout" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="admin-content-grid">
        
        {/* Navigation Sidebar */}
        <aside className="admin-sidebar glass-panel">
          <button 
            className={`side-tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => { setActiveTab('gallery'); setError(''); setSuccess(''); }}
          >
            <ImageIcon size={18} />
            <span>Manage Gallery</span>
          </button>
          <button 
            className={`side-tab-btn ${activeTab === 'reels' ? 'active' : ''}`}
            onClick={() => { setActiveTab('reels'); setError(''); setSuccess(''); }}
          >
            <Video size={18} />
            <span>Manage Reels</span>
          </button>
        </aside>

        {/* Workspace panel */}
        <main className="admin-workspace">
          
          {error && (
            <div className="alert alert-error">
              <AlertCircle size={18} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <Check size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* TAB 1: Gallery Management */}
          {activeTab === 'gallery' && (
            <div className="workspace-tab-content">
              
              {/* Form Card */}
              <div className="admin-card glass-panel">
                <h3>Upload New Gallery Photo</h3>
                <form onSubmit={handleUploadGallery} className="admin-form">
                  <div className="form-row-three">
                    <div className="form-group">
                      <label>Select Image File</label>
                      <input 
                        type="file" 
                        id="gallery-file-input"
                        accept="image/*"
                        onChange={(e) => setGalleryFile(e.target.files[0])}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={galleryCategory} onChange={(e) => setGalleryCategory(e.target.value)}>
                        <option value="general">General Showcase</option>
                        <option value="hair">Hair Styling</option>
                        <option value="spa">Spa Treatment</option>
                        <option value="makeup">Makeup & Cosmetics</option>
                        <option value="experience">Training & Certifications</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Target Audience</label>
                      <select value={galleryGender} onChange={(e) => setGalleryGender(e.target.value)}>
                        <option value="both">Both (General)</option>
                        <option value="men">Gentlemen Mode Only</option>
                        <option value="women">Ladies Mode Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Caption / Photo Label</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Bridal makeup session in progress"
                      value={galleryCaption}
                      onChange={(e) => setGalleryCaption(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="btn-gold" disabled={loading}>
                    <Plus size={16} />
                    <span>{loading ? 'Uploading...' : 'Upload Image'}</span>
                  </button>
                </form>
              </div>

              {/* Data Grid list */}
              <div className="list-title-header">
                <h3>Uploaded Gallery items ({photos.length})</h3>
              </div>

              <div className="admin-gallery-grid">
                {photos.map((item) => (
                  <div key={item._id} className="admin-grid-item glass-panel">
                    <div className="item-thumbnail">
                      <img src={item.imageUrl.startsWith('/uploads') ? `${BACKEND_URL}${item.imageUrl}` : item.imageUrl} alt={item.caption} />
                    </div>
                    <div className="item-info">
                      <h4>{item.caption || 'No Caption'}</h4>
                      <div className="badge-row">
                        <span className="badge-cat">{item.category}</span>
                        <span className={`badge-gen ${item.gender}`}>{item.gender}</span>
                      </div>
                      <button className="btn-delete" onClick={() => handleDeletePhoto(item._id)}>
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 2: Reels Management */}
          {activeTab === 'reels' && (
            <div className="workspace-tab-content">
              
              {/* Form Card */}
              <div className="admin-card glass-panel">
                <h3>Add Instagram / Facebook Reel</h3>
                <form onSubmit={handleAddReel} className="admin-form">
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Video Title</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Silk Smooth Hair Treatment"
                        value={reelTitle}
                        onChange={(e) => setReelTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Audience</label>
                      <select value={reelGender} onChange={(e) => setReelGender(e.target.value)}>
                        <option value="both">Both (General)</option>
                        <option value="men">Gentlemen Mode Only</option>
                        <option value="women">Ladies Mode Only</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Reel / Video URL (Instagram or Facebook)</label>
                    <input 
                      type="url" 
                      placeholder="e.g. https://www.instagram.com/reel/C8_k-b0J5g2/"
                      value={reelUrl}
                      onChange={(e) => setReelUrl(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn-gold" disabled={loading}>
                    <Plus size={16} />
                    <span>{loading ? 'Adding...' : 'Add Video Reel'}</span>
                  </button>
                </form>
              </div>

              {/* Data Grid list */}
              <div className="list-title-header">
                <h3>Active Embedded Reels ({reels.length})</h3>
              </div>

              <div className="admin-reels-list">
                {reels.map((reel) => (
                  <div key={reel._id} className="admin-reel-item glass-panel">
                    <div className="reel-meta">
                      <h4>{reel.title}</h4>
                      <p className="url-text">{reel.url}</p>
                      <div className="badge-row">
                        <span className="badge-cat">{reel.platform}</span>
                        <span className={`badge-gen ${reel.gender}`}>{reel.gender}</span>
                      </div>
                    </div>
                    <button className="btn-delete" onClick={() => handleDeleteReel(reel._id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

            </div>
          )}

        </main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .admin-container {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          border-color: rgba(255,255,255,0.05);
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 10px;
          cursor: pointer;
          font-family: var(--font-serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
        }

        .header-brand:hover {
          color: var(--gold-primary);
        }

        .header-user {
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }

        .user-badge {
          font-size: 0.88rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .btn-logout {
          background: transparent;
          border: 1px solid rgba(239, 68, 68, 0.2);
          color: #f87171;
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 0.8rem;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          transition: var(--transition-smooth);
        }

        .btn-logout:hover {
          background: rgba(239, 68, 68, 0.1);
          border-color: #f87171;
        }

        .admin-content-grid {
          display: grid;
          grid-template-columns: 240px 1fr;
          gap: 20px;
          flex-grow: 1;
        }

        .admin-sidebar {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 10px;
          height: fit-content;
          border-color: rgba(255,255,255,0.05);
        }

        .side-tab-btn {
          width: 100%;
          background: transparent;
          border: none;
          color: var(--text-secondary);
          padding: 12px;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;
          font-size: 0.9rem;
          text-align: left;
          transition: var(--transition-smooth);
        }

        .side-tab-btn:hover {
          background: rgba(255, 255, 255, 0.02);
          color: #ffffff;
        }

        .side-tab-btn.active {
          background: var(--accent-glow);
          color: var(--gold-primary);
          border-left: 3px solid var(--gold-primary);
        }

        .admin-workspace {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .admin-card {
          padding: 2.2rem;
          border-color: rgba(255,255,255,0.05);
        }

        .admin-card h3 {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          padding-bottom: 0.8rem;
        }

        .admin-form {
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .form-row-three {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr;
          gap: 1.2rem;
        }

        .form-row-two {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 1.2rem;
        }

        .admin-form label {
          display: block;
          font-size: 0.8rem;
          font-weight: 600;
          color: var(--text-secondary);
          margin-bottom: 6px;
          text-transform: uppercase;
        }

        .admin-form input[type="text"],
        .admin-form input[type="url"],
        .admin-form select {
          width: 100%;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 4px;
          padding: 10px 12px;
          color: #ffffff;
          font-size: 0.9rem;
          transition: var(--transition-smooth);
        }

        .admin-form input:focus,
        .admin-form select:focus {
          outline: none;
          border-color: var(--gold-primary);
        }

        .admin-form input[type="file"] {
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .list-title-header {
          margin-top: 1rem;
        }

        .admin-gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.2rem;
        }

        .admin-grid-item {
          padding: 0;
          overflow: hidden;
          border-color: rgba(255,255,255,0.05);
        }

        .item-thumbnail {
          height: 160px;
          width: 100%;
          overflow: hidden;
          background: #000;
        }

        .item-thumbnail img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .item-info {
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .item-info h4 {
          font-size: 0.9rem;
          font-family: var(--font-sans);
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .badge-row {
          display: flex;
          gap: 6px;
        }

        .badge-cat, .badge-gen {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .badge-cat {
          background-color: rgba(255,255,255,0.05);
          color: var(--text-secondary);
        }

        .badge-gen.men {
          background-color: rgba(59, 130, 246, 0.15);
          color: #60a5fa;
        }

        .badge-gen.women {
          background-color: rgba(236, 72, 153, 0.15);
          color: #f472b6;
        }

        .badge-gen.both {
          background-color: rgba(168, 85, 247, 0.15);
          color: #c084fc;
        }

        .btn-delete {
          background: rgba(239, 68, 68, 0.08);
          border: 1px solid rgba(239, 68, 68, 0.15);
          color: #f87171;
          padding: 6px;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: var(--transition-smooth);
          margin-top: 5px;
        }

        .btn-delete:hover {
          background: rgba(239, 68, 68, 0.2);
          border-color: #ef4444;
        }

        .admin-reels-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .admin-reel-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem;
          border-color: rgba(255,255,255,0.05);
        }

        .reel-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .url-text {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .admin-content-grid {
            grid-template-columns: 1fr;
          }
          .form-row-three, .form-row-two {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </div>
  );
}

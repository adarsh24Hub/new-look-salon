import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Image as ImageIcon, Video, Plus, Trash2, ArrowLeft, Check, AlertCircle, Gift, Edit2, Sparkles } from 'lucide-react';
import { BACKEND_URL, API_BASE_URL } from '../config';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [photos, setPhotos] = useState([]);
  const [reels, setReels] = useState([]);
  const [offers, setOffers] = useState([]);
  const [slides, setSlides] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Offers Form State
  const [offerTitle, setOfferTitle] = useState('');
  const [offerDescription, setOfferDescription] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscount, setOfferDiscount] = useState('');
  const [offerGender, setOfferGender] = useState('both');
  const [offerActive, setOfferActive] = useState(true);
  const [offerExpiry, setOfferExpiry] = useState('');
  const [offerFile, setOfferFile] = useState(null);
  const [editingOfferId, setEditingOfferId] = useState(null);

  // Slides Form State
  const [slideTitle, setSlideTitle] = useState('');
  const [slideDescription, setSlideDescription] = useState('');
  const [slideCategory, setSlideCategory] = useState('owner');
  const [slideActive, setSlideActive] = useState(true);
  const [slideOrder, setSlideOrder] = useState('0');
  const [slideFile, setSlideFile] = useState(null);
  const [editingSlideId, setEditingSlideId] = useState(null);
  
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
    fetchOffers();
    fetchSlides();
  }, [token]);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/offers?all=true`);
      if (res.ok) {
        const data = await res.json();
        setOffers(data);
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
    }
  };

  const resetOfferForm = () => {
    setOfferTitle('');
    setOfferDescription('');
    setOfferCode('');
    setOfferDiscount('');
    setOfferGender('both');
    setOfferActive(true);
    setOfferExpiry('');
    setOfferFile(null);
    setEditingOfferId(null);
    const fileInput = document.getElementById('offer-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSaveOffer = async (e) => {
    e.preventDefault();
    if (!offerTitle || !offerDescription) {
      setError('Please provide title and description');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', offerTitle);
    formData.append('description', offerDescription);
    formData.append('discountCode', offerCode);
    formData.append('discountValue', offerDiscount);
    formData.append('gender', offerGender);
    formData.append('isActive', offerActive);
    if (offerExpiry) {
      formData.append('expiryDate', offerExpiry);
    }
    if (offerFile) {
      formData.append('image', offerFile);
    }

    try {
      const url = editingOfferId 
        ? `${API_BASE_URL}/api/offers/${editingOfferId}`
        : `${API_BASE_URL}/api/offers`;
      
      const method = editingOfferId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to save offer');
      }

      setSuccess(editingOfferId ? 'Offer updated successfully!' : 'Offer created successfully!');
      resetOfferForm();
      fetchOffers();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditOffer = (offer) => {
    setEditingOfferId(offer._id);
    setOfferTitle(offer.title);
    setOfferDescription(offer.description);
    setOfferCode(offer.discountCode || '');
    setOfferDiscount(offer.discountValue || '');
    setOfferGender(offer.gender || 'both');
    setOfferActive(offer.isActive);
    setOfferExpiry(offer.expiryDate ? offer.expiryDate.split('T')[0] : '');
    setOfferFile(null);
    const fileInput = document.getElementById('offer-file-input');
    if (fileInput) fileInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteOffer = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/offers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to delete offer');
      }

      setSuccess('Offer deleted successfully.');
      fetchOffers();
    } catch (err) {
      setError(err.message);
    }
  };

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

  const fetchSlides = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/slides?all=true`);
      if (res.ok) {
        const data = await res.json();
        setSlides(data);
      }
    } catch (err) {
      console.error('Error fetching slides:', err);
    }
  };

  const resetSlideForm = () => {
    setSlideTitle('');
    setSlideDescription('');
    setSlideCategory('owner');
    setSlideActive(true);
    setSlideOrder('0');
    setSlideFile(null);
    setEditingSlideId(null);
    const fileInput = document.getElementById('slide-file-input');
    if (fileInput) fileInput.value = '';
  };

  const handleSaveSlide = async (e) => {
    e.preventDefault();
    if (!slideTitle) {
      setError('Please provide a title');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('title', slideTitle);
    formData.append('description', slideDescription);
    formData.append('category', slideCategory);
    formData.append('isActive', slideActive);
    formData.append('order', slideOrder);
    if (slideFile) {
      formData.append('image', slideFile);
    }

    try {
      const url = editingSlideId 
        ? `${API_BASE_URL}/api/slides/${editingSlideId}`
        : `${API_BASE_URL}/api/slides`;
      
      const method = editingSlideId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Failed to save slide');
      }

      setSuccess(editingSlideId ? 'Slide updated successfully!' : 'Slide created successfully!');
      resetSlideForm();
      fetchSlides();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStartEditSlide = (slide) => {
    setEditingSlideId(slide._id);
    setSlideTitle(slide.title);
    setSlideDescription(slide.description || '');
    setSlideCategory(slide.category || 'owner');
    setSlideActive(slide.isActive);
    setSlideOrder(slide.order ? slide.order.toString() : '0');
    setSlideFile(null);
    const fileInput = document.getElementById('slide-file-input');
    if (fileInput) fileInput.value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteSlide = async (id) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;
    setError('');
    setSuccess('');

    try {
      const res = await fetch(`${API_BASE_URL}/api/slides/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.msg || 'Failed to delete slide');
      }

      setSuccess('Slide deleted successfully.');
      fetchSlides();
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
          <button 
            className={`side-tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => { setActiveTab('offers'); setError(''); setSuccess(''); resetOfferForm(); }}
          >
            <Gift size={18} />
            <span>Manage Offers</span>
          </button>
          <button 
            className={`side-tab-btn ${activeTab === 'slides' ? 'active' : ''}`}
            onClick={() => { setActiveTab('slides'); setError(''); setSuccess(''); resetSlideForm(); }}
          >
            <Sparkles size={18} />
            <span>Manage Slides</span>
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

          {/* TAB 3: Offers Management */}
          {activeTab === 'offers' && (
            <div className="workspace-tab-content animate-fade-in">
              
              {/* Form Card */}
              <div className="admin-card glass-panel">
                <h3>{editingOfferId ? 'Edit Offer & Discount' : 'Create New Offer & Discount'}</h3>
                <form onSubmit={handleSaveOffer} className="admin-form">
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Offer Title / Headline</label>
                      <input 
                        type="text" 
                        placeholder="e.g. BIRTHDAY FREE HAIRCUT"
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Discount Value</label>
                      <input 
                        type="text" 
                        placeholder="e.g. FREE, 25% OFF, ₹100 Off"
                        value={offerDiscount}
                        onChange={(e) => setOfferDiscount(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description / Subtitle</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Show your ID on your birthday to get a free professional haircut!"
                      value={offerDescription}
                      onChange={(e) => setOfferDescription(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row-three">
                    <div className="form-group">
                      <label>Promo Code (Optional)</label>
                      <input 
                        type="text" 
                        placeholder="e.g. BDAYFREE"
                        value={offerCode}
                        onChange={(e) => setOfferCode(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Target Audience</label>
                      <select value={offerGender} onChange={(e) => setOfferGender(e.target.value)}>
                        <option value="both">Both (General)</option>
                        <option value="men">Gentlemen Only</option>
                        <option value="women">Ladies Only</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={offerActive} onChange={(e) => setOfferActive(e.target.value === 'true')}>
                        <option value="true">Active & Visible</option>
                        <option value="false">Paused / Hidden</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Expiry Date (Optional)</label>
                      <input 
                        type="date" 
                        value={offerExpiry}
                        onChange={(e) => setOfferExpiry(e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Flyer / Banner Image (Optional)</label>
                      <input 
                        type="file" 
                        id="offer-file-input"
                        accept="image/*"
                        onChange={(e) => setOfferFile(e.target.files[0])}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-gold" disabled={loading}>
                      <Plus size={16} />
                      <span>{loading ? 'Saving...' : (editingOfferId ? 'Update Offer' : 'Create Offer')}</span>
                    </button>
                    {editingOfferId && (
                      <button type="button" className="btn-outline" onClick={resetOfferForm} style={{ padding: '0.8rem 1.5rem' }}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Data Grid list */}
              <div className="list-title-header">
                <h3>Salon Offers & Discounts ({offers.length})</h3>
              </div>

              <div className="admin-gallery-grid">
                {offers.map((item) => (
                  <div key={item._id} className="admin-grid-item glass-panel" style={{ border: item.isActive ? '1px solid rgba(197, 168, 128, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div className="item-thumbnail" style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0d' }}>
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div style={{ padding: '10px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                          <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--gold-primary)' }}>{item.discountValue || 'OFFER'}</span>
                          <span style={{ fontSize: '0.8rem', color: '#fff' }}>{item.discountCode || 'No Code'}</span>
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: item.isActive ? '#10b981' : '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {item.isActive ? 'Active' : 'Paused'}
                      </div>
                    </div>
                    <div className="item-info">
                      <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.description}
                      </p>
                      <div className="badge-row" style={{ marginTop: '5px' }}>
                        <span className={`badge-gen ${item.gender}`}>{item.gender}</span>
                        {item.expiryDate && (
                          <span className="badge-cat" style={{ fontSize: '0.65rem' }}>
                            Exp: {new Date(item.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          className="btn-outline" 
                          onClick={() => handleStartEditOffer(item)}
                          style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '30px' }}
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDeleteOffer(item._id)}
                          style={{ flex: 1, margin: 0, padding: '4px 8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '30px' }}
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* TAB 4: Slides Management */}
          {activeTab === 'slides' && (
            <div className="workspace-tab-content animate-fade-in">
              
              {/* Form Card */}
              <div className="admin-card glass-panel">
                <h3>{editingSlideId ? 'Edit Slide Details' : 'Add New Slide'}</h3>
                <form onSubmit={handleSaveSlide} className="admin-form">
                  <div className="form-row-two">
                    <div className="form-group">
                      <label>Slide Title / Headline</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Meet Our Founder"
                        value={slideTitle}
                        onChange={(e) => setSlideTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Slide Category</label>
                      <select value={slideCategory} onChange={(e) => setSlideCategory(e.target.value)}>
                        <option value="owner">Owner Info / Biography</option>
                        <option value="certificate">Certifications & Awards</option>
                        <option value="offer">Offers & Discounts</option>
                        <option value="other">General Announcement</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description / Slide Content</label>
                    <textarea 
                      placeholder="Enter the detailed description text for the slide..."
                      value={slideDescription}
                      onChange={(e) => setSlideDescription(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '4px',
                        padding: '10px 12px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        transition: 'var(--transition-smooth)',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div className="form-row-three">
                    <div className="form-group">
                      <label>Display Order (0, 1, 2, ...)</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 0"
                        value={slideOrder}
                        onChange={(e) => setSlideOrder(e.target.value)}
                        min="0"
                        style={{
                          width: '100%',
                          background: 'rgba(255,255,255,0.03)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '4px',
                          padding: '10px 12px',
                          color: '#ffffff',
                          fontSize: '0.9rem'
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={slideActive} onChange={(e) => setSlideActive(e.target.value === 'true')}>
                        <option value="true">Active (Visible)</option>
                        <option value="false">Inactive (Hidden)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Image File {editingSlideId ? '(Optional)' : '(Required)'}</label>
                      <input 
                        type="file" 
                        id="slide-file-input"
                        accept="image/*"
                        onChange={(e) => setSlideFile(e.target.files[0])}
                        required={!editingSlideId}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button type="submit" className="btn-gold" disabled={loading}>
                      <Plus size={16} />
                      <span>{loading ? 'Saving...' : (editingSlideId ? 'Update Slide' : 'Create Slide')}</span>
                    </button>
                    {editingSlideId && (
                      <button type="button" className="btn-outline" onClick={resetSlideForm} style={{ padding: '0.8rem 1.5rem' }}>
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* Data Grid list */}
              <div className="list-title-header">
                <h3>Homepage Slides ({slides.length})</h3>
              </div>

              <div className="admin-gallery-grid">
                {slides.map((item) => (
                  <div key={item._id} className="admin-grid-item glass-panel" style={{ border: item.isActive ? '1px solid rgba(197, 168, 128, 0.3)' : '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <div className="item-thumbnail" style={{ position: 'relative' }}>
                      <img src={item.imageUrl} alt={item.title} />
                      <div style={{ position: 'absolute', top: '10px', right: '10px', background: item.isActive ? '#10b981' : '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                        {item.isActive ? 'Active' : 'Hidden'}
                      </div>
                      <div style={{ position: 'absolute', bottom: '10px', left: '10px', background: 'rgba(0,0,0,0.7)', color: '#fff', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>
                        Order: {item.order}
                      </div>
                    </div>
                    <div className="item-info">
                      <h4 style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} title={item.title}>{item.title}</h4>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', height: '36px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                        {item.description}
                      </p>
                      <div className="badge-row" style={{ marginTop: '5px' }}>
                        <span className="badge-cat">{item.category}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          className="btn-outline" 
                          onClick={() => handleStartEditSlide(item)}
                          style={{ flex: 1, padding: '4px 8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '30px' }}
                        >
                          <Edit2 size={12} />
                          <span>Edit</span>
                        </button>
                        <button 
                          className="btn-delete" 
                          onClick={() => handleDeleteSlide(item._id)}
                          style={{ flex: 1, margin: 0, padding: '4px 8px', fontSize: '0.75rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '4px', height: '30px' }}
                        >
                          <Trash2 size={12} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
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

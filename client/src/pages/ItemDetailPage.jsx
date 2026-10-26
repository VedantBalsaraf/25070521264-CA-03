import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context';
import { ImageUpload } from '../components/items';
import { Button } from '../components/common/Button';
import { Avatar } from '../components/common/Avatar';
import { EmptyState, LoadingState } from '../components/layout/PageWrapper';

import { Badge, TagInput } from '../components/common/Badge';
import { Input } from '../components/common/Input';
import { Modal } from '../components/common/Modal';
import { useToastHelpers } from '../components/common/Toast';
import { createBorrowRequest } from '../services/borrowService';
import { getItem, updateItem, updateItemStatus, deleteItem } from '../services/itemService';
import { itemImages as getItemImages } from '../utils/images';
import { cn, formatDate, getErrorMessage } from '../utils/formatters';
import { CATEGORIES, CONDITIONS } from '../utils/constants';
import { MapPin, Calendar, Package, Eye, Share2, Heart, ChevronLeft, ChevronRight, Edit, Trash2, Flag, MessageSquare, Image as ImageIcon, XCircle } from 'lucide-react';

const mockItem = {
  _id: '1',
  title: 'Canon EOS R50 Mirrorless Camera Kit',
  description: 'Excellent condition Canon EOS R50 mirrorless camera with 24.2MP APS-C sensor, 4K video recording, and RF-S 18-45mm f/4.5-6.3 IS STM kit lens. Includes original box, charger, battery, strap, and lens caps. Bought last semester for a photography elective but barely used - only about 200 shutter actuations. Perfect for photography projects, events, or learning mirrorless photography. The camera has dual pixel autofocus with eye detection, vari-angle touchscreen, and excellent low-light performance. Comes with a 64GB SD card and camera bag.',
  category: 'Cameras',
  condition: 'Like New',
  images: [
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1495707902641-75cac588d2e9?auto=format&fit=crop&w=800&h=600&q=80',
    'https://images.unsplash.com/photo-1500634245200-e5245c7574ef?auto=format&fit=crop&w=800&h=600&q=80'
  ],
  owner: {
    _id: 'u1',
    name: 'Arjun Patel',
    rollNumber: 'EC2021045',
    department: 'Electronics',
    year: 4,
    avatar: null
  },
  status: 'Available',
  location: 'Library Block A, Media Center',
  tags: ['photography', '4k', 'mirrorless', 'canon', 'aps-c'],
  borrowCount: 12,
  views: 234,
  createdAt: '2024-01-15T10:30:00Z',
  updatedAt: '2024-01-15T10:30:00Z'
};

const conditionColors = {
  'New': 'bg-success-100 text-success-700',
  'Like New': 'bg-primary-100 text-primary-700',
  'Good': 'bg-warning-100 text-warning-700',
  'Fair': 'bg-gray-100 text-gray-700'
};

const statusColors = {
  'Available': 'bg-success-100 text-success-700',
  'Reserved': 'bg-warning-100 text-warning-700',
  'Borrowed': 'bg-primary-100 text-primary-700',
  'Maintenance': 'bg-warning-100 text-warning-700',
  'Removed': 'bg-gray-100 text-gray-700'
};

export function ItemDetailPage() {
  const { itemId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToastHelpers();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [borrowForm, setBorrowForm] = useState({ notes: '', dueDate: '' });
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [favorite, setFavorite] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('borrowcircles:favorites') || '[]').includes(itemId);
    } catch {
      return false;
    }
  });
  const [statusLoading, setStatusLoading] = useState(false);
  const itemImages = getItemImages(item);

  // Load the real item. Previously this page always rendered a hardcoded mock,
  // so every item link showed the same camera.
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      if (!itemId) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      setLoading(true);
      setNotFound(false);
      try {
        const data = await getItem(itemId);
        if (!cancelled) {
          setItem(data);
          setCurrentImage(0);
        }
      } catch {
        if (!cancelled) {
          setItem(null);
          setNotFound(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => { cancelled = true; };
  }, [itemId]);

  const canEdit = Boolean(user && item && item.owner?._id === user._id);
  const isOwner = canEdit;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDueDate = tomorrow.toISOString().split('T')[0];

  const handleBorrowRequest = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.info('Please sign in', 'You need an account to request an item.');
      navigate('/login');
      return;
    }
    if (!borrowForm.dueDate) {
      toast.warning('Return date required', 'Please choose when you will return the item.');
      return;
    }

    setBorrowLoading(true);
    try {
      await createBorrowRequest({
        itemId: item._id,
        notes: borrowForm.notes,
        dueDate: borrowForm.dueDate
      });
      setShowBorrowModal(false);
      setBorrowForm({ notes: '', dueDate: '' });
      toast.success('Request sent', 'The owner has been notified and will respond soon.');
    } catch (err) {
      toast.error('Could not send request', getErrorMessage(err));
    } finally {
      setBorrowLoading(false);
    }
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this item? This cannot be undone.')) return;
    try {
      await deleteItem(item._id);
      toast.success('Item deleted', 'Your listing has been removed.');
      navigate('/dashboard?tab=my-items');
    } catch (err) {
      toast.error('Could not delete item', getErrorMessage(err));
    }
  };

  const handleImageSelect = (index) => {
    setCurrentImage(index);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied', 'Share this item page with a friend.');
    } catch {
      toast.error('Could not copy link', 'Your browser did not allow clipboard access.');
    }
  };

  const handleShare = async () => {
    const shareData = { title: item.title, text: `Check out ${item.title} on BorrowCircles`, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        window.open(`https://wa.me/?text=${encodeURIComponent(`${shareData.text} ${shareData.url}`)}`, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      if (err?.name !== 'AbortError') toast.error('Could not open sharing', 'Please copy the link and share it manually.');
    }
  };

  const handleFavoriteToggle = () => {
    try {
      const saved = JSON.parse(localStorage.getItem('borrowcircles:favorites') || '[]');
      const next = favorite ? saved.filter(id => id !== item._id) : [...new Set([...saved, item._id])];
      localStorage.setItem('borrowcircles:favorites', JSON.stringify(next));
      setFavorite(!favorite);
      toast.info(favorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Could not update favorites', 'Browser storage is unavailable.');
    }
  };

  const handleReport = () => {
    const subject = encodeURIComponent(`BorrowCircles listing report: ${item.title}`);
    const body = encodeURIComponent(`Please review this listing: ${window.location.href}\n\nReason for report: `);
    window.location.href = `mailto:hello@borrowcircles.com?subject=${subject}&body=${body}`;
  };

  const handleToggleAvailability = async () => {
    setStatusLoading(true);
    try {
      const updated = await updateItemStatus(item._id, item.status === 'Available' ? 'Maintenance' : 'Available');
      setItem(updated);
      toast.success(updated.status === 'Available' ? 'Item is available' : 'Item marked unavailable');
    } catch (err) {
      toast.error('Could not update availability', getErrorMessage(err));
    } finally {
      setStatusLoading(false);
    }
  };

  const prevImage = () => {
    if (itemImages.length < 2) return;
    setCurrentImage(prev => (prev - 1 + itemImages.length) % itemImages.length);
  };

  const nextImage = () => {
    if (itemImages.length < 2) return;
    setCurrentImage(prev => (prev + 1) % itemImages.length);
  };

  if (loading) {
    return (
      <div className="item-detail-page min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingState size="lg" text="Loading item details..." />
      </div>
    );
  }

  if (notFound || !item) {
    return (
      <div className="item-detail-page min-h-screen bg-gray-50 py-16">
        <div className="container">
          <EmptyState
            icon={<Package size={48} className="text-gray-300" />}
            title="Item not found"
            message="This item may have been removed or the link is incorrect."
            action={<Link to="/explore" className="btn btn-primary">Back to Explore</Link>}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="item-detail-page min-h-screen bg-gray-50">
      <nav className="breadcrumb container py-4" aria-label="Breadcrumb">
        <Link to="/" className="breadcrumb-item breadcrumb-link">Home</Link>
        <Link to="/explore" className="breadcrumb-item breadcrumb-link">Explore</Link>
        <Link to={`/explore?category=${item.category}`} className="breadcrumb-item breadcrumb-link">{item.category}</Link>
        <span className="breadcrumb-item" aria-current="page">{item.title}</span>
      </nav>

      <main className="page-content pb-12">
        <div className="item-detail">
            <div className="item-gallery">
              <div className="item-main-image relative rounded-2xl overflow-hidden bg-gray-100 mb-4">
                <img
                  src={itemImages[currentImage]}
                  alt={`${item.title} - Image ${currentImage + 1}`}
                  className="w-full h-full object-contain"
                />
                {itemImages.length > 1 && (
                  <>
                    <button
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
                      onClick={prevImage}
                      aria-label="Previous image"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-colors shadow-md"
                      onClick={nextImage}
                      aria-label="Next image"
                    >
                      <ChevronRight size={24} />
                    </button>
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
                      {itemImages.map((_, i) => (
                        <button
                          key={i}
                          className={cn(
                            'w-2 h-2 rounded-full transition-all',
                            i === currentImage ? 'bg-white w-6' : 'bg-white/50 hover:bg-white/75'
                          )}
                          onClick={() => handleImageSelect(i)}
                          aria-label={`View image ${i + 1}`}
                          aria-current={i === currentImage ? 'true' : 'false'}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {itemImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {itemImages.map((img, i) => (
                    <button
                      key={img}
                      className={cn(
                        'flex-shrink-0 w-20 h-15 rounded-lg overflow-hidden border-2 transition-all',
                        i === currentImage ? 'border-primary-500' : 'border-transparent hover:border-gray-300'
                      )}
                      onClick={() => handleImageSelect(i)}
                      aria-label={`View image ${i + 1}`}
                      aria-current={i === currentImage ? 'true' : 'false'}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {isOwner && (
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" leftIcon={<Edit size={18} />} onClick={handleEdit}>
                    Edit Item
                  </Button>
                  <Button variant="danger" leftIcon={<Trash2 size={18} />} onClick={handleDelete}>
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="item-info">
              <div className="item-detail-header">
                <div>
                  <div className="item-detail-badges">
                    <Badge variant="outline" size="sm">{item.category}</Badge>
                    <Badge className={conditionColors[item.condition]}>{item.condition}</Badge>
                    <Badge className={statusColors[item.status]} dot>{item.status}</Badge>
                  </div>
                  <h1 className="item-detail-title">{item.title}</h1>
                </div>
              </div>

              <div className="prose prose-gray max-w-none mb-6">
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>

              <div className="item-detail-meta mb-6">
                <div className="item-detail-meta-item">
                  <MapPin size={16} />
                  <span><span className="item-detail-meta-label">Location:</span> {item.location}</span>
                </div>
                <div className="item-detail-meta-item">
                  <Calendar size={16} />
                  <span><span className="item-detail-meta-label">Listed:</span> {formatDate(item.createdAt)}</span>
                </div>
                <div className="item-detail-meta-item">
                  <Eye size={16} />
                  <span><span className="item-detail-meta-label">Views:</span> {item.views.toLocaleString()}</span>
                </div>
                <div className="item-detail-meta-item">
                  <Package size={16} />
                  <span><span className="item-detail-meta-label">Times Borrowed:</span> {item.borrowCount}</span>
                </div>
              </div>

              {item.tags?.length && (
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="gray">#{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="item-detail-owner mb-6">
                <Avatar src={item.owner.avatar} name={item.owner.name} size="xl" />
                <div className="item-detail-owner-info">
                  <p className="item-detail-owner-name">{item.owner.name}</p>
                  <p className="item-detail-owner-meta">
                    {item.owner.rollNumber} • {item.owner.department} • Year {item.owner.year}
                    <span className="mx-2">•</span>
                    <span className="text-success-600">Verified Student</span>
                  </p>
                </div>
              </div>

              <div className="item-detail-actions">
                {item.status === 'Available' && !isOwner && (
                  <Button
                    size="lg"
                    className="w-full sm:w-auto"
                    onClick={() => setShowBorrowModal(true)}
                    leftIcon={<Package size={20} />}
                  >
                    Request to Borrow
                  </Button>
                )}
                {item.status !== 'Available' && !isOwner && (
                  <Button size="lg" variant="secondary" className="w-full sm:w-auto" disabled>
                    <XCircle size={20} />
                    Currently Unavailable
                  </Button>
                )}
                {isOwner && item.status === 'Available' && (
                  <Button size="lg" variant="outline" loading={statusLoading} onClick={handleToggleAvailability} leftIcon={<Flag size={18} />}>
                    Mark Unavailable
                  </Button>
                )}
                {isOwner && item.status === 'Maintenance' && (
                  <Button size="lg" variant="success" loading={statusLoading} onClick={handleToggleAvailability} leftIcon={<Package size={18} />}>
                    Mark Available
                  </Button>
                )}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Share this item</h3>
                <div className="flex gap-3">
                  <Button variant="ghost" size="icon" aria-label="Share this item" onClick={handleShare}>
                    <MessageSquare size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Copy link" onClick={handleCopyLink}>
                    <Share2 size={20} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'} aria-pressed={favorite} onClick={handleFavoriteToggle}>
                    <Heart size={20} fill={favorite ? 'currentColor' : 'none'} />
                  </Button>
                  <Button variant="ghost" size="icon" aria-label="Report item" onClick={handleReport}>
                    <Flag size={20} />
                  </Button>
                </div>
              </div>
            </div>
        </div>
      </main>

      <Modal
        isOpen={showBorrowModal}
        onClose={() => setShowBorrowModal(false)}
        title="Request to Borrow"
        size="lg"
      >
        <form onSubmit={handleBorrowRequest} className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
            <p className="text-sm text-gray-500">Owner: {item.owner.name} ({item.owner.rollNumber})</p>
          </div>
          <div>
            <label htmlFor="dueDate" className="input-label">Preferred Return Date</label>
            <Input
              id="dueDate"
              type="date"
              value={borrowForm.dueDate}
              onChange={e => setBorrowForm(prev => ({ ...prev, dueDate: e.target.value }))}
              min={defaultDueDate}
              required
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="notes" className="input-label">Message to Owner (optional)</label>
            <textarea
              id="notes"
              value={borrowForm.notes}
              onChange={e => setBorrowForm(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="input-field"
              placeholder="Hi! I'd like to borrow this for my photography project..."
              maxLength={500}
            />
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="ghost" onClick={() => setShowBorrowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={borrowLoading} className="flex-1">
              Send Request
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Item"
        size="xl"
      >
        <EditItemForm
          item={item}
          onClose={() => setShowEditModal(false)}
          onSave={updatedItem => setItem(updatedItem)}
        />
      </Modal>
    </div>
  );
}

function EditItemForm({ item, onClose, onSave }) {
  const toast = useToastHelpers();
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    category: item.category,
    condition: item.condition,
    location: item.location,
    tags: item.tags || [],
    images: item.images || []
  });
  const [errors] = useState({});
  const [saving, setSaving] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateItem(item._id, {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        tags: formData.tags,
        images: formData.images
      });
      onSave(updated);
      toast.success('Item updated', 'Your changes have been saved.');
      onClose();
    } catch (err) {
      toast.error('Could not save changes', getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
      <div className="grid sm:grid-cols-2 gap-4">
        <Input
          label="Title"
          value={formData.title}
          onChange={e => handleChange('title', e.target.value)}
          error={errors.title}
        />
        <select
          value={formData.category}
          onChange={e => handleChange('category', e.target.value)}
          className="input-field"
        >
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div>
        <label className="input-label">Description</label>
        <textarea
          value={formData.description}
          onChange={e => handleChange('description', e.target.value)}
          rows={4}
          className="input-field"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <select
          value={formData.condition}
          onChange={e => handleChange('condition', e.target.value)}
          className="input-field"
        >
          {CONDITIONS.map(cond => <option key={cond} value={cond}>{cond}</option>)}
        </select>
        <Input
          label="Location"
          value={formData.location}
          onChange={e => handleChange('location', e.target.value)}
        />
      </div>

      <div>
        <label className="input-label">Tags</label>
        <TagInput
          value={formData.tags}
          onChange={tags => handleChange('tags', tags)}
          maxTags={10}
          suggestions={['photography', '4k', 'mirrorless', 'canon', 'textbook', 'engineering', 'calculator', 'graphing', 'arduino', 'embedded', 'iot', 'sensors']}
        />
      </div>

      <div>
        <label className="input-label">Images</label>
        <ImageUpload
          images={formData.images}
          onImagesChange={images => handleChange('images', images)}
          maxImages={5}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        <Button type="button" variant="ghost" onClick={onClose} disabled={saving}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  );
}

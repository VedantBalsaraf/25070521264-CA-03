import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useItems } from '../context';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { TagInput } from '../components/common/Badge';
import { ImageUpload } from '../components/items';
import { cn } from '../utils/formatters';
import { CATEGORIES, CONDITIONS, VALIDATION } from '../utils/constants';
import { stockImagesFor } from '../utils/images';
import { ChevronRight, Check, X, Camera, Image } from 'lucide-react';

const STEPS = [
  { id: 'basic', label: 'Basic Info', icon: '1' },
  { id: 'images', label: 'Images', icon: '2' },
  { id: 'details', label: 'Details', icon: '3' }
];

const initialFormData = {
  title: '',
  description: '',
  category: '',
  condition: '',
  location: '',
  tags: [],
  images: [],
  availability: 'always'
};

export function ShareItemPage() {
  const navigate = useNavigate();
  const { createItem, loading: createLoading } = useItems();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const validateStep = (stepIndex) => {
    const newErrors = {};
    const data = formData;

    if (stepIndex === 0) {
      if (!data.title.trim()) newErrors.title = 'Title is required';
      else if (data.title.length < 3) newErrors.title = 'Title must be at least 3 characters';
      else if (data.title.length > VALIDATION.TITLE_MAX_LENGTH) newErrors.title = `Title must be less than ${VALIDATION.TITLE_MAX_LENGTH} characters`;

      if (!data.description.trim()) newErrors.description = 'Description is required';
      else if (data.description.length < 10) newErrors.description = 'Description must be at least 10 characters';
      else if (data.description.length > VALIDATION.DESCRIPTION_MAX_LENGTH) newErrors.description = `Description must be less than ${VALIDATION.DESCRIPTION_MAX_LENGTH} characters`;

      if (!data.category) newErrors.category = 'Category is required';
      if (!data.condition) newErrors.condition = 'Condition is required';
    }

    if (stepIndex === 1) {
      if (data.images.length === 0) newErrors.images = 'At least one image is required';
      else if (data.images.length > VALIDATION.IMAGES_MAX_COUNT) newErrors.images = `Maximum ${VALIDATION.IMAGES_MAX_COUNT} images allowed`;
    }

    if (stepIndex === 2) {
      if (!data.location.trim()) newErrors.location = 'Location is required';
      else if (data.location.length < 2) newErrors.location = 'Location must be at least 2 characters';
      else if (data.location.length > 100) newErrors.location = 'Location must be less than 100 characters';

      if (data.tags.length > VALIDATION.TAGS_MAX_COUNT) newErrors.tags = `Maximum ${VALIDATION.TAGS_MAX_COUNT} tags allowed`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleNext = () => {
    if (imageUploading) return;
    if (validateStep(currentStep)) {
      if (currentStep < STEPS.length - 1) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (imageUploading || submitting || createLoading) return;
    if (!validateStep(currentStep)) return;
    if (!validateStep(1)) return;
    if (!validateStep(2)) return;

    setSubmitting(true);
    try {
      await createItem({
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim()
      });
      navigate('/dashboard?tab=my-items', { state: { success: 'Item shared successfully!' } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create item';
      setErrors({ form: message });
    } finally {
      setSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="share-form-steps mb-8" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={STEPS.length}>
      {STEPS.map((step, index) => (
        <div key={step.id} className="share-form-step flex flex-col items-center">
          <div className={cn(
            'share-form-step-number w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all',
            index < currentStep ? 'completed' : index === currentStep ? 'active' : ''
          )}>
            {index < currentStep ? <Check size={20} /> : step.icon}
          </div>
          <span className="share-form-step-label mt-1 text-sm font-medium">{step.label}</span>
          {index < STEPS.length - 1 && (
            <div className={cn(
              'share-form-step-connector hidden md:block w-full h-0.5 mt-5',
              index < currentStep ? 'completed' : ''
            )} />
          )}
        </div>
      ))}
    </div>
  );

  const renderBasicInfoStep = () => (
    <div className="share-form-panel active space-y-6">
      <div>
        <h3 className="share-form-section-title">Basic Information</h3>
        <div className="space-y-4">
          <Input
            label="Item Title"
            placeholder="e.g., Canon EOS R50 Camera Kit"
            value={formData.title}
            onChange={e => handleChange('title', e.target.value)}
            onBlur={() => handleBlur('title')}
            error={touched.title ? errors.title : undefined}
            maxLength={VALIDATION.TITLE_MAX_LENGTH}
          />
          <div>
            <label className="input-label">Description</label>
            <textarea
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              onBlur={() => handleBlur('description')}
              rows={5}
              className={cn('input-field', touched.description && errors.description && 'error')}
              placeholder="Describe your item in detail. Include specifications, accessories, any wear/defects, and why someone would want to borrow it."
              maxLength={VALIDATION.DESCRIPTION_MAX_LENGTH}
            />
            {touched.description && errors.description && <p className="input-error"><X size={14} />{errors.description}</p>}
            <p className="input-hint">{formData.description.length}/{VALIDATION.DESCRIPTION_MAX_LENGTH} characters</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="input-label">Category</label>
              <select
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
                onBlur={() => handleBlur('category')}
                className={cn('input-field', touched.category && errors.category && 'error')}
              >
                <option value="">Select category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {touched.category && errors.category && <p className="input-error"><X size={14} />{errors.category}</p>}
            </div>
            <div>
              <label className="input-label">Condition</label>
              <select
                value={formData.condition}
                onChange={e => handleChange('condition', e.target.value)}
                onBlur={() => handleBlur('condition')}
                className={cn('input-field', touched.condition && errors.condition && 'error')}
              >
                <option value="">Select condition</option>
                {CONDITIONS.map(cond => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
              {touched.condition && errors.condition && <p className="input-error"><X size={14} />{errors.condition}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderImagesStep = () => (
    <div className="share-form-panel active space-y-6">
      <div>
        <h3 className="share-form-section-title">Upload Images</h3>
        <p className="text-gray-600 mb-4">Add clear photos of your item. Multiple angles help borrowers know exactly what they're getting.</p>
        <ImageUpload
          images={formData.images}
          onImagesChange={images => handleChange('images', images)}
          onUploadingChange={setImageUploading}
          maxImages={VALIDATION.IMAGES_MAX_COUNT}
        />
        {errors.images && <p className="input-error"><X size={14} />{errors.images}</p>}
      </div>

      <div>
        <h3 className="share-form-section-title">Or Search Unsplash</h3>
        <p className="text-gray-600 mb-4">Can't take photos? Search for professional images that match your item.</p>
        <UnsplashSearch
          category={formData.category}
          onSelect={images => handleChange('images', [...formData.images, ...images].slice(0, VALIDATION.IMAGES_MAX_COUNT))}
          maxImages={VALIDATION.IMAGES_MAX_COUNT - formData.images.length}
        />
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="share-form-panel active space-y-6">
      <div>
        <h3 className="share-form-section-title">Location & Availability</h3>
        <div className="space-y-4">
          <Input
            label="Pickup Location"
            placeholder="e.g., Library Block A, Hostel B Room 204, Innovation Lab"
            value={formData.location}
            onChange={e => handleChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            error={touched.location ? errors.location : undefined}
            maxLength={100}
          />
          <div>
            <label className="input-label">Tags (optional)</label>
            <TagInput
              value={formData.tags}
              onChange={tags => handleChange('tags', tags)}
              placeholder="Add tags (e.g., photography, 4k, mirrorless)"
              maxTags={VALIDATION.TAGS_MAX_COUNT}
              suggestions={['photography', '4k', 'mirrorless', 'textbook', 'engineering', 'calculator', 'graphing', 'arduino', 'embedded', 'iot', 'sensors', 'multimeter', 'electrical', 'measurement', 'laptop', 'macbook', 'ml', 'coding']}
            />
            {errors.tags && <p className="input-error"><X size={14} />{errors.tags}</p>}
          </div>
          <div>
            <label className="input-label">Availability</label>
            <select
              value={formData.availability}
              onChange={e => handleChange('availability', e.target.value)}
              className="input-field"
            >
              <option value="always">Always Available</option>
              <option value="weekdays">Weekdays Only</option>
              <option value="weekends">Weekends Only</option>
              <option value="custom">Custom Schedule</option>
            </select>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-100">
        <h3 className="share-form-section-title">Preview</h3>
        <div className="card p-4">
          <h4 className="font-semibold text-gray-900 mb-1">{formData.title || 'Item Title'}</h4>
          <p className="text-sm text-gray-600 mb-2">{formData.description ? formData.description.substring(0, 100) + '...' : 'Description will appear here'}</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.category && <span className="px-2 py-1 rounded-full text-xs bg-primary-100 text-primary-700">{formData.category}</span>}
            {formData.condition && <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">{formData.condition}</span>}
            <span className="px-2 py-1 rounded-full text-xs bg-success-100 text-success-700">Available</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Camera size={14} />
            {formData.images.length} images
            <span className="mx-1">•</span>
            <Image size={14} />
            {formData.tags.length} tags
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="share-page min-h-screen bg-gray-50 py-8 sm:py-12">
      <div className="container max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Share an Item</h1>
          <p className="text-gray-600">Help your campus community by listing items you rarely use</p>
        </div>

        <form onSubmit={handleSubmit} className="card share-item-form p-5 sm:p-8 lg:p-10">
          {renderStepIndicator()}

          <div className="share-form-steps-content">
            {currentStep === 0 && renderBasicInfoStep()}
            {currentStep === 1 && renderImagesStep()}
            {currentStep === 2 && renderDetailsStep()}
          </div>

          <div className="share-form-actions flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button type="button" variant="ghost" onClick={handleBack} disabled={currentStep === 0 || submitting}>
              Back
            </Button>
            <div className="flex gap-3">
              {currentStep < STEPS.length - 1 ? (
              <Button type="button" variant="primary" onClick={handleNext} disabled={submitting || imageUploading}>
                  {imageUploading ? 'Preparing photos…' : 'Next'}
                  <ChevronRight size={18} />
                </Button>
              ) : (
                <Button type="submit" variant="primary" size="lg" loading={submitting || createLoading} disabled={submitting || createLoading || imageUploading}>
                  {imageUploading ? 'Preparing photos…' : 'Publish Item'}
                </Button>
              )}
            </div>
          </div>

          {errors.form && (
            <div className="mt-4 p-4 bg-error-50 border border-error-200 rounded-lg text-error-700" role="alert">
              {errors.form}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

function UnsplashSearch({ category, onSelect, maxImages }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(new Set());

  const searchUnsplash = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const keywords = category?.toLowerCase() || query.toLowerCase();
      const urls = stockImagesFor(keywords, 12, 400, 300);
      setResults(urls);
      setSelected(new Set());
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') searchUnsplash();
  };

  const toggleSelect = (index) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else if (next.size < maxImages) {
        next.add(index);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    const selectedUrls = Array.from(selected).map(i => results[i]);
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      setSelected(new Set());
    }
  };

  return (
    <div className="unsplash-search">
      <div className="flex gap-2 mb-4">
        <Input
          placeholder={`Search for ${category || 'item'} images...`}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <Button variant="outline" onClick={searchUnsplash} loading={loading} disabled={!query.trim()}>
          Search
        </Button>
      </div>

      {results.length > 0 && (
        <div className="unsplash-results">
          {results.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleSelect(i)}
              className={cn(
                'unsplash-result',
                selected.has(i) && 'selected'
              )}
              aria-pressed={selected.has(i)}
              disabled={selected.size >= maxImages && !selected.has(i)}
            >
              <img src={url} alt={`${query} ${i + 1}`} loading="lazy" />
              {selected.has(i) && (
                <div className="absolute inset-0 bg-primary-500/20 flex items-center justify-center">
                  <Check size={24} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {selected.size > 0 && (
        <Button
          variant="primary"
          size="sm"
          className="w-full mt-3"
          onClick={handleAddSelected}
        >
          Add {selected.size} Image{selected.size > 1 ? 's' : ''}
        </Button>
      )}
    </div>
  );
}

import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title must be less than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [2000, 'Description must be less than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Books', 'Electronics', 'Tools', 'Cameras', 'Calculators', 'Project Equipment', 'Other'],
      message: 'Invalid category'
    }
  },
  condition: {
    type: String,
    required: [true, 'Condition is required'],
    enum: {
      values: ['New', 'Like New', 'Good', 'Fair'],
      message: 'Invalid condition'
    }
  },
  images: [{
    type: String,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v) || /^data:image\/.+;base64,/.test(v);
      },
      message: 'Invalid image URL format'
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Available', 'Reserved', 'Borrowed', 'Maintenance', 'Removed'],
      message: 'Invalid status'
    },
    default: 'Available'
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true,
    minlength: [2, 'Location must be at least 2 characters'],
    maxlength: [100, 'Location must be less than 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    maxlength: [30, 'Tag must be less than 30 characters']
  }],
  borrowCount: {
    type: Number,
    default: 0,
    min: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  availability: {
    type: String,
    enum: ['always', 'weekdays', 'weekends', 'custom'],
    default: 'always'
  },
  customAvailability: {
    type: Map,
    of: [{
      start: String,
      end: String
    }]
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

itemSchema.index({ owner: 1 });
itemSchema.index({ category: 1 });
itemSchema.index({ status: 1 });
itemSchema.index({ location: 1 });
itemSchema.index({ tags: 1 });
itemSchema.index({ createdAt: -1 });
itemSchema.index({ title: 'text', description: 'text', tags: 'text' });

itemSchema.virtual('isAvailable').get(function() {
  return this.status === 'Available';
});

itemSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name rollNumber department year avatar' }
});

itemSchema.pre('save', function() {
  if (this.tags) {
    this.tags = [...new Set(this.tags.map(tag => tag.toLowerCase()))];
  }
});

const Item = mongoose.model('Item', itemSchema);

export default Item;

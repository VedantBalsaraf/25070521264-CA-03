import mongoose from 'mongoose';

const borrowRequestSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
    required: [true, 'Item is required']
  },
  borrower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Borrower is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  status: {
    type: String,
    enum: {
      values: ['Pending', 'Approved', 'Rejected', 'Active', 'Returned', 'Cancelled'],
      message: 'Invalid status'
    },
    default: 'Pending'
  },
  requestedAt: {
    type: Date,
    default: Date.now
  },
  approvedAt: {
    type: Date,
    default: null
  },
  borrowedAt: {
    type: Date,
    default: null
  },
  returnedAt: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    required: [true, 'Due date is required'],
    validate: {
      validator: function(value) {
        return value > this.requestedAt;
      },
      message: 'Due date must be after request date'
    }
  },
  notes: {
    type: String,
    trim: true,
    maxlength: [500, 'Notes must be less than 500 characters'],
    default: ''
  },
  rejectionReason: {
    type: String,
    trim: true,
    maxlength: [500, 'Rejection reason must be less than 500 characters'],
    default: ''
  },
  returnNotes: {
    type: String,
    trim: true,
    maxlength: [500, 'Return notes must be less than 500 characters'],
    default: ''
  },
  isOverdue: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

borrowRequestSchema.index({ borrower: 1 });
borrowRequestSchema.index({ owner: 1 });
borrowRequestSchema.index({ item: 1 });
borrowRequestSchema.index({ status: 1 });
borrowRequestSchema.index({ requestedAt: -1 });
borrowRequestSchema.index({ dueDate: 1 });
borrowRequestSchema.index({ borrower: 1, status: 1 });
borrowRequestSchema.index({ owner: 1, status: 1 });

borrowRequestSchema.virtual('itemDetails', {
  ref: 'Item',
  localField: 'item',
  foreignField: '_id',
  justOne: true,
  options: { select: 'title images category status owner location borrowCount' }
});

borrowRequestSchema.virtual('borrowerDetails', {
  ref: 'User',
  localField: 'borrower',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name rollNumber department year avatar' }
});

borrowRequestSchema.virtual('ownerDetails', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id',
  justOne: true,
  options: { select: 'name rollNumber department year avatar' }
});

borrowRequestSchema.virtual('isOverdueVirtual').get(function() {
  if (this.status === 'Active' || this.status === 'Approved') {
    return new Date() > this.dueDate;
  }
  return false;
});

borrowRequestSchema.virtual('daysUntilDue').get(function() {
  if (this.status === 'Active' || this.status === 'Approved') {
    const diff = this.dueDate - new Date();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
  return null;
});

borrowRequestSchema.pre('save', function() {
  if (this.isModified('status')) {
    switch (this.status) {
      case 'Approved':
        this.approvedAt = new Date();
        break;
      case 'Active':
        if (!this.borrowedAt) this.borrowedAt = new Date();
        break;
      case 'Returned':
        this.returnedAt = new Date();
        break;
    }
  }
});

borrowRequestSchema.methods.canBeApprovedBy = function(userId) {
  return this.owner.toString() === userId.toString() && this.status === 'Pending';
};

borrowRequestSchema.methods.canBeRejectedBy = function(userId) {
  return this.owner.toString() === userId.toString() && this.status === 'Pending';
};

borrowRequestSchema.methods.canBeBorrowedBy = function(userId) {
  return this.owner.toString() === userId.toString() && this.status === 'Approved';
};

borrowRequestSchema.methods.canBeReturnedBy = function(userId) {
  return this.owner.toString() === userId.toString() && this.status === 'Active';
};

borrowRequestSchema.methods.canBeCancelledBy = function(userId) {
  return this.borrower.toString() === userId.toString() && 
         ['Pending', 'Approved'].includes(this.status);
};

const BorrowRequest = mongoose.model('BorrowRequest', borrowRequestSchema);

export default BorrowRequest;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  tradingName: {
    type: String,
    trim: true
  },
  acn: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{9}$/.test(v);
      },
      message: props => `${props.value} is not a valid ACN!`
    }
  },
  abn: {
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return /^\d{11}$/.test(v);
      },
      message: props => `${props.value} is not a valid ABN!`
    }
  },
  incorporationDate: {
    type: Date
  },
  businessType: {
    type: String,
    enum: ['Sole Trader', 'Partnership', 'Company', 'Trust', 'Other']
  },
  businessDescription: {
    type: String
  },
  operatingRegion: {
    type: String
  },
  contactDetails: {
    address: String,
    phone: String,
    email: String,
    website: String
  },
  directors: [{
    name: String,
    position: String,
    phone: String,
    email: String,
    background: String
  }],
  financialStatus: {
    difficultiesStartDate: Date,
    currentDebtAmount: Number,
    atoDebtAmount: Number,
    cashFlowStatus: String,
    previousPaymentArrangements: String,
    previousRestructuringAttempts: String
  },
  businessOperations: {
    employeeCount: Number,
    annualRevenue: Number,
    majorAssets: String,
    majorLiabilities: String,
    currentInitiatives: String,
    plannedChanges: String
  },
  assignedPractitioner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'archived'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
clientSchema.index({ companyName: 1 });
clientSchema.index({ acn: 1 });
clientSchema.index({ abn: 1 });
clientSchema.index({ status: 1 });
clientSchema.index({ assignedPractitioner: 1 });

module.exports = mongoose.model('Client', clientSchema);

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dataCollectionSchema = new Schema({
  caseId: {
    type: Schema.Types.ObjectId,
    ref: 'Case',
    required: [true, 'Case is required']
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  status: {
    type: String,
    enum: ['draft', 'complete'],
    default: 'draft'
  },
  companyInformation: {
    companyName: String,
    tradingName: String,
    acn: String,
    abn: String,
    businessType: String,
    incorporationDate: Date,
    businessDescription: String,
    operatingRegion: String,
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
    }]
  },
  financialDetails: {
    difficultiesStartDate: Date,
    currentDebtAmount: Number,
    atoDebtAmount: Number,
    cashFlowStatus: String,
    previousPaymentArrangements: String,
    previousRestructuringAttempts: String,
    securedDebtAmount: Number,
    unsecuredDebtAmount: Number,
    atoDebtComposition: [String],
    profitabilityStatus: String,
    monthlyOperatingCosts: Number
  },
  businessOperations: {
    employeeCount: Number,
    annualRevenue: Number,
    previousYearRevenue: Number,
    preCOVIDRevenue: Number,
    majorAssets: String,
    majorLiabilities: String,
    currentInitiatives: String,
    plannedChanges: String,
    relatedPartyDebts: Boolean,
    relatedPartyDebtsDetails: String
  },
  creditorInformation: {
    creditors: [{
      name: String,
      type: {
        type: String,
        enum: ['secured', 'unsecured', 'priority', 'related']
      },
      amount: Number,
      details: String,
      contactPerson: String,
      contactEmail: String,
      contactPhone: String
    }],
    totalCreditors: Number,
    securedCreditorCount: Number,
    unsecuredCreditorCount: Number,
    priorityCreditorCount: Number,
    relatedPartyCreditorCount: Number
  },
  documents: [{
    name: String,
    type: String,
    fileUrl: String,
    uploadDate: {
      type: Date,
      default: Date.now
    },
    category: {
      type: String,
      enum: ['financial', 'legal', 'corporate', 'other']
    }
  }],
  completedSections: {
    companyInformation: {
      type: Boolean,
      default: false
    },
    financialDetails: {
      type: Boolean,
      default: false
    },
    businessOperations: {
      type: Boolean,
      default: false
    },
    creditorInformation: {
      type: Boolean,
      default: false
    },
    documents: {
      type: Boolean,
      default: false
    }
  },
  lastUpdatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
dataCollectionSchema.index({ caseId: 1 });
dataCollectionSchema.index({ clientId: 1 });
dataCollectionSchema.index({ status: 1 });

module.exports = mongoose.model('DataCollection', dataCollectionSchema);

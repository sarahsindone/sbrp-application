const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reportTemplateSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Template name is required'],
    unique: true
  },
  description: String,
  sections: [{
    title: String,
    content: String,
    order: Number,
    isRequired: {
      type: Boolean,
      default: true
    },
    variables: [String]
  }],
  headerTemplate: String,
  footerTemplate: String,
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  isDefault: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const reportSchema = new Schema({
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
  dataCollectionId: {
    type: Schema.Types.ObjectId,
    ref: 'DataCollection',
    required: [true, 'Data collection is required']
  },
  templateId: {
    type: Schema.Types.ObjectId,
    ref: 'ReportTemplate'
  },
  title: {
    type: String,
    required: [true, 'Report title is required']
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'final', 'published'],
    default: 'draft'
  },
  sections: [{
    title: String,
    content: String,
    order: Number,
    lastEdited: Date
  }],
  metadata: {
    reportDate: {
      type: Date,
      default: Date.now
    },
    reportNumber: String,
    version: {
      type: Number,
      default: 1
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  generatedPdfUrl: String,
  publishedDate: Date,
  lastEditedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
reportTemplateSchema.index({ name: 1 });
reportTemplateSchema.index({ isDefault: 1 });

reportSchema.index({ caseId: 1 });
reportSchema.index({ clientId: 1 });
reportSchema.index({ status: 1 });
reportSchema.index({ 'metadata.reportDate': 1 });

const ReportTemplate = mongoose.model('ReportTemplate', reportTemplateSchema);
const Report = mongoose.model('Report', reportSchema);

module.exports = { ReportTemplate, Report };

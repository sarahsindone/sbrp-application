const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const caseSchema = new Schema({
  caseNumber: {
    type: String,
    required: [true, 'Case number is required'],
    unique: true,
    trim: true
  },
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Client is required']
  },
  caseType: {
    type: String,
    enum: ['SBRP'],
    default: 'SBRP'
  },
  appointmentDate: {
    type: Date,
    required: [true, 'Appointment date is required']
  },
  status: {
    type: String,
    enum: ['data-collection', 'analysis', 'plan-development', 'report-generation', 'creditor-voting', 'implementation', 'completed'],
    default: 'data-collection'
  },
  assignedUsers: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  primaryContact: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Primary contact is required']
  },
  deadlines: {
    dataCollectionDeadline: Date,
    reportGenerationDeadline: Date,
    creditorVotingDeadline: Date,
    disputeDeadline: Date
  },
  notes: String
}, {
  timestamps: true
});

// Create indexes for frequently queried fields
caseSchema.index({ caseNumber: 1 });
caseSchema.index({ clientId: 1 });
caseSchema.index({ status: 1 });
caseSchema.index({ assignedUsers: 1 });
caseSchema.index({ primaryContact: 1 });

module.exports = mongoose.model('Case', caseSchema);

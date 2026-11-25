const mongoose = require('mongoose');

const foodRequestSchema = new mongoose.Schema({
  donation: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  ngo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requestedQuantity: { type: Number, required: true, min: 1 },
  beneficiaries: { type: Number, required: true, min: 1 },
  message: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('FoodRequest', foodRequestSchema);

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  category: { type: String, enum: ['Cooked Meals', 'Bakery Items', 'Fruits', 'Vegetables', 'Packaged Food', 'Dairy Products', 'Other'], required: true },
  quantity: { type: Number, required: true, min: 1 },
  remainingQuantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
  preparedAt: { type: Date, required: true },
  pickupDeadline: { type: Date, required: true },
  pickupAddress: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  postalCode: { type: String, trim: true, default: '' },
  image: { type: String, trim: true, default: '' },
  allergens: { type: String, trim: true, default: '' },
  status: { type: String, enum: ['available', 'reserved', 'completed', 'expired'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);

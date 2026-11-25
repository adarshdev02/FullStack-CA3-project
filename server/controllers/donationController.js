const mongoose = require('mongoose');
const Donation = require('../models/Donation');

const fields = ['title', 'description', 'category', 'quantity', 'unit', 'preparedAt', 'pickupDeadline', 'pickupAddress', 'city'];
function validate(body) {
  const missing = fields.filter((field) => body[field] === undefined || body[field] === '');
  if (missing.length) return `Required fields missing: ${missing.join(', ')}`;
  if (Number(body.quantity) < 1) return 'Quantity must be at least 1';
  if (new Date(body.pickupDeadline) <= new Date()) return 'Pickup deadline must be in the future';
  return null;
}

async function createDonation(req, res) {
  const error = validate(req.body);
  if (error) return res.status(400).json({ message: error });
  const donation = await Donation.create({ ...req.body, quantity: Number(req.body.quantity), remainingQuantity: Number(req.body.quantity), donor: req.user.id });
  res.status(201).json(donation);
}
async function listDonations(req, res) {
  const query = { status: { $in: ['available', 'reserved'] }, pickupDeadline: { $gt: new Date() } };
  if (req.query.category) query.category = req.query.category;
  if (req.query.city) query.city = new RegExp(req.query.city, 'i');
  const donations = await Donation.find(query).populate('donor', 'name organizationName phone').sort({ createdAt: -1 });
  res.json(donations);
}
async function myDonations(req, res) {
  res.json(await Donation.find({ donor: req.user.id }).sort({ createdAt: -1 }));
}
async function getDonation(req, res) {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid donation id' });
  const donation = await Donation.findById(req.params.id).populate('donor', 'name organizationName phone');
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  res.json(donation);
}
async function updateDonation(req, res) {
  const donation = await Donation.findOne({ _id: req.params.id, donor: req.user.id });
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  const error = validate({ ...donation.toObject(), ...req.body });
  if (error) return res.status(400).json({ message: error });
  Object.assign(donation, req.body);
  if (req.body.quantity !== undefined) donation.remainingQuantity = Math.min(donation.remainingQuantity, Number(req.body.quantity));
  await donation.save();
  res.json(donation);
}
async function deleteDonation(req, res) {
  const donation = await Donation.findOneAndDelete({ _id: req.params.id, donor: req.user.id });
  if (!donation) return res.status(404).json({ message: 'Donation not found' });
  res.json({ message: 'Donation deleted' });
}
module.exports = { createDonation, listDonations, myDonations, getDonation, updateDonation, deleteDonation };

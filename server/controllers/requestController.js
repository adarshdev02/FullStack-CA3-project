const FoodRequest = require('../models/FoodRequest');
const Donation = require('../models/Donation');

async function createRequest(req, res) {
  const { donationId, requestedQuantity, beneficiaries, message } = req.body;
  const donation = await Donation.findById(donationId);
  if (!donation || donation.status === 'completed' || donation.pickupDeadline <= new Date() || donation.remainingQuantity < Number(requestedQuantity)) return res.status(400).json({ message: 'Donation is unavailable or quantity is insufficient' });
  if (await FoodRequest.findOne({ donation: donationId, ngo: req.user.id, status: { $in: ['pending', 'approved'] } })) return res.status(409).json({ message: 'You already have an active request for this donation' });
  const request = await FoodRequest.create({ donation: donationId, ngo: req.user.id, requestedQuantity: Number(requestedQuantity), beneficiaries: Number(beneficiaries), message });
  res.status(201).json(await request.populate('donation', 'title city unit'));
}
async function myRequests(req, res) {
  res.json(await FoodRequest.find({ ngo: req.user.id }).populate('donation', 'title city unit pickupDeadline donor').sort({ createdAt: -1 }));
}
async function receivedRequests(req, res) {
  const donations = await Donation.find({ donor: req.user.id }).select('_id');
  res.json(await FoodRequest.find({ donation: { $in: donations } }).populate('donation', 'title unit').populate('ngo', 'name organizationName email').sort({ createdAt: -1 }));
}
async function updateStatus(req, res) {
  const request = await FoodRequest.findById(req.params.id).populate('donation');
  if (!request) return res.status(404).json({ message: 'Request not found' });
  const isDonor = request.donation.donor.toString() === req.user.id;
  const isNgo = request.ngo.toString() === req.user.id;
  if (!isDonor && !isNgo) return res.status(403).json({ message: 'Not authorized' });
  const { status } = req.body;
  if (isDonor && !['approved', 'rejected', 'completed'].includes(status)) return res.status(400).json({ message: 'Invalid donor status' });
  if (isNgo && status !== 'cancelled') return res.status(400).json({ message: 'Invalid NGO status' });
  if (status === 'approved') {
    if (request.donation.remainingQuantity < request.requestedQuantity) return res.status(400).json({ message: 'Not enough food remains' });
    request.donation.remainingQuantity -= request.requestedQuantity;
    request.donation.status = request.donation.remainingQuantity === 0 ? 'reserved' : 'available';
    await request.donation.save();
  }
  request.status = status;
  await request.save();
  res.json(request);
}
module.exports = { createRequest, myRequests, receivedRequests, updateStatus };

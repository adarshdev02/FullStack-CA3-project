const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

function createToken(user) {
  return jwt.sign({ id: user._id, role: user.role === 'user' ? 'donor' : user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function publicUser(user) {
  return { id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role === 'user' ? 'donor' : user.role, organizationName: user.organizationName, city: user.city };
}

async function register(req, res) {
  const { name, email, password, phone, role, organizationName, city } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });
  if (password.length < 6) return res.status(400).json({ message: 'Password must be at least 6 characters' });
  if (await User.findOne({ email: email.toLowerCase() })) return res.status(409).json({ message: 'Email is already registered' });

  if (role && !['donor', 'ngo'].includes(role)) return res.status(400).json({ message: 'Invalid account role' });
  const user = await User.create({ name, email, phone, role: role || 'donor', organizationName, city, password: await bcrypt.hash(password, 10) });
  res.status(201).json({ message: 'Account created successfully. Please sign in.', user: publicUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email?.toLowerCase() });
  if (!user || !(await bcrypt.compare(password || '', user.password))) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }
  res.json({ token: createToken(user), user: publicUser(user) });
}

async function me(req, res) {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: publicUser(user) });
}

async function updateProfile(req, res) {
  const { name, phone } = req.body;
  const city = typeof req.body.city === 'string' ? req.body.city.trim() : '';
  if (!name || typeof name !== 'string' || name.trim().length < 2) return res.status(400).json({ message: 'Name must be at least 2 characters' });
  if (req.user.role === 'ngo' && !city) return res.status(400).json({ message: 'City is required for NGO profiles' });
  const profile = { name: name.trim(), phone: typeof phone === 'string' ? phone.trim() : '', city };
  const user = await User.findByIdAndUpdate(req.user.id, profile, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: publicUser(user) });
}

module.exports = { register, login, me, updateProfile };

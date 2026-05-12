import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { logActivity } from '../utils/logger.js';

// @desc    Auth admin & get token
// @route   POST /api/admins/login
// @access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    // Log the login
    await logActivity({
      user: admin.name,
      action: 'LOGIN',
      module: 'Authentication',
      description: `Admin logged in: ${admin.name}`,
      req
    });

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(401).json({ message: 'Invalid admin credentials' });
  }
};

// @desc    Register a new admin
// @route   POST /api/admins
// @access  Public
const registerAdmin = async (req, res) => {
  const { name, email, password } = req.body;

  const adminExists = await Admin.findOne({ email });

  if (adminExists) {
    res.status(400).json({ message: 'Admin already exists' });
    return;
  }

  const admin = await Admin.create({
    name,
    email,
    password,
  });

  if (admin) {
    // Log the registration
    await logActivity({
      user: 'System',
      action: 'CREATE',
      module: 'Authentication',
      description: `New admin account created: ${admin.name} (${admin.email})`,
      req
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id),
    });
  } else {
    res.status(400).json({ message: 'Invalid admin data' });
  }
};

// @desc    Get admin profile
// @route   GET /api/admins/profile
// @access  Private
const getAdminProfile = async (req, res) => {
  const admin = await Admin.findById(req.user._id);

  if (admin) {
    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(404).json({ message: 'Admin not found' });
  }
};

// @desc    Logout admin
// @route   POST /api/admins/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  try {
    const { name } = req.body;
    await logActivity({
      user: name || 'Admin',
      action: 'LOGOUT',
      module: 'Authentication',
      description: `Admin logged out: ${name || 'Unknown'}`,
      req
    });
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update admin password
// @route   PUT /api/admins/password
// @access  Private
const updateAdminPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const admin = await Admin.findById(req.user?._id);

  if (!admin) {
    return res.status(404).json({ message: 'Admin not found' });
  }

  if (await admin.matchPassword(oldPassword)) {
    admin.password = newPassword;
    await admin.save();
    
    await logActivity({
      user: admin.name,
      action: 'UPDATE',
      module: 'Account',
      description: `Admin updated password: ${admin.name}`,
      req
    });

    res.json({ message: 'Password updated successfully' });
  } else {
    res.status(401).json({ message: 'Invalid old password' });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret123', {
    expiresIn: '30d',
  });
};

export { authAdmin, registerAdmin, getAdminProfile, logoutAdmin, updateAdminPassword };

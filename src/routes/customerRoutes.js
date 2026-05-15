import express from 'express';
import Customer from '../models/Customer.js';

const router = express.Router();

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private/Admin (for now public for simplicity or check admin middleware)
router.get('/', async (req, res) => {
  try {
    const customers = await Customer.find({}).sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new customer
// @route   POST /api/customers
// @access  Public
router.post('/', async (req, res) => {
  const { name, phone, email, pincode, city, state, address } = req.body;

  try {
    const customer = await Customer.create({
      name,
      phone,
      email,
      pincode,
      city,
      state,
      address,
    });

    res.status(201).json(customer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a customer
// @route   DELETE /api/customers/:id
// @access  Private/Admin
router.delete('/:id', async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (customer) {
      await Customer.deleteOne({ _id: req.params.id });
      res.json({ message: 'Customer removed' });
    } else {
      res.status(404).json({ message: 'Customer not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

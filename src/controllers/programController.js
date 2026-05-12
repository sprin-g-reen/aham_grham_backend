import Program from '../models/Program.js';
import { logActivity } from '../utils/logger.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all programs
// @route   GET /api/programs
// @access  Public
export const getPrograms = async (req, res) => {
  try {
    const programs = await Program.find({});
    res.json(programs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private/Admin
export const createProgram = async (req, res) => {
  try {
    const { name, programId, bookingPrice, category, description } = req.body;

    const programExists = await Program.findOne({ programId });

    if (programExists) {
      return res.status(400).json({ message: 'Program ID already exists' });
    }

    const program = await Program.create({
      name,
      programId,
      bookingPrice,
      category: category || '',
      description,
      image: req.body.image ? await uploadToCloudinary(req.body.image) : ''
    });

    if (program) {
      await logActivity({
        action: 'CREATE',
        module: 'Programs',
        description: `Created program ${name} (${programId})`,
        req
      });
      res.status(201).json(program);
    } else {
      res.status(400).json({ message: 'Invalid program data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private/Admin
export const deleteProgram = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);

    if (program) {
      const { name, programId } = program;
      await program.deleteOne();
      await logActivity({
        action: 'DELETE',
        module: 'Programs',
        description: `Deleted program ${name} (${programId})`,
        req
      });
      res.json({ message: 'Program removed' });
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private/Admin
export const updateProgram = async (req, res) => {
  try {
    const { name, programId, bookingPrice, description } = req.body;
    const program = await Program.findById(req.params.id);

    if (program) {
      program.name = name || program.name;
      program.programId = programId || program.programId;
      program.bookingPrice = bookingPrice || program.bookingPrice;
      program.description = description || program.description;

      if (req.body.image) {
        program.image = await uploadToCloudinary(req.body.image);
      }

      const updatedProgram = await program.save();
      await logActivity({
        action: 'UPDATE',
        module: 'Programs',
        description: `Updated program ${updatedProgram.name} (${updatedProgram.programId})`,
        req
      });
      res.json(updatedProgram);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Public
export const getProgramById = async (req, res) => {
  try {
    const program = await Program.findById(req.params.id);
    if (program) {
      res.json(program);
    } else {
      res.status(404).json({ message: 'Program not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

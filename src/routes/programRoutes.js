import express from 'express';
import {
  getPrograms,
  createProgram,
  deleteProgram,
  updateProgram,
  getProgramById
} from '../controllers/programController.js';

const router = express.Router();

router.route('/')
  .get(getPrograms)
  .post(createProgram);

router.route('/:id')
  .get(getProgramById)
  .delete(deleteProgram)
  .put(updateProgram);

export default router;

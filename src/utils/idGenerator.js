import Counter from '../models/Counter.js';

/**
 * Generates a sequential ID for a given entity type.
 * @param {string} entityName - The name of the entity (e.g., 'Program', 'Event', 'Testimonial')
 * @param {string} prefix - The prefix for the ID (e.g., 'PROG', 'EVENT', 'TEST')
 * @param {number} [pad=3] - Number of digits to pad with zeros. Use 0 for no padding.
 * @returns {Promise<string>} - The generated ID (e.g., 'PROG-1' or 'PROG-001')
 */
export const generateNextId = async (entityName, prefix, pad = 3) => {
  const counter = await Counter.findOneAndUpdate(
    { id: entityName },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seqStr = pad > 0 ? counter.seq.toString().padStart(pad, '0') : counter.seq.toString();
  return `${prefix}-${seqStr}`;
};

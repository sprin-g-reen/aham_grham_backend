import mongoose from 'mongoose';
import dotenv from 'dotenv';
import About from './src/models/About.js';

dotenv.config();

const updateTimeline = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const timelineData = [
      { year: '2018', title: 'the seed', description: 'founding of aham grham in the rishikesh mountains. a commitment to bridging clinical science with ancient breathwork.', image: 'lotus-2026-01-05-00-53-39-utc.jpg' },
      { year: '2020', title: 'digital transition', description: 'launch of our first online clinical sanctuary, bringing neurological synchronization to homes worldwide during a global shift.', image: 'young-women-doing-yoga-sport-2026-03-24-23-12-41-utc.jpg' },
      { year: '2022', title: 'global expansion', description: 'opening of the swiss alps sanctuary. integrating high-altitude resonance with advanced somatic recovery protocols.', image: 'multinational-women-doing-breathing-exercises-or-y-2026-01-08-23-11-26-utc.jpg' },
      { year: '2024', title: 'innovation peak', description: 'implementation of precision-calibrated harmonic patterns and real-time neuro-respiratory monitoring in all centers.', image: 'YogaClass-GroupSessions.jpg' },
      { year: '2026', title: 'the future', description: 'pioneering biological transcendence for the modern age, expanding to ubud and beyond with a mission of universal calm.', image: '23.jpg' }
    ];

    const about = await About.findOne();
    if (about) {
      about.timeline = timelineData;
      await about.save();
      console.log('Timeline updated successfully!');
    } else {
      await About.create({ timeline: timelineData });
      console.log('New About record created with timeline!');
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

updateTimeline();

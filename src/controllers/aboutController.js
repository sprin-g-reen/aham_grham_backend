import About from '../models/About.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get about page content
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    if (!about) {
      // Create default if not exists
      about = await About.create({
        halfSections: [
          {
            kicker: 'our goals',
            title: 'architectural soul',
            content: 'our sanctuary design follows sacred proportions inspired by both references you shared, creating balance between grounded practice and reflective stillness. every curve and angle is designed to channel natural light, fostering a sense of openness and tranquility that mirrors the expansive nature of the human spirit.'
          },
          {
            kicker: 'our knowledge',
            title: 'breath of the earth',
            content: 'our daily practice is rooted in sustainability, intentional movement, and calm nervous-system support, so each class feels like a reset for both body and environment. we prioritize locally-sourced, non-toxic materials, ensuring that our presence is a healing force for the community and the planet alike.'
          }
        ],
        timeline: [
          { year: '2018', title: 'the seed', description: 'founding of aham grham in the rishikesh mountains. a commitment to bridging clinical science with ancient breathwork.', image: 'lotus-2026-01-05-00-53-39-utc.jpg' },
          { year: '2020', title: 'digital transition', description: 'launch of our first online clinical sanctuary, bringing neurological synchronization to homes worldwide during a global shift.', image: 'young-women-doing-yoga-sport-2026-03-24-23-12-41-utc.jpg' },
          { year: '2022', title: 'global expansion', description: 'opening of the swiss alps sanctuary. integrating high-altitude resonance with advanced somatic recovery protocols.', image: 'multinational-women-doing-breathing-exercises-or-y-2026-01-08-23-11-26-utc.jpg' },
          { year: '2024', title: 'innovation peak', description: 'implementation of precision-calibrated harmonic patterns and real-time neuro-respiratory monitoring in all centers.', image: 'YogaClass-GroupSessions.jpg' },
          { year: '2026', title: 'the future', description: 'pioneering biological transcendence for the modern age, expanding to ubud and beyond with a mission of universal calm.', image: '23.jpg' }
        ]
      });
    }
    res.json(about);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update about page content
// @route   PUT /api/about
// @access  Private/Admin
export const updateAbout = async (req, res) => {
  try {
    let { hero, halfSections, corePhilosophy, lineageVoice, ancientLineage, timeline } = req.body;

    // Parse JSON strings if they come from FormData
    if (typeof hero === 'string') hero = JSON.parse(hero);
    if (typeof halfSections === 'string') halfSections = JSON.parse(halfSections);
    if (typeof corePhilosophy === 'string') corePhilosophy = JSON.parse(corePhilosophy);
    if (typeof lineageVoice === 'string') lineageVoice = JSON.parse(lineageVoice);
    if (typeof ancientLineage === 'string') ancientLineage = JSON.parse(ancientLineage);
    if (typeof timeline === 'string') timeline = JSON.parse(timeline);

    let about = await About.findOne();
    if (!about) about = new About();

    if (hero) {
      about.hero.kicker = hero.kicker || about.hero.kicker;
      about.hero.title = hero.title || about.hero.title;
      about.hero.subtitle = hero.subtitle || about.hero.subtitle;
    }

    if (req.body.heroImage) {
      about.hero.image = await uploadToCloudinary(req.body.heroImage);
    }

    if (halfSections) about.halfSections = halfSections;
    
    if (timeline) {
      // Handle images for timeline milestones
      const processedTimeline = await Promise.all(timeline.map(async (item) => {
        if (item.image && item.image.startsWith('data:')) {
          const uploadedUrl = await uploadToCloudinary(item.image);
          return { ...item, image: uploadedUrl };
        }
        return item;
      }));
      about.timeline = processedTimeline;
    }

    if (corePhilosophy) {
      about.corePhilosophy.title = corePhilosophy.title || about.corePhilosophy.title;
      about.corePhilosophy.content = corePhilosophy.content || about.corePhilosophy.content;
    }

    if (lineageVoice) {
      about.lineageVoice.title = lineageVoice.title || about.lineageVoice.title;
      about.lineageVoice.quote = lineageVoice.quote || about.lineageVoice.quote;
      about.lineageVoice.author = lineageVoice.author || about.lineageVoice.author;
    }

    if (ancientLineage) {
      about.ancientLineage.kicker = ancientLineage.kicker || about.ancientLineage.kicker;
      about.ancientLineage.content = ancientLineage.content || about.ancientLineage.content;
    }

    about.updatedAt = Date.now();
    const updatedAbout = await about.save();
    res.json(updatedAbout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

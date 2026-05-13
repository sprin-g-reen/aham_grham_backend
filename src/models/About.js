import mongoose from 'mongoose';

const aboutSchema = new mongoose.Schema({
  hero: {
    kicker: { type: String, default: 'foundation of spirit' },
    title: { type: String, default: 'the inner landscape' },
    subtitle: { type: String, default: 'we are more than a yoga space. we are a living lineage where ancient breath science meets modern healing rhythm, one mindful step at a time.' },
    image: { type: String, default: 'lotus-2026-01-05-00-53-39-utc.jpg' }
  },
  halfSections: {
    type: [{
      kicker: { type: String },
      title: { type: String },
      content: { type: String }
    }],
    default: [
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
    ]
  },
  corePhilosophy: {
    title: { type: String, default: 'core philosophy' },
    content: { type: String, default: 'yoga is not a workout, it is a work-in. every posture, breath, and pause is a return to inner home. beyond the physical poses lies a path to biological transcendence, where every breath becomes a conscious reconnection with the pulse of the universe and its ancestral rhythms.' }
  },
  lineageVoice: {
    title: { type: String, default: 'lineage voice' },
    quote: { type: String, default: '"tradition is not the worship of ashes, but the preservation of fire." to honor the past is to live the truth in the present. our teachings are a living river, flowing from ancestral peaks to the modern valley.' },
    author: { type: String, default: 'the sage mahavir' }
  },
  ancientLineage: {
    kicker: { type: String, default: 'ancient lineage' },
    content: { type: String, default: '500+ years of oral wisdom carried through movement, breath, and devotion. a commitment to preserving the sacred geometry of the soul through rigorous clinical practice.' }
  },
  timeline: [
    {
      year: { type: String },
      title: { type: String },
      description: { type: String },
      image: { type: String }
    }
  ],
  updatedAt: { type: Date, default: Date.now }
});

const About = mongoose.model('About', aboutSchema);
export default About;

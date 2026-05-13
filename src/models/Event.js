import mongoose from 'mongoose';

const eventSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    eventId: {
      type: String,
      required: true,
      unique: true,
    },
    bookingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    category: {
      type: String,
      enum: ['Regularly Happening', 'Regular events', 'Highlight', 'Upcoming Event'],
      default: 'Regularly Happening'
    },
    description: {
      type: String,
    },
    about: {
      type: String,
    },
    image: {
      type: String,
    },
    video: {
      type: String,
    },
    isBlog: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

const Event = mongoose.model('Event', eventSchema);

export default Event;

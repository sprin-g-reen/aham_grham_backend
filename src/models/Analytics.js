import mongoose from 'mongoose';

const analyticsSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    page: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    ipHash: {
        type: String,
        required: true
    },
    visitorId: String,
    sessionId: String,
    device: {
        type: String,
        default: 'desktop'
    },
    userAgent: String
});


// Index for faster aggregation
analyticsSchema.index({ timestamp: -1 });
analyticsSchema.index({ type: 1, timestamp: -1 });

const Analytics = mongoose.model('Analytics', analyticsSchema);
export default Analytics;

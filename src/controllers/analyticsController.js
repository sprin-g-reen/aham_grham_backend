import Analytics from '../models/Analytics.js';
import crypto from 'crypto';
import { getGA4Stats } from '../services/ga4Service.js';
import dotenv from 'dotenv';

dotenv.config();

// Professional Bot Filtering
const isBot = (userAgent) => {
    if (!userAgent) return false;
    const botPattern = /bot|crawler|spider|headless|uptime|preview|slurp|facebookexternalhit|duckduckgo/i;
    return botPattern.test(userAgent);
};

// Privacy-Safe Hashing (IP + UA)
const generateHash = (ip, userAgent) => {
    return crypto.createHash('sha256').update(ip + (userAgent || '')).digest('hex');
};

export const trackActivity = async (req, res) => {
    try {
        const userAgent = req.headers['user-agent'];
        
        // 1. Bot Filtering
        if (isBot(userAgent)) {
            return res.status(200).json({ success: true, message: 'Bot ignored' });
        }

        const { type, page, visitorId, sessionId, device } = req.body;
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

        const activity = new Analytics({
            type,
            page,
            visitorId,
            sessionId,
            device: device || 'desktop',
            ipHash: generateHash(ip, userAgent),
            userAgent
        });

        await activity.save();
        res.status(201).json({ success: true });
    } catch (error) {
        console.error('Tracking Error:', error);
        res.status(500).json({ message: 'Failed to track activity' });
    }
};

export const getStats = async (req, res) => {
    try {
        if (process.env.GA_PROPERTY_ID) {
            try {
                const gaStats = await getGA4Stats();
                return res.status(200).json(gaStats);
            } catch (gaError) {
                console.error('GA4 Fetch Error, falling back to local:', gaError);
            }
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Professional Aggregation
        const stats = await Analytics.aggregate([
            {
                $facet: {
                    "overview": [
                        {
                            $group: {
                                _id: null,
                                totalViews: { $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] } },
                                uniqueVisitors: { $addToSet: "$visitorId" },
                                totalSessions: { $addToSet: "$sessionId" }
                            }
                        },
                        {
                            $project: {
                                totalViews: 1,
                                uniqueVisitors: { $size: "$uniqueVisitors" },
                                totalSessions: { $size: "$totalSessions" }
                            }
                        }
                    ],
                    "devices": [
                        { $group: { _id: "$device", count: { $sum: 1 } } }
                    ],
                    "topPages": [
                        { $match: { type: "view" } },
                        { $group: { _id: "$page", views: { $sum: 1 } } },
                        { $sort: { views: -1 } },
                        { $limit: 5 }
                    ],
                    "chartData": [
                        {
                            $match: {
                                timestamp: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
                            }
                        },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
                                views: { $sum: { $cond: [{ $eq: ["$type", "view"] }, 1, 0] } },
                                visitors: { $addToSet: "$visitorId" }
                            }
                        },
                        {
                            $project: {
                                date: "$_id",
                                views: 1,
                                visitors: { $size: "$visitors" }
                            }
                        },
                        { $sort: { date: 1 } }
                    ]
                }
            }
        ]);

        const result = stats[0];
        const overview = result.overview[0] || { totalViews: 0, uniqueVisitors: 0, totalSessions: 0 };

        res.status(200).json({
            totalViews: overview.totalViews,
            totalVisitors: overview.uniqueVisitors,
            totalSessions: overview.totalSessions,
            chartData: result.chartData,
            devices: result.devices,
            topPages: result.topPages
        });
    } catch (error) {
        console.error('Stats Error:', error);
        res.status(500).json({ message: 'Failed to fetch stats' });
    }
};

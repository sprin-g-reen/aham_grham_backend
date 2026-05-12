import { BetaAnalyticsDataClient } from '@google-analytics/data';
import dotenv from 'dotenv';

dotenv.config();

const propertyId = process.env.GA_PROPERTY_ID;
const credentialsPath = process.env.GA_CREDENTIALS_PATH;

// Initialize the client
const analyticsDataClient = new BetaAnalyticsDataClient({
    keyFilename: credentialsPath,
});

/**
 * Fetches analytics stats from GA4
 * @returns {Promise<{totalVisitors: number, totalViews: number, chartData: Array}>}
 */
export const getGA4Stats = async () => {
    try {
        // 1. Get Total Visitors and Views for a specific period (e.g., last 30 days)
        const [response] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '30daysAgo',
                    endDate: 'today',
                },
            ],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
        });

        const totalVisitors = parseInt(response.rows[0]?.metricValues[0]?.value || 0);
        const totalViews = parseInt(response.rows[0]?.metricValues[1]?.value || 0);

        // 2. Get Daily Stats for the last 7 days for the chart
        const [chartResponse] = await analyticsDataClient.runReport({
            property: `properties/${propertyId}`,
            dateRanges: [
                {
                    startDate: '7daysAgo',
                    endDate: 'today',
                },
            ],
            dimensions: [{ name: 'date' }],
            metrics: [
                { name: 'activeUsers' },
                { name: 'screenPageViews' },
            ],
            orderBys: [
                {
                    dimension: {
                        dimensionName: 'date',
                    },
                },
            ],
        });

        const chartData = chartResponse.rows.map(row => {
            // GA4 returns date as 'YYYYMMDD', we need 'YYYY-MM-DD'
            const rawDate = row.dimensionValues[0].value;
            const formattedDate = `${rawDate.slice(0, 4)}-${rawDate.slice(4, 6)}-${rawDate.slice(6, 8)}`;
            
            return {
                date: formattedDate,
                visitors: parseInt(row.metricValues[0].value),
                views: parseInt(row.metricValues[1].value),
            };
        });

        return {
            totalVisitors,
            totalViews,
            chartData
        };
    } catch (error) {
        console.error('GA4 API Error:', error);
        throw error;
    }
};

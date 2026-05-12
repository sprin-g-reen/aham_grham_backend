import Activity from '../models/Activity.js';

/**
 * Log an admin activity to the database
 * @param {Object} params
 * @param {string} [params.user] - The user who performed the action
 * @param {string} params.action - CREATE, UPDATE, DELETE, IMPORT, LOGIN
 * @param {string} params.module - The section (e.g., Testimonials)
 * @param {string} params.description - Human readable description
 * @param {Object} [params.details] - Optional extra data
 * @param {string} [params.ip] - Optional IP address
 * @param {Object} [params.req] - Express request object to auto-extract IP/User
 */
export const logActivity = async ({ user, action, module, description, details, ip, req }) => {
  try {
    // Auto-extract IP if req is provided
    let clientIp = ip || (req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress) : 'Unknown');
    
    // Normalize IPv6 loopback and mapped IPv4
    if (clientIp === '::1') {
      clientIp = '127.0.0.1';
    } else if (clientIp.startsWith('::ffff:')) {
      clientIp = clientIp.split(':').pop();
    }
    
    // Auto-extract User if req.user exists (from auth middleware)
    const activeUser = user || (req?.user?.name) || 'Admin';

    await Activity.create({
      user: activeUser,
      action,
      module,
      description,
      details,
      ip: clientIp
    });
  } catch (error) {
    console.error('Failed to log activity:', error);
  }
};

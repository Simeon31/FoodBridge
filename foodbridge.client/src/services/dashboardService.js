import api from './api';

/**
 * Dashboard service for fetching statistics and analytics data
 */
const dashboardService = {
    /**
     * Get comprehensive dashboard statistics
     * @returns {Promise<Object>} Dashboard statistics including donations, inventory, waste, and donors
     */
    getStatistics: async () => {
        try {
            const response = await api.get('/dashboard/statistics');
  return response.data;
        } catch (error) {
       console.error('Error fetching dashboard statistics:', error);
     throw error;
        }
    }
};

export default dashboardService;

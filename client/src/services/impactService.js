import api from './api';

/** @returns {Promise<{itemsShared:number, activeBorrows:number, studentsConnected:number, itemsReused:number}>} */
export async function getCommunityStats() {
  return api.get('/impact/community-stats');
}

/** @returns {Promise<Object>} impact stats for the current user */
export async function getImpactStats() {
  return api.get('/impact/stats');
}

/** @returns {Promise<{history: Object[], pagination: Object}>} */
export async function getImpactHistory(page = 1, limit = 10) {
  return api.get(`/impact/history?page=${page}&limit=${limit}`);
}

/** @returns {Promise<{topSharers: Object[], topBorrowers: Object[]}>} */
export async function getLeaderboard() {
  return api.get('/impact/leaderboard');
}

/** @returns {Promise<{timeline: Object[], categoryDistribution: Object[], monthlyActivity: Object[]}>} */
export async function getChartData() {
  return api.get('/impact/charts');
}

/** @returns {Promise<Blob>} */
export async function exportImpactReport() {
  return api.get('/impact/export', { responseType: 'blob' });
}

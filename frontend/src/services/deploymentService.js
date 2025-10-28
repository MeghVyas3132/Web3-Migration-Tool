import api from './api';

export const deploymentService = {
  async getAllDeployments() {
    const response = await api.get('/deployments');
    return response.data;
  },

  async getDeploymentById(id) {
    const response = await api.get(`/deployments/${id}`);
    return response.data;
  },

  async createDeployment(deploymentData) {
    const response = await api.post('/deployments', deploymentData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  },

  async deleteDeployment(id) {
    const response = await api.delete(`/deployments/${id}`);
    return response.data;
  },

  async checkSubdomainAvailability(subdomain) {
    const response = await api.post('/subdomains/verify', { subdomain });
    return response.data;
  },
};

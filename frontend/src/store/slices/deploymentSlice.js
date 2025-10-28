import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deployments: [],
  currentDeployment: null,
  loading: false,
  error: null,
  uploadProgress: 0,
};

const deploymentSlice = createSlice({
  name: 'deployments',
  initialState,
  reducers: {
    fetchDeploymentsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchDeploymentsSuccess: (state, action) => {
      state.loading = false;
      state.deployments = action.payload;
    },
    fetchDeploymentsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    setCurrentDeployment: (state, action) => {
      state.currentDeployment = action.payload;
    },
    createDeploymentStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    createDeploymentSuccess: (state, action) => {
      state.loading = false;
      state.deployments.push(action.payload);
      state.currentDeployment = action.payload;
    },
    createDeploymentFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    deleteDeploymentSuccess: (state, action) => {
      state.deployments = state.deployments.filter(d => d.id !== action.payload);
    },
  },
});

export const {
  fetchDeploymentsStart,
  fetchDeploymentsSuccess,
  fetchDeploymentsFailure,
  setCurrentDeployment,
  createDeploymentStart,
  createDeploymentSuccess,
  createDeploymentFailure,
  updateUploadProgress,
  deleteDeploymentSuccess,
} = deploymentSlice.actions;

export default deploymentSlice.reducer;

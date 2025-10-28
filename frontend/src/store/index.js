import { configureStore } from '@reduxjs/toolkit';
import deploymentReducer from './slices/deploymentSlice';

const store = configureStore({
  reducer: {
    deployments: deploymentReducer,
  },
});

export default store;

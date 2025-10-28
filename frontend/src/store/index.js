import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import deploymentReducer from './slices/deploymentSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    deployments: deploymentReducer,
  },
});

export default store;

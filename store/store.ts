import { configureStore } from '@reduxjs/toolkit';

import { daoReducer, daosSlice } from './dao';

export const store = configureStore({
  reducer: {
    [daosSlice.name]: daoReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;

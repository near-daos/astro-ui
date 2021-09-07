/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DAO } from 'types/dao';

export interface DaosState {
  daos: DAO[];
  selectedDaoId?: string;
}

const initialState: DaosState = {
  daos: [],
  selectedDaoId: ''
};

export const daosSlice = createSlice({
  name: 'dao',
  initialState,
  reducers: {
    setDAOs: (state, action: PayloadAction<DAO[]>) => {
      state.daos = action.payload;
    },
    setSelectedDAO: (state, action: PayloadAction<string>) => {
      state.selectedDaoId = action.payload;
    }
  }
});

// Action creators are generated for each case reducer function
export const { setDAOs, setSelectedDAO } = daosSlice.actions;

export const daoReducer = daosSlice.reducer;

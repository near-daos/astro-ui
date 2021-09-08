import { RootState } from 'store';
import { createSelector } from '@reduxjs/toolkit';

export function getDaoState(state: RootState): RootState['dao'] {
  return state.dao;
}

export const selectDAOs = createSelector(getDaoState, daoState => {
  const { daos } = daoState;

  return daos;
});

export const selectSelectedDAO = createSelector(getDaoState, daoState => {
  const { daos, selectedDaoId } = daoState;

  return daos.find(d => d.id === selectedDaoId);
});

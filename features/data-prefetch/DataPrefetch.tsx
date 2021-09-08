import { FC, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { setDAOs } from 'store/dao';
import { SputnikService } from 'services/SputnikService';

export const DataPrefetch: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    SputnikService.getDaoList()
      .then(res => {
        const userDaos = res.map(item => ({
          ...item,
          label: item.name,
          id: item.id,
          logo: 'https://i.imgur.com/t5onQz9.png',
          count: item.members
        }));

        dispatch(setDAOs(userDaos));
      })
      .catch(err => {
        console.error(err);
      });
  }, [dispatch]);

  return null;
};

import axios from 'axios';
import get from 'lodash/get';
import { useEffect, useState } from 'react';

export function useNearPrice(): number {
  const [nearPrice, setNearPrice] = useState(0);

  useEffect(() => {
    const { CancelToken } = axios;
    const source = CancelToken.source();

    axios
      .get('/api/nearPrice', { cancelToken: source.token })
      .then(nearPriceData => {
        const price = get(nearPriceData, 'data.near.usd');

        setNearPrice(price);
      })
      .catch(thrown => {
        if (axios.isCancel(thrown)) {
          // do nothing - we cancel request on mount
        }
      });

    return () => {
      source.cancel('Cancelled on unmount');
    };
  }, []);

  return nearPrice;
}

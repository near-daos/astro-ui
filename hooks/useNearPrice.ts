import { useMount } from 'react-use';
import axios from 'axios';
import get from 'lodash/get';
import { useState } from 'react';

export function useNearPrice(): number {
  const [nearPrice, setNearPrice] = useState(0);

  useMount(async () => {
    const nearPriceData = await axios.get('/api/nearPrice');
    const price = get(nearPriceData, 'data.near.usd');

    setNearPrice(price);
  });

  return nearPrice;
}

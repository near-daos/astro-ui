/* eslint-disable import/prefer-default-export */
import { useContext } from 'react';

import {
  RadioContext,
  RadioContextType,
} from 'astro_2.0/components/inputs/radio/RadioGroup';

export const useRadioContext = (): RadioContextType => {
  const context = useContext(RadioContext);

  if (!context) {
    throw new Error(
      'Radio compound components cannot be rendered outside the Radio component'
    );
  }

  return context;
};

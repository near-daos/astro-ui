/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';

import { configService } from 'services/ConfigService';

import { AppMonitoring } from 'astro_2.0/features/AppMonitoring/AppMonitoring';
import React from 'react';

jest.mock('services/ConfigService', () => {
  return {
    configService: {
      get: jest.fn(),
    },
  };
});

jest.mock('next/script', () => {
  return () => <div>Some Script</div>;
});

describe('AppMonitoring', () => {
  it('Should render nothing if google analytics key is false', () => {
    // @ts-ignore
    configService.get.mockImplementation(() => ({
      appConfig: {
        GOOGLE_ANALYTICS_KEY: false,
      },
    }));

    const { container } = render(<AppMonitoring />);

    expect(container).toMatchSnapshot();
  });

  it('Should render scripts', () => {
    // @ts-ignore
    configService.get.mockImplementation(() => ({
      appConfig: {
        GOOGLE_ANALYTICS_KEY: true,
      },
    }));

    const { getAllByText } = render(<AppMonitoring />);

    expect(getAllByText('Some Script')).toHaveLength(2);
  });
});

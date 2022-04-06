/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from 'react';
import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';
import { fireEvent } from '@testing-library/dom';

import { SettingsFilterToggle } from 'astro_2.0/features/DaoGovernance/components/SettingsFilterToggle';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn(),
  };
});

jest.mock('react-use', () => {
  return {
    ...jest.requireActual('react-use'),
    useMedia: jest.fn(() => true),
  };
});

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn((v: string) => [v]),
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('SettingsFilterToggle', () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function, func-names
  window.HTMLElement.prototype.scrollIntoView = function () {};

  it('Should render daoConfig filter', () => {
    // @ts-ignore
    useRouter.mockImplementation(() => ({
      query: {
        daoFilter: 'someFilter',
      },
    }));

    const { getAllByText } = render(<SettingsFilterToggle />);

    expect(getAllByText('daoConfig')).toHaveLength(2);
  });

  it('Should render daoPolicy filter', () => {
    // @ts-ignore
    useRouter.mockImplementation(() => ({
      query: {
        daoFilter: 'proposalCreation',
      },
    }));

    const { getAllByText } = render(<SettingsFilterToggle />);

    expect(getAllByText('settingsPage.daoPolicy')).toHaveLength(2);
  });

  it('Should switch to daoConfig filter', () => {
    const setActiveFilter = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, setActiveFilter]);

    // @ts-ignore
    useRouter.mockImplementation(() => ({
      query: {
        daoFilter: 'someFilter',
      },
      replace: () => 0,
    }));

    const { getAllByRole } = render(<SettingsFilterToggle />);

    fireEvent.click(getAllByRole('button')[0]);

    expect(setActiveFilter).toBeCalledWith('daoConfig');
  });

  it('Should switch to daoPolicy filter', () => {
    const setActiveFilter = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [true, setActiveFilter]);

    // @ts-ignore
    useRouter.mockImplementation(() => ({
      query: {
        daoFilter: 'someFilter',
      },
      replace: () => 0,
    }));

    const { getAllByRole } = render(<SettingsFilterToggle />);

    fireEvent.click(getAllByRole('button')[1]);

    expect(setActiveFilter).toBeCalledWith('daoPolicy');
  });
});

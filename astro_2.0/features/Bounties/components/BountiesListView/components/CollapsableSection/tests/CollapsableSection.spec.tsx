import React from 'react';
import { DAO } from 'types/dao';
import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { CollapsableSection } from 'astro_2.0/features/Bounties/components/BountiesListView/components/CollapsableSection';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

jest.mock('framer-motion', () => {
  return {
    AnimatePresence: () => <div />,
  };
});

describe('CollapsableSection', () => {
  it('Should collapse', () => {
    const openMock = false;
    const setOpen = jest.fn();

    jest
      .spyOn(React, 'useState')
      .mockImplementationOnce(() => [openMock, setOpen]);

    const { getByRole } = render(
      <CollapsableSection
        title="title"
        contentTitle="contentTitle"
        dao={{} as unknown as DAO}
        data={[]}
        status="Pending"
        accountId="accountId"
      />
    );

    fireEvent.click(getByRole('button'));

    expect(setOpen).toBeCalled();
    expect(setOpen.mock.calls[0][0]()).toEqual(!openMock);
  });
});

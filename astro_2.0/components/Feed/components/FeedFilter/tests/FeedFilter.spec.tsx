/* eslint-disable @typescript-eslint/ban-ts-comment */

import React, { useState } from 'react';
import { render } from 'jest/testUtils';

import { FeedFilter } from 'astro_2.0/components/Feed/components/FeedFilter';

jest.mock('react', () => {
  return {
    ...jest.requireActual('react'),
    useState: jest.fn(),
  };
});

describe('FeedFilter', () => {
  it('Should render component', () => {
    // @ts-ignore
    useState.mockImplementation(() => [false, () => 0]);

    const { container } = render(
      <FeedFilter
        title="Hello World!"
        value="value"
        onChange={() => 0}
        selectedLabel="Label"
      >
        <div>1</div>
        <div>2</div>
      </FeedFilter>
    );

    expect(container).toMatchSnapshot();
  });
});

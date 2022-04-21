/* eslint-disable @typescript-eslint/ban-ts-comment */

import { render } from 'jest/testUtils';
import { useRouter } from 'next/router';

import { SideFilter } from 'astro_2.0/components/SideFilter';

jest.mock('next/router', () => {
  return {
    useRouter: jest.fn().mockImplementation(() => ({
      query: {},
    })),
  };
});

beforeAll(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

describe('Side filter', () => {
  it('Should render component', () => {
    const { container } = render(
      <SideFilter title="Hello World!" queryName="" />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render list item', () => {
    // @ts-ignore
    useRouter.mockImplementation(() => ({
      query: {
        name: '1',
      },
    }));

    const listItemLabel = 'Hey!';
    const { getAllByText } = render(
      <SideFilter
        title="Hello World!"
        queryName="name"
        list={[{ label: listItemLabel, value: '1' }]}
      />
    );

    expect(getAllByText(listItemLabel)).toHaveLength(1);
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */

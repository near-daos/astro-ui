/* eslint-disable @typescript-eslint/no-empty-function */

import { render } from 'jest/testUtils';

import { PaginationResponse } from 'types/api';

import { Feed } from 'astro_2.0/components/Feed';

describe('feed', () => {
  it('Should render nothing if no data', () => {
    const data = {} as PaginationResponse<unknown[]>;

    const { container } = render(
      <Feed
        data={data}
        loader={<div />}
        noResults={<div />}
        loadMore={() => {}}
        renderItem={() => <div />}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render feed items', () => {
    const data = {
      data: [1, 2, 3],
    } as PaginationResponse<unknown[]>;

    const component = render(
      <Feed
        data={data}
        loader={<div />}
        noResults={<div />}
        loadMore={() => {}}
        renderItem={i => (
          <div data-testid="data-item" key={i as string}>
            {i as string}
          </div>
        )}
      />
    );

    const items = component.queryAllByTestId('data-item');

    expect(items).toHaveLength(3);
    expect(items[0].textContent).toStrictEqual('1');
    expect(items[1].textContent).toStrictEqual('2');
    expect(items[2].textContent).toStrictEqual('3');
  });
});

/* eslint-enable @typescript-eslint/no-empty-function */

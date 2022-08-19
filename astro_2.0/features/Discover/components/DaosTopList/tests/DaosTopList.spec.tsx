import { render } from 'jest/testUtils';

import { LeaderboardData } from 'astro_2.0/features/Discover/types';

import { DaosTopList } from 'astro_2.0/features/Discover/components/DaosTopList';

jest.mock(
  'astro_2.0/features/Discover/components/DaosTopList/components/TopListItem',
  () => {
    return {
      TopListItem: ({ index }: { index: number }) => <div>{`LI${index}`}</div>,
    };
  }
);

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('DaosTopList', () => {
  it('Should render nothing if no data', () => {
    const { container } = render(
      <DaosTopList
        total={10}
        data={null}
        next={() => 0}
        valueLabel="Some Label"
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render list items', () => {
    const data = [
      { dao: 1 },
      { dao: 2 },
      { dao: 3 },
    ] as unknown as LeaderboardData[];

    const { getByText } = render(
      <DaosTopList
        total={10}
        data={data}
        next={() => 0}
        valueLabel="Some Label"
      />
    );

    expect(getByText('LI1')).toBeTruthy();
  });
});

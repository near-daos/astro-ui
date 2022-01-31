import { render } from 'jest/testUtils';

import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';

import { policyMock } from './mocks';

describe('default voting policy', () => {
  it('Should render component', () => {
    const { container } = render(
      <DefaultVotingPolicy ratio={[]} numberOfGroups={2} />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render ration if ration info presented', () => {
    const { queryAllByText } = render(
      <DefaultVotingPolicy ratio={policyMock.ratio} numberOfGroups={2} />
    );

    expect(queryAllByText('50%', { exact: false })).toHaveLength(1);
  });
});

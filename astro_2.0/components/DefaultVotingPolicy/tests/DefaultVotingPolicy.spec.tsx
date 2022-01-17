import { render } from 'jest/testUtils';

import { DefaultVotingPolicy } from 'astro_2.0/components/DefaultVotingPolicy';

import { policyMock, groupsMock } from './mocks';

describe('default voting policy', () => {
  it('Should render component', () => {
    const { container } = render(
      <DefaultVotingPolicy
        policy={{
          ...policyMock,
          ratio: [],
        }}
        groups={groupsMock}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render ration if ration info presented', () => {
    const { queryAllByText } = render(
      <DefaultVotingPolicy policy={policyMock} groups={groupsMock} />
    );

    expect(queryAllByText('50%', { exact: false })).toHaveLength(1);
  });
});

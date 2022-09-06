import { render } from 'jest/testUtils';

import { VoterDetailsCard } from 'features/proposal/components/VoterDetailsCard';

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

describe('VoterDetailsCard', () => {
  it.each`
    vote         | icon
    ${'Yes'}     | ${'votingYes'}
    ${'No'}      | ${'votingNo'}
    ${'Dismiss'} | ${'votingDismissAlt'}
    ${'Other'}   | ${'notVoted'}
  `('Should render proper icon for $vote vote', ({ vote, icon }) => {
    const { getByText } = render(
      <VoterDetailsCard
        vote={vote}
        name="Hello World!"
        transactionHash="123"
        timestamp={null}
        groups={['GR1', 'GR2']}
        isLastVote={false}
      />
    );

    expect(getByText(icon)).toBeInTheDocument();
  });
});

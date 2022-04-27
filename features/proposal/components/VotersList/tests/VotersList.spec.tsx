import { render } from 'jest/testUtils';

import { VoterDetail } from 'features/types';

import { VotersList } from 'features/proposal/components/VotersList';

describe('VotersList', () => {
  it('Should render "No data" state', () => {
    const { getByText } = render(<VotersList data={[]} />);

    expect(getByText('No votes here')).toBeInTheDocument();
  });

  it('Should render component', () => {
    const data = [
      {
        name: 'N1',
        vote: 'Yes',
      },
      {
        name: 'N2',
        vote: 'No',
      },
    ] as VoterDetail[];

    const { getByText } = render(<VotersList data={data} />);

    expect(getByText('N1')).toBeInTheDocument();
    expect(getByText('N2')).toBeInTheDocument();
  });
});

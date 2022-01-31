import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { StatCard } from 'astro_2.0/features/DaoDashboard/components/StatCard';

describe('Stat Card', () => {
  it('Should render component', () => {
    const { container } = render(<StatCard selected onClick={() => 0} />);

    expect(container).toMatchSnapshot();
  });

  it('Should call onClick', () => {
    const onClick = jest.fn();

    const { getByRole } = render(<StatCard selected onClick={onClick} />);

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalled();
  });
});

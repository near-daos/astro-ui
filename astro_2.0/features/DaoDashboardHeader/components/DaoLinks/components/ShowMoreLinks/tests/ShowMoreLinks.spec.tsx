import { render } from 'jest/testUtils';

import { useModal } from 'components/modal';

import { ShowMoreLinks } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/ShowMoreLinks';
import { fireEvent } from '@testing-library/dom';

jest.mock('components/modal', () => {
  return {
    useModal: jest.fn(() => []),
  };
});

describe('ShowMoreLinks', () => {
  it('Should render nothing', () => {
    const { container } = render(<ShowMoreLinks links={[]} />);

    expect(container).toMatchSnapshot();
  });

  it('Should call showModal', () => {
    const showModal = jest.fn();

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    useModal.mockImplementation(() => [showModal]);

    const { getByRole } = render(<ShowMoreLinks links={['L1']} />);

    fireEvent.click(getByRole('button'));

    expect(showModal).toBeCalled();
  });
});

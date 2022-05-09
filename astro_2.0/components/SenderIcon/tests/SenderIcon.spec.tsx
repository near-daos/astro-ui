import { render } from 'jest/testUtils';

import { SenderIcon } from 'astro_2.0/components/SenderIcon';
import { fireEvent } from '@testing-library/dom';

describe('SenderIcon', () => {
  it('Should call onClick callback', () => {
    const onClick = jest.fn();

    const { getByTestId } = render(<SenderIcon onClick={onClick} />);

    fireEvent.click(getByTestId('asi-root'));

    expect(onClick).toBeCalled();
  });
});

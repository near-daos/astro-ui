import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { Chip } from 'astro_2.0/components/Chip';

describe('Chip', () => {
  it('Should call remove callback', () => {
    const name = 'My Name';
    const onRemove = jest.fn();

    const { getByRole } = render(<Chip name={name} onRemove={onRemove} />);

    fireEvent.click(getByRole('button'));

    expect(onRemove).toBeCalledWith(name);
  });
});

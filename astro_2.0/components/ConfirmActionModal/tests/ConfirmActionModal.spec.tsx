import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';
import { act } from '@testing-library/react';

import { DEFAULT_PROPOSAL_GAS } from 'services/sputnik/constants';

import {
  ConfirmActionModal,
  ConfirmActionModalProps,
} from 'astro_2.0/components/ConfirmActionModal';

describe('Confirm Action Modal', () => {
  function renderModal(props?: Partial<ConfirmActionModalProps>) {
    return render(
      <ConfirmActionModal
        isOpen
        onClose={() => 0}
        title="Hello World!"
        message="Some message"
        {...props}
      />
    );
  }

  it('Should render component', () => {
    const { container } = renderModal();

    expect(container).toMatchSnapshot();
  });

  it('Should call onClose callback', async () => {
    const onClose = jest.fn();

    const { getByTestId } = renderModal({ onClose });

    act(() => {
      fireEvent.click(getByTestId('close-button'));
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(onClose).toBeCalledWith(DEFAULT_PROPOSAL_GAS.toString());
  });

  it('Should update gas value', async () => {
    const onClose = jest.fn();
    const gasValue = '100';

    const { getByTestId } = renderModal({ onClose });

    act(() => {
      fireEvent.change(getByTestId('gas-input'), {
        target: { value: gasValue },
      });

      fireEvent.click(getByTestId('close-button'));
    });

    await new Promise(resolve => setTimeout(resolve, 0));

    expect(onClose).toBeCalledWith(gasValue);
  });
});

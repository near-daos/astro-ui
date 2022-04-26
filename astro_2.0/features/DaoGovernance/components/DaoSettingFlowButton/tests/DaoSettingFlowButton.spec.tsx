import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { DaoSettingFlowButton } from 'astro_2.0/features/DaoGovernance/components/DaoSettingFlowButton';

describe('DaoSettingFlowButton', () => {
  it('Should render label', () => {
    const label = 'Hello World!';

    const { getByText } = render(
      <DaoSettingFlowButton onClick={() => 0} icon="aAllDaos" label={label} />
    );

    expect(getByText(label)).toBeTruthy();
  });

  it('Should call onClose callback', () => {
    const onClose = jest.fn();

    const { getByRole } = render(
      <DaoSettingFlowButton onClick={onClose} icon="aAllDaos" label="" />
    );

    fireEvent.click(getByRole('button'));

    expect(onClose).toBeCalled();
  });
});

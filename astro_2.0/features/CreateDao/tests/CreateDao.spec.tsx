import { render } from 'jest/testUtils';

import { CreateDao } from 'astro_2.0/features/CreateDao';

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('', () => {
  it('Should render component', () => {
    render(<CreateDao defaultFlag="" />);
  });
});

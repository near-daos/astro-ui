import { render } from 'jest/testUtils';

import { MoreLinksModal } from 'astro_2.0/features/DaoDashboardHeader/components/DaoLinks/components/MoreLinksModal';

jest.mock('components/modal', () => {
  return {
    Modal: ({ children }: { children: unknown }) => children,
  };
});

describe('MoreLinksModal', () => {
  it('Should render component', () => {
    const { getByText } = render(
      <MoreLinksModal links={['L1', 'L2']} isOpen onClose={() => 0} />
    );

    expect(getByText('Links & Socials')).toBeTruthy();
  });
});

import { render } from 'jest/testUtils';

import { DaoGeneralCard } from 'astro_2.0/components/DaoDetails/DaoDetailsPreview/components/DaoGeneralCard';

describe('dao general card', () => {
  it('Should render component', () => {
    const { container } = render(
      <DaoGeneralCard
        id="123"
        links={['1', '2']}
        displayName="dao name"
        description="some description"
        legal={{
          legalLink: 'legalLink',
        }}
      />
    );

    expect(container).toMatchSnapshot();
  });

  it('Should render dao id instead of display name when display name is not presented', () => {
    const id = 'CustomDaoId';

    const component = render(
      <DaoGeneralCard id={id} links={['1']} description="some description" />
    );

    expect(component.queryAllByText(id)).toHaveLength(2);
  });
});

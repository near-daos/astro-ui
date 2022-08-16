import { render } from 'jest/testUtils';

import { FlagImage } from 'astro_2.0/features/CreateDao/components/FlagImage/FlagImage';

jest.mock('astro_2.0/features/CreateDao/components/ImageUpload', () => {
  return {
    ImageUpload: () => <div />,
  };
});

describe('FlagImage', () => {
  it('Should render component', () => {
    const title = 'my title';
    const description = 'my description';
    const requirements = 'my requirements';

    const { getByText } = render(
      <FlagImage
        title={title}
        fieldName="flagCover"
        description={description}
        requirements={requirements}
      />
    );

    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(requirements)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
  });
});

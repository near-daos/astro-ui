import { render } from 'jest/testUtils';
import { fireEvent } from '@testing-library/dom';

import { DAOTemplate } from 'astro_2.0/features/CreateDao/components/types';

import { TemplateLink } from 'astro_2.0/features/CreateDao/components/TemplateRules/components/TemplateLink';

describe('TemplateLink', () => {
  it('Should call onClick callback', () => {
    const template = 'template' as unknown as DAOTemplate;
    const onClick = jest.fn();

    const { getByRole } = render(
      <TemplateLink
        title="hello world"
        isActive
        onClick={onClick}
        template={template}
      />
    );

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalledWith(template);
  });

  it('Should not call onClick callback', () => {
    const onClick = jest.fn();

    const { getByRole } = render(
      <TemplateLink title="hello world" isActive onClick={onClick} />
    );

    fireEvent.click(getByRole('button'));

    expect(onClick).toBeCalledTimes(0);
  });
});

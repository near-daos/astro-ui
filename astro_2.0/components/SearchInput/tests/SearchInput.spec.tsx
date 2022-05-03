import { render } from 'jest/testUtils';

import { SearchInput } from 'astro_2.0/components/SearchInput';
import { fireEvent } from '@testing-library/dom';

jest.mock('astro_2.0/components/LoadingIndicator', () => {
  return {
    LoadingIndicator: () => <div>LoadingIndicator</div>,
  };
});

jest.mock('components/Icon', () => {
  return {
    Icon: ({ name }: { name: string }) => <div>{name}</div>,
  };
});

jest.mock('next-i18next', () => ({
  // this mock makes sure any components using the translate hook can use it without a warning being shown
  useTranslation: () => {
    return {
      t: (str: string): string => str,
    };
  },
}));

describe('SearchInput', () => {
  it('Should render loading state', () => {
    const { getByText } = render(
      <SearchInput onSubmit={() => Promise.resolve(null)} loading />
    );

    expect(getByText('LoadingIndicator')).toBeInTheDocument();
  });

  it('Should render search icon', () => {
    const { getByText } = render(
      <SearchInput
        showLoader
        loading={false}
        onSubmit={() => Promise.resolve(null)}
      />
    );

    expect(getByText('buttonSearch')).toBeInTheDocument();
  });

  it('Should render "close" button', () => {
    const inputPlaceholder = 'Hello World';

    const { getByText, getByPlaceholderText } = render(
      <SearchInput
        loading={false}
        showLoader={false}
        placeholder={inputPlaceholder}
        onSubmit={() => Promise.resolve(null)}
      />
    );

    fireEvent.change(getByPlaceholderText(inputPlaceholder), {
      target: { value: 'Some Value' },
    });

    expect(getByText('closeCircle')).toBeInTheDocument();
  });

  it('Should trigger "onClose"', () => {
    const onClose = jest.fn();

    const inputPlaceholder = 'Hello World';

    const { getByText, getByPlaceholderText } = render(
      <SearchInput
        loading={false}
        onClose={onClose}
        showLoader={false}
        placeholder={inputPlaceholder}
        onSubmit={() => Promise.resolve(null)}
      />
    );

    fireEvent.change(getByPlaceholderText(inputPlaceholder), {
      target: { value: 'Some Value' },
    });

    fireEvent.click(getByText('closeCircle'));

    expect(onClose).toBeCalled();
  });

  it('Should trigger "onSubmit"', () => {
    const onClose = jest.fn();

    const inputPlaceholder = 'Hello World';

    const { getByText, getByPlaceholderText } = render(
      <SearchInput
        loading={false}
        onClose={onClose}
        showLoader={false}
        placeholder={inputPlaceholder}
        onSubmit={() => Promise.resolve(null)}
      />
    );

    fireEvent.change(getByPlaceholderText(inputPlaceholder), {
      target: { value: 'Some Value' },
    });

    fireEvent.click(getByText('closeCircle'));

    expect(onClose).toBeCalled();
  });
});

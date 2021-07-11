import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { DummyComponent } from './DummyComponent';

test('should display a dummy component', async () => {
  render(<DummyComponent label="Hello" />);

  const htmlElement = await screen.findByRole('heading');

  expect(htmlElement).toHaveTextContent('Hello 0');
  fireEvent.click(htmlElement);
  expect(htmlElement).toHaveTextContent('Hello 1');
});

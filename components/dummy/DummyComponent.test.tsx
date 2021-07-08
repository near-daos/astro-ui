import React from 'react';
import { DummyComponent } from './DummyComponent';
import { render, fireEvent, screen } from '@testing-library/react';

test('should display a dummy component', async () => {
  render(<DummyComponent label="Hello" />);
  const htmlElement = await screen.findByRole('heading');
  expect(htmlElement).toHaveTextContent('Hello 0');
  fireEvent.click(htmlElement);
  expect(htmlElement).toHaveTextContent('Hello 1');
});

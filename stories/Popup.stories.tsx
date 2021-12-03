import React, { useState } from 'react';
import { Meta } from '@storybook/react';
import { Popup } from 'components/Popup';

export default {
  title: 'Components/Popup',
  component: Popup,
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Popup>
): JSX.Element => {
  const [buttonElement, setButtonElement] = useState<HTMLElement | null>(null);

  return (
    <div style={{ padding: '150px' }}>
      <span ref={setButtonElement}>This text has popup 👽</span>
      <Popup anchor={buttonElement} {...args}>
        This is popup text 🛸
      </Popup>
    </div>
  );
};

Template.storyName = 'Popup';

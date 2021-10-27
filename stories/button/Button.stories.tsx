import React from 'react';
import { Button as ButtonComponent } from 'components/button/Button';
import { Meta } from '@storybook/react';

export const Button = (
  args: React.ComponentProps<typeof ButtonComponent> & {
    text: string;
    darkMode: boolean;
  }
): JSX.Element => {
  const { text, darkMode, ...props } = args;

  return (
    <div className={darkMode ? 'dark-mode' : undefined}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ButtonComponent {...props}> {text}</ButtonComponent>
    </div>
  );
};

Button.args = {
  darkMode: false,
  text: 'Button',
  variant: 'primary',
  width: 'medium',
  type: 'button',
};

export default {
  title: 'Components/Buttons/Button',
  component: ButtonComponent,
} as Meta;

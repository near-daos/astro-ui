import React from 'react';
import { AuthButton as AuthButtonComponent } from 'components/button/AuthButton';
import { Meta } from '@storybook/react';

export const AuthButton = (): JSX.Element => {
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <div>
      <div>
        <AuthButtonComponent type="button" />
      </div>

      <div className="dark-mode">
        <AuthButtonComponent type="button" />
      </div>
    </div>
  );
};

export default {
  title: 'Components/Buttons/Auth Button',
  component: AuthButtonComponent,
} as Meta;

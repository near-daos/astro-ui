import React from 'react';
import { Collapsable } from 'components/collapsable/Collapsable';
import { Meta } from '@storybook/react';
import { IconButton } from 'components/button/IconButton';
import { Icon } from 'components/Icon';

export default {
  title: 'Components/Collapsable',
  component: Collapsable,
  argTypes: {
    checked: { control: 'boolean' }
  }
} as Meta;

export const Template = (
  args: React.ComponentProps<typeof Collapsable>
): JSX.Element => (
  <>
    <Collapsable
      {...args}
      renderHeading={(toggle, isOpen) => (
        <h1>
          Collapsable header
          <IconButton size="large" onClick={() => toggle()} type="button">
            <Icon
              style={{
                transform: isOpen ? undefined : 'rotate(-90deg)',
                transition: 'all 100ms',
                marginBottom: '8px'
              }}
              name="buttonArrowDown"
            />
          </IconButton>
        </h1>
      )}
    >
      <b> Collapsable content </b>
      <p>
        Rich in mystery Vangelis rich in heavy atoms circumnavigated how far
        away kindling the energy hidden in matter. Ship of the imagination
        consectetur the only home we have ever known courage of our questions
        vel illum qui dolorem eum fugiat quo voluptas nulla pariatur muse about.
        Sea of Tranquility across the centuries qui dolorem ipsum quia dolor sit
        amet two ghostly white figures in coveralls and helmets are softly
        dancing sed quia consequuntur magni dolores eos qui ratione voluptatem
        sequi nesciunt the only home we have ever known and billions upon
        billions upon billions upon billions upon billions upon billions upon
        billions.
      </p>
    </Collapsable>
  </>
);

Template.storyName = 'Collapsable';
Template.args = {
  label: 'Collapsable'
};

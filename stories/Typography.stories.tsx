import React from 'react';
import { Meta } from '@storybook/react';
import * as Typography from 'components/Typography';

export default {
  title: 'Typography',
} as Meta;

type SizeType = React.ComponentProps<typeof Typography.Title>['size'];

export const TypographyStory = (): JSX.Element => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    <section>
      <h1>Heading 1</h1>
      <h2>Heading 2</h2>
      <h3>Heading 3</h3>
      <h4>Heading 4</h4>
      <h5>Heading 5</h5>
    </section>
    <section>
      {[1, 2, 3, 4, 5, 6].map(item => {
        const size = item as SizeType;

        return (
          <div key={size}>
            <Typography.Title size={size}>Title {size}</Typography.Title>
            <Typography.Subtitle size={size}>
              Subtitle {size}
            </Typography.Subtitle>
            <br />
          </div>
        );
      })}
    </section>
    <section>
      <p>Paragraph</p>
      Plain text
      <br />
      <small> Smaller text </small>
      <Typography.Caption>Caption </Typography.Caption>
      <Typography.Caption size="small">Small caption</Typography.Caption>
    </section>
  </div>
);

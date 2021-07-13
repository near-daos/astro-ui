import '!style-loader!css-loader!sass-loader!../styles/globals.scss';
import * as nextImage from 'next/image';

// To allow next image component to be displayed inside of storybook
Object.defineProperty(nextImage, 'default', {
  configurable: true,
  value: props => <img alt="Next Image Mock" {...props} />
});

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

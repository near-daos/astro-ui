/* eslint-disable react/no-danger */
import Document, { Html, Head, Main, NextScript } from 'next/document';

import { APP_CONFIG } from 'config/fetchConfig';
import { TYPE_FORM_FEEDBACK } from 'constants/integrations';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <script
            dangerouslySetInnerHTML={{
              __html: APP_CONFIG,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
          <div
            dangerouslySetInnerHTML={{
              __html: TYPE_FORM_FEEDBACK,
            }}
          />
        </body>
      </Html>
    );
  }
}

/* eslint-disable react/no-danger */
import Document, { Html, Head, Main, NextScript } from 'next/document';

import {
  GOOGLE_TAG_MANAGER,
  GOOGLE_TAG_MANAGER_NO_SCRIPT,
} from 'constants/googleTagManager';
import { APP_CONFIG } from 'config/fetchConfig';

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
          <script
            dangerouslySetInnerHTML={{
              __html: GOOGLE_TAG_MANAGER,
            }}
          />
        </Head>
        <body>
          <noscript
            dangerouslySetInnerHTML={{
              __html: GOOGLE_TAG_MANAGER_NO_SCRIPT,
            }}
          />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

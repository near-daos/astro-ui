/* eslint-disable react/no-danger */
import Document, { Html, Head, Main, NextScript } from 'next/document';

import { APP_CONFIG } from 'config/fetchConfig';
// import { TYPE_FORM_FEEDBACK } from 'constants/integrations';

export default class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&family=Open+Sans:wght@400;600;700&family=Roboto:wght@700&family=Rubik:wght@500&display=swap"
          />
          <script
            dangerouslySetInnerHTML={{
              __html: APP_CONFIG,
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

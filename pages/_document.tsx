/* eslint-disable react/no-danger */
import Document, { Html, Head, Main, NextScript } from 'next/document';

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
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/idea.min.css"
          />
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/highlight.min.js" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

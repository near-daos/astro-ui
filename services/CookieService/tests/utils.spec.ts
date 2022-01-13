/* eslint-disable @typescript-eslint/ban-ts-comment */
import { hasDocumentCookie } from 'services/CookieService/utils';

describe('cookies utils', () => {
  describe('hasDocumentCookie', () => {
    it('Should return true if cookies object available', () => {
      expect(hasDocumentCookie()).toBeTruthy();
    });

    it('Should return false if cookies are not available', () => {
      Object.defineProperty(document, 'cookie', {});

      expect(hasDocumentCookie()).toBeFalsy();
    });
  });
});

/* eslint-enable @typescript-eslint/ban-ts-comment */

import { useEffect, useState } from 'react';
import en from 'date-fns/locale/en-US/index.js';

export const useLoadDateLocale = (selectedLocale: string): Locale => {
  const [locale, setLocale] = useState<Locale>(en);

  let findLocale = selectedLocale;

  if (selectedLocale === 'en') {
    findLocale += '-US';
  }

  useEffect(() => {
    const importLocaleFile = async () => {
      try {
        const localeToSet = await import(
          `date-fns/locale/${findLocale}/index.js`
        );

        setLocale(localeToSet);
      } catch (error) {
        console.error(error);
      }
    };

    importLocaleFile();
  }, [findLocale]);

  return locale;
};

import { useEffect, useState } from 'react';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DraftsService } from 'services/DraftsService';

export const useDraftService = (): DraftsService | undefined => {
  const [draftsService, setDraftsService] = useState<
    DraftsService | undefined
  >();

  useEffect(() => {
    setTimeout(() => {
      const httpService = new HttpService({
        baseURL: `${
          process.browser
            ? window.APP_CONFIG.DRAFTS_API_URL
            : appConfig.DRAFTS_API_URL
        }/api/v1/`,
      });

      setDraftsService(new DraftsService(httpService));
    }, 500);
  }, []);

  return draftsService;
};

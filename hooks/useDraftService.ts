import { useEffect, useState } from 'react';
import { HttpService } from 'services/HttpService';
import { appConfig } from 'config';
import { DraftsService } from 'services/DraftsService';
import { useFlags } from 'launchdarkly-react-client-sdk';

export const useDraftService = (): DraftsService | undefined => {
  const [draftsService, setDraftsService] = useState<
    DraftsService | undefined
  >();

  const flags = useFlags();

  useEffect(() => {
    setTimeout(() => {
      if (flags === undefined) {
        return;
      }

      const { useDraftsApiRelatedToDao, useDraftCommentsApiRelatedToDao } =
        flags;

      const httpService = new HttpService({
        baseURL: `${
          process.browser
            ? window.APP_CONFIG.DRAFTS_API_URL
            : appConfig.DRAFTS_API_URL
        }/api/v1/`,
      });

      setDraftsService(
        new DraftsService(
          httpService,
          useDraftsApiRelatedToDao,
          useDraftCommentsApiRelatedToDao
        )
      );
    }, 500);
  }, [flags]);

  return draftsService;
};

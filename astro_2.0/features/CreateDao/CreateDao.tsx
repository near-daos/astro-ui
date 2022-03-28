import React, { useEffect, useState, VFC } from 'react';
import { StateMachineProvider, createStore } from 'little-state-machine';
import { useRouter } from 'next/router';

import { STEPS } from 'astro_2.0/features/CreateDao/constants';

import { StepWrapper } from 'astro_2.0/features/CreateDao/components/StepWrapper';
import { DaoNameForm } from 'astro_2.0/features/CreateDao/components/DaoNameForm';
import { DaoLegalStatus } from 'astro_2.0/features/CreateDao/components/DaoLegalStatus';
import { DaoLinksForm } from 'astro_2.0/features/CreateDao/components/DaoLinksForm';
import { getInitialValues } from 'astro_2.0/features/CreateDao/components/helpers';
import { DaoMembersForm } from 'astro_2.0/features/CreateDao/components/DaoMembersForm';
import { DaoAssetsForm } from 'astro_2.0/features/CreateDao/components/DaoAssetsForm';
import { DaoProposalsForm } from 'astro_2.0/features/CreateDao/components/DaoProposalsForm';
import { useMount, useMountedState } from 'react-use';
import { useAuthContext } from 'context/AuthContext';

interface CreateDaoProps {
  defaultFlag: string;
}

export const CreateDao: VFC<CreateDaoProps> = ({ defaultFlag }) => {
  const router = useRouter();
  const isMounted = useMountedState();
  const { query } = router;
  const { step } = router.query;
  const { accountId } = useAuthContext();
  const [initialized, setInitialized] = useState(false);

  useMount(() => {
    if (!isMounted()) {
      return;
    }

    createStore(getInitialValues(accountId, defaultFlag));
    setInitialized(true);
  });

  useEffect(() => {
    if (!step && isMounted()) {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            ...query,
            step: 'info',
          },
        },
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [isMounted, query, router, step]);

  function renderContent() {
    switch (query.step) {
      case STEPS.INFO: {
        return <DaoNameForm />;
      }
      case STEPS.KYC: {
        return <DaoLegalStatus />;
      }
      case STEPS.LINKS: {
        return <DaoLinksForm />;
      }
      case STEPS.MEMBERS: {
        return <DaoMembersForm />;
      }
      case STEPS.PROPOSALS: {
        return <DaoProposalsForm />;
      }
      case STEPS.ASSETS: {
        return <DaoAssetsForm />;
      }
      default:
        return <DaoNameForm />;
    }
  }

  if (!initialized) {
    return null;
  }

  return (
    <StateMachineProvider>
      <StepWrapper>{renderContent()}</StepWrapper>
    </StateMachineProvider>
  );
};

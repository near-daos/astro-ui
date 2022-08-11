import React, {
  FC,
  Children,
  useCallback,
  cloneElement,
  isValidElement,
  ReactNode,
} from 'react';
import { UrlObject } from 'url';
import cn from 'classnames';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';
import { CreateExternalProposal } from 'astro_2.0/features/CreateExternalProposal';
import { DaoLowBalanceWarning } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper/components/DaoLowBalanceWarning';
import { DaoCreateProposal } from 'astro_2.0/features/pages/nestedDaoPagesContent/NestedDaoPageWrapper/components/DaoCreateProposal';

import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import { DaoSettingsProvider } from 'context/DaoSettingsContext';
import { DaoTokensProvider } from 'context/DaoTokensContext';
import { AllTokensProvider } from 'context/AllTokensContext';

import { MainLayout } from 'astro_3.0/features/MainLayout';
import { useAppVersion } from 'hooks/useAppVersion';

import styles from './NestedDaoPageWrapper.module.scss';

interface NestedDaoPageWrapperProps {
  daoContext: DaoContext;
  defaultProposalType?: ProposalVariant;
  breadcrumbs: {
    href?: string | UrlObject;
    label: string;
  }[];
  className?: string;
  header?: (onCreateProposal: () => void) => ReactNode;
}

export const NestedDaoPageWrapper: FC<NestedDaoPageWrapperProps> = props => {
  const {
    daoContext,
    defaultProposalType = ProposalVariant.ProposeTransfer,
    breadcrumbs,
    children,
    className,
    header,
  } = props;
  const { dao, userPermissions, policyAffectsProposals } = daoContext;
  const [CreateProposal, toggleCreateProposal] = useCreateProposal();
  const { appVersion } = useAppVersion();

  function renderBreadcrumbs() {
    const navItems = breadcrumbs.map(breadcrumb => {
      const { href, label } = breadcrumb;

      return (
        <NavLink href={href} key={label}>
          {label}
        </NavLink>
      );
    });

    return <BreadCrumbs>{navItems}</BreadCrumbs>;
  }

  function renderChildren() {
    return Children.map(children, child => {
      if (isValidElement(child)) {
        return cloneElement(child, { toggleCreateProposal, daoContext });
      }

      return null;
    });
  }

  const onCreateProposal = useCallback(
    (
      initialProposalVariant?: ProposalVariant,
      initialValues?: Record<string, unknown>,
      onCreateCallback?: (newProposalId: number | number[] | null) => void
    ) => {
      toggleCreateProposal({
        proposalVariant: initialProposalVariant || defaultProposalType,
        initialValues,
        onCreate: onCreateCallback,
      });
    },
    [toggleCreateProposal, defaultProposalType]
  );

  function renderContent() {
    const content = (
      <div className={cn(styles.root, className)}>
        {renderBreadcrumbs()}
        <DaoDetailsMinimized
          dao={dao}
          className={styles.dao}
          userPermissions={userPermissions}
          onCreateProposalClick={onCreateProposal}
        />
        <DaoCreateProposal
          daoContext={daoContext}
          defaultProposalType={defaultProposalType}
          CreateProposal={CreateProposal}
          toggleCreateProposal={toggleCreateProposal}
        />
        <CreateExternalProposal onCreateProposal={onCreateProposal} />
        <DaoLowBalanceWarning />
        <PolicyAffectedWarning
          data={policyAffectsProposals}
          className={styles.warningWrapper}
        />
        {renderChildren()}
      </div>
    );

    if (appVersion === 3) {
      return <MainLayout>{content}</MainLayout>;
    }

    return content;
  }

  return (
    <DaoSettingsProvider>
      <AllTokensProvider>
        <DaoTokensProvider>
          {header && header(onCreateProposal)}
          {renderContent()}
        </DaoTokensProvider>
      </AllTokensProvider>
    </DaoSettingsProvider>
  );
};

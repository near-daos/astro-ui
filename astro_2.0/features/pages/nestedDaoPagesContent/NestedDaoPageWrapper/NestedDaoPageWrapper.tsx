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

import { MainLayout } from 'astro_3.0/features/MainLayout';

import { useMount } from 'react-use';
import { DELEGATE_VOTING_KEY } from 'constants/localStorage';

import styles from './NestedDaoPageWrapper.module.scss';

interface NestedDaoPageWrapperProps {
  daoContext: DaoContext;
  defaultProposalType?: ProposalVariant;
  breadcrumbs?: {
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

  function renderBreadcrumbs() {
    if (!breadcrumbs) {
      return null;
    }

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

  useMount(() => {
    localStorage.setItem(DELEGATE_VOTING_KEY, '');
  });

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

  return (
    <>
      {header && header(onCreateProposal)}
      <MainLayout>
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
      </MainLayout>
    </>
  );
};

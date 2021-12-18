import React, {
  FC,
  Children,
  useCallback,
  cloneElement,
  isValidElement,
} from 'react';
import { UrlObject } from 'url';

import { DaoContext } from 'types/context';
import { ProposalVariant } from 'types/proposal';

import { NavLink } from 'astro_2.0/components/NavLink';
import { BreadCrumbs } from 'astro_2.0/components/BreadCrumbs';
import { DaoDetailsMinimized } from 'astro_2.0/components/DaoDetails';
import { PolicyAffectedWarning } from 'astro_2.0/components/PolicyAffectedWarning';

import { useDaoCustomTokens } from 'hooks/useCustomTokens';
import { useCreateProposal } from 'astro_2.0/features/CreateProposal/hooks';

import styles from './NestedDaoPageWrapper.module.scss';

interface NestedDaoPageWrapperProps {
  daoContext: DaoContext;
  defaultProposalType?: ProposalVariant;
  breadcrumbs: {
    href?: string | UrlObject;
    label: string;
  }[];
}

export const NestedDaoPageWrapper: FC<NestedDaoPageWrapperProps> = props => {
  const {
    daoContext: {
      dao,
      userPermissions: { isCanCreateProposals },
      policyAffectsProposals,
    },
    defaultProposalType = ProposalVariant.ProposeTransfer,
    breadcrumbs,
    children,
  } = props;

  const { tokens } = useDaoCustomTokens();
  const [CreateProposal, toggleCreateProposal] = useCreateProposal();

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
        return cloneElement(child, { toggleCreateProposal });
      }

      return null;
    });
  }

  const onCreateProposal = useCallback(() => {
    toggleCreateProposal({ proposalVariant: defaultProposalType });
  }, [toggleCreateProposal, defaultProposalType]);

  return (
    <div className={styles.root}>
      {renderBreadcrumbs()}
      <DaoDetailsMinimized
        dao={dao}
        className={styles.dao}
        disableNewProposal={!isCanCreateProposals}
        onCreateProposalClick={onCreateProposal}
      />
      <CreateProposal
        className={styles.createProposal}
        dao={dao}
        key={Object.keys(tokens).length}
        daoTokens={tokens}
        proposalVariant={defaultProposalType}
        showFlag={false}
        onClose={toggleCreateProposal}
      />
      <PolicyAffectedWarning
        data={policyAffectsProposals}
        className={styles.warningWrapper}
      />
      {renderChildren()}
    </div>
  );
};

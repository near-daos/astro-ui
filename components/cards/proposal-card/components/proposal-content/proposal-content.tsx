import { FC, useMemo } from 'react';
import cn from 'classnames';

import { Token } from 'features/types';
import { PolicyType } from 'types/policy';

import { useCustomTokensContext } from 'context/CustomTokensContext';

import { Badge } from 'components/badge/Badge';
import { Icon } from 'components/Icon';
import ExternalLink from 'components/cards/components/external-link/ExternalLink';
import { formatYoktoValue } from 'helpers/format';
import { getBadgeVariant } from 'features/proposal/helpers';

import styles from './proposal-content.module.scss';

interface ProposalContentProps {
  link?: string;
  linkTitle?: string;
}

interface AddRemoveMemberProps extends ProposalContentProps {
  name: string;
  groupName: string;
}

export const AddMemberToGroup: FC<AddRemoveMemberProps> = ({
  name,
  groupName,
  link,
}) => (
  <>
    <div className={styles.row}>
      <span className={styles.text}>
        Add <b>{name}</b> as member to&nbsp;&nbsp;
        <Badge size="medium" variant={getBadgeVariant(groupName)}>
          {groupName}
        </Badge>
      </span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
  </>
);

AddMemberToGroup.defaultProps = {
  link: '',
  linkTitle: '',
} as ProposalContentProps;

export const RemoveMemberFromGroup: FC<AddRemoveMemberProps> = ({
  name,
  groupName,
  link,
}) => (
  <>
    <div className={styles.row}>
      <span className={styles.text}>
        Remove <b>{name}</b> from&nbsp;&nbsp;
        <Badge size="small" variant={getBadgeVariant(groupName)}>
          {groupName}
        </Badge>
      </span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
  </>
);

RemoveMemberFromGroup.defaultProps = {
  link: '',
  linkTitle: '',
} as ProposalContentProps;

interface NewGroupProps extends ProposalContentProps {
  groupName: string;
}

export const CreateNewGroup: FC<NewGroupProps> = ({ groupName, link }) => (
  <>
    <div className={styles.row}>
      <span className={styles.text}>
        Create new group&nbsp;&nbsp;
        <Badge size="small">{groupName}</Badge>
      </span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
  </>
);

CreateNewGroup.defaultProps = {
  link: '',
  linkTitle: '',
} as ProposalContentProps;

interface RequestPayoutProps extends ProposalContentProps {
  amount: string;
  token: Token | string;
  recipient: string;
  reason?: string | null;
}

export const RequestPayout: FC<RequestPayoutProps> = ({
  amount,
  token,
  recipient,
  reason,
  link,
}) => {
  const { tokens } = useCustomTokensContext();

  const tokenData = useMemo(() => {
    const tokensData = Object.values(tokens).find(
      item => item.tokenId === token
    );
    const divider = tokensData?.decimals;
    const symbol = tokensData?.symbol ?? 'NEAR';
    const value = formatYoktoValue(amount, divider);

    return {
      value,
      symbol,
    };
  }, [amount, token, tokens]);

  return (
    <>
      <div className={styles.row}>
        <span className={styles.text}>{reason}</span>
      </div>
      {link && (
        <div className={styles.sub}>
          <ExternalLink to={link} />
        </div>
      )}
      <div className={cn(styles.subRow, 'transferModal')}>
        <span className={cn('title1', styles.value)}>{tokenData.value}</span>
        &nbsp;
        <span className={cn('title1', styles.valueDesc)}>
          {tokenData.symbol}
        </span>
        <Icon name="transfer" className={styles.icon} />
        <span>{recipient}</span>
      </div>
    </>
  );
};

RequestPayout.defaultProps = {
  link: '',
  reason: '',
} as Partial<ProposalContentProps>;

interface TextWithLinkProps extends ProposalContentProps {
  text: string;
}

export const TextWithLink: FC<TextWithLinkProps> = ({ text, link }) => {
  return (
    <>
      <div className={styles.row}>
        <span className={styles.text}>{text}</span>
      </div>
      {link && (
        <div className={styles.sub}>
          <ExternalLink to={link} />
        </div>
      )}
    </>
  );
};

TextWithLink.defaultProps = {
  link: '',
  linkTitle: '',
} as ProposalContentProps;

interface FunctionCallProps extends ProposalContentProps {
  recipient: string;
}

export const FunctionCall: FC<FunctionCallProps> = ({ recipient, link }) => (
  <>
    <div className={styles.row}>
      <span className={styles.text}>{recipient}</span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
  </>
);

interface ChangePolicyProps extends ProposalContentProps {
  policy?: PolicyType;
}

export const ChangePolicy: FC<ChangePolicyProps> = ({ link }) => (
  <>
    <div className={styles.row}>
      <span className={styles.text}>
        This is a proposal to change voting policies for our groups. See details
        in the link
      </span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
  </>
);

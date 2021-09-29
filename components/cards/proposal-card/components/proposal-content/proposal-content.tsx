import { FC } from 'react';
import cn from 'classnames';

import { PolicyType } from 'types/proposal';

import { Badge } from 'components/badge/Badge';
import { Icon } from 'components/Icon';
import ExternalLink from 'components/cards/proposal-card/components/external-link/ExternalLink';

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
  link
}) => (
  <>
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>
        Add <b>{name}</b> as member to&nbsp;&nbsp;
        <Badge size="medium">{groupName}</Badge>
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
  linkTitle: ''
} as ProposalContentProps;

export const RemoveMemberFromGroup: FC<AddRemoveMemberProps> = ({
  name,
  groupName,
  link
}) => (
  <>
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>
        Remove <b>{name}</b> from&nbsp;&nbsp;
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

RemoveMemberFromGroup.defaultProps = {
  link: '',
  linkTitle: ''
} as ProposalContentProps;

interface NewGroupProps extends ProposalContentProps {
  groupName: string;
}

export const CreateNewGroup: FC<NewGroupProps> = ({ groupName, link }) => (
  <>
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>
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
  linkTitle: ''
} as ProposalContentProps;

interface RequestPayoutProps extends ProposalContentProps {
  amount: string;
  tokens?: string;
  recipient: string;
  reason?: string | null;
}

export const RequestPayout: FC<RequestPayoutProps> = ({
  amount,
  // tokens,
  recipient,
  reason,
  link
}) => (
  <>
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>{reason}</span>
    </div>
    {link && (
      <div className={styles.sub}>
        <ExternalLink to={link} />
      </div>
    )}
    <div className={styles.subRow}>
      <span className={cn('title1', styles.value)}>{amount}</span>
      &nbsp;
      <span className={cn('title1', styles.valueDesc)}>
        <Icon name="logoNear" width={43} />
      </span>
      <Icon name="buttonArrowRight" className={styles.icon} />
      <span>{recipient}</span>
    </div>
  </>
);

RequestPayout.defaultProps = {
  link: '',
  reason: ''
} as Partial<ProposalContentProps>;

interface TextWithLinkProps extends ProposalContentProps {
  text: string;
}

export const TextWithLink: FC<TextWithLinkProps> = ({ text, link }) => {
  return (
    <>
      <div className={cn(styles.row, 'proposalInfo')}>
        <span className={cn(styles.text, 'paragraph1')}>{text}</span>
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
  linkTitle: ''
} as ProposalContentProps;

interface FunctionCallProps extends ProposalContentProps {
  recipient: string;
}

export const FunctionCall: FC<FunctionCallProps> = ({ recipient, link }) => (
  <>
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>{recipient}</span>
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
    <div className={cn(styles.row, 'proposalInfo')}>
      <span className={cn(styles.text, 'paragraph1')}>
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

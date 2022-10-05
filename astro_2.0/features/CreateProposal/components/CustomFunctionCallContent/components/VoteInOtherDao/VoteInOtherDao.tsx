// TODO requires localisation

import cn from 'classnames';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import { useMount } from 'react-use';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { VFC, useState, ReactNode, useEffect } from 'react';

import { DAO } from 'types/dao';
import { ProposalCategories, ProposalsFeedStatuses } from 'types/proposal';

import { SputnikHttpService } from 'services/sputnik';

import { LoadingIndicator } from 'astro_2.0/components/LoadingIndicator';
import { DropdownSelect } from 'components/inputs/selects/DropdownSelect';
import { InputWrapper } from 'astro_2.0/features/CreateProposal/components/InputWrapper';

import styles from './VoteInOtherDao.module.scss';

type DropdownOpt = {
  value: string;
  label: ReactNode;
};

interface VoteInOtherDaoProps {
  dao: DAO;
}

export const VoteInOtherDao: VFC<VoteInOtherDaoProps> = ({ dao }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [accountDaos, setAccountDaos] = useState<DropdownOpt[]>([]);
  const [daoProposals, setDaoProposals] = useState<DropdownOpt[]>();

  const { t } = useTranslation();
  const tBase = 'proposalCard.voteInDao';

  const { register, setValue, watch } = useFormContext();

  const selectedDao = watch('targetDao');
  const selectedProposal = watch('proposal');

  const loaderClassName = cn(styles.loadingCover, {
    [styles.show]: showLoader,
  });

  useMount(async () => {
    const daos = await SputnikHttpService.getAccountDaos(dao.id);

    const daoIds = map(daos, ({ id }) => ({
      value: id,
      label: id,
    }));

    setAccountDaos(daoIds);
  });

  useEffect(() => {
    if (selectedDao) {
      setValue('proposal', '');
      setValue('vote', '');
      setShowLoader(true);

      SputnikHttpService.getProposalsList({
        offset: 0,
        limit: 50,
        category: ProposalCategories.All,
        status: ProposalsFeedStatuses.Active,
        daoId: selectedDao,
      }).then(data => {
        const proposals = map(data?.data, ({ proposalId, description }) => ({
          value: proposalId.toString(),
          label: `ID: ${proposalId}. ${description}`,
        }));

        setDaoProposals(proposals);
        setShowLoader(false);
      });
    }
  }, [setValue, selectedDao]);

  return (
    <div className={styles.root}>
      <div className={loaderClassName}>
        <LoadingIndicator />
      </div>

      <InputWrapper
        fieldName="targetDao"
        className={styles.iWrapper}
        label={t(`${tBase}.targetDao.label`)}
      >
        <DropdownSelect
          isBorderless
          options={accountDaos}
          className={styles.select}
          {...register('targetDao')}
          onChange={value => setValue('targetDao', value)}
          placeholder={t(`${tBase}.targetDao.placeholder`)}
        />
      </InputWrapper>

      <InputWrapper
        fieldName="proposal"
        className={styles.iWrapper}
        label={t(`${tBase}.proposal.label`)}
      >
        {isNil(daoProposals) || !isEmpty(daoProposals) ? (
          <DropdownSelect
            isBorderless
            options={daoProposals || []}
            {...register('proposal')}
            onChange={value => setValue('proposal', value)}
            disabled={!selectedDao}
            className={styles.select}
            placeholder={t(`${tBase}.proposal.placeholder`)}
          />
        ) : (
          <div className={styles.noProposals}>
            {t(`${tBase}.noProposalsToVote`)}
          </div>
        )}
      </InputWrapper>

      <InputWrapper
        fieldName="vote"
        className={styles.iWrapper}
        label={t(`${tBase}.vote.label`)}
      >
        <DropdownSelect
          isBorderless
          options={[
            { value: 'VoteApprove', label: 'Approve' },
            { value: 'VoteReject', label: 'Reject' },
          ]}
          {...register('vote')}
          onChange={value => setValue('vote', value)}
          disabled={!selectedProposal}
          placeholder={t(`${tBase}.vote.placeholder`)}
        />
      </InputWrapper>
    </div>
  );
};

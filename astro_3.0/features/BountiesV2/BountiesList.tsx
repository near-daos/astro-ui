import React, { FC } from 'react';
import {
  Box,
  Show,
  Grid,
  GridItem,
  GridItemProps,
  forwardRef,
} from '@chakra-ui/react';

import { NoResultsView } from 'astro_2.0/components/NoResultsView';
import { DATA_SEPARATOR } from 'constants/common';
import { IconButton } from 'components/button/IconButton';
import { formatYoktoValue, kFormatter } from 'utils/format';
import { CopyButton } from 'astro_2.0/components/CopyButton';
import { BountyContext } from 'types/bounties';
import { getTimestampLabel } from 'astro_2.0/features/ViewBounty/components/BountyCard';

import styles from './BountiesList.module.scss';

interface BountiesListProps {
  bountiesContext: BountyContext[];
}

const DataCell = forwardRef<GridItemProps, 'div'>((props, ref) => (
  <GridItem
    textOverflow="ellipsis"
    whiteSpace="nowrap"
    overflow="hidden"
    alignItems="center"
    m="10px"
    p="1px"
    ref={ref}
    {...props}
  />
));

export const BountiesList: FC<BountiesListProps> = ({ bountiesContext }) => {
  if (!bountiesContext?.length) {
    return <NoResultsView title="no results" />;
  }

  const templateColumns = {
    base: '40px 1fr 1fr 1fr 40px 40px',
    md: '40px 1fr 1fr 2fr 2fr 1fr 1fr 50px 50px',
  };

  return (
    <Box mt="10px">
      {/* Headers */}

      <Grid
        fontWeight="bold"
        color="neutral.60"
        w="100%"
        templateColumns={templateColumns}
      >
        <DataCell />
        <DataCell w="40px">DAO</DataCell>
        <DataCell>TYPE</DataCell>
        <Show above="md">
          <DataCell>DESCRIPTION</DataCell>
        </Show>
        <Show above="md">
          <DataCell>TAGS</DataCell>
        </Show>
        <Show above="md">
          <DataCell>RECENCY</DataCell>
        </Show>
        <DataCell>AMOUNT</DataCell>
        <DataCell />
        <DataCell />
      </Grid>

      {/* Body */}
      {bountiesContext.map(bountyContext => {
        const rawDescription = bountyContext.bounty.description;
        const description = rawDescription.split(DATA_SEPARATOR)[0];
        const daoLogo =
          bountyContext.proposal?.dao?.flagLogo ||
          '/avatars/defaultDaoAvatar.png';

        const { createdAt } = bountyContext.bounty;
        const recency = createdAt ? getTimestampLabel(createdAt) : 'N/A';

        const rawAmount = bountyContext.bounty.amount;
        const amount = rawAmount
          ? kFormatter(Number(formatYoktoValue(rawAmount)), 2)
          : '0';

        return (
          <Grid
            templateColumns={templateColumns}
            bg="white"
            borderRadius="4px"
            boxShadow="0 4px 11px rgba(226, 229, 240, 0.8)"
            m="5px 0 20px"
            alignItems="center"
            fontSize="0.9em"
            key={bountyContext.bounty.id}
          >
            <DataCell
              bgImage={`url(${daoLogo})`}
              bgRepeat="no-repeat"
              bgSize="contain"
              h="30px"
              w="30px"
            />
            <DataCell
              textOverflow="ellipsis"
              whiteSpace="nowrap"
              overflow="hidden"
              fontWeight="bold"
              color="rgba(32, 29, 41, 0.5)"
            >
              {bountyContext.proposal?.dao?.name}
            </DataCell>

            <DataCell fontWeight="bold" color="#201d29">
              {bountyContext.proposal?.kind?.type}
            </DataCell>

            <Show above="md">
              <DataCell>{description}</DataCell>
            </Show>
            <Show above="md">
              <DataCell>
                {bountyContext.bounty.tags
                  ?.map((tag: string) => `#${tag}`)
                  .join(', ')}
              </DataCell>
            </Show>
            <Show above="md">
              <DataCell>{recency}</DataCell>
            </Show>
            <DataCell fontWeight="bold" color="#6038d0">
              {amount} NEAR
            </DataCell>
            <DataCell>
              <CopyButton
                text={`/dao/${bountyContext.proposal?.dao?.id}/proposals/${bountyContext.proposal?.id}`}
                tooltipPlacement="auto"
              />
            </DataCell>
            <DataCell>
              <IconButton
                size="medium"
                icon="buttonArrowRight"
                className={styles.icon}
                onClick={() => {
                  window.open(
                    `/dao/${bountyContext.proposal?.dao?.id}/proposals/${bountyContext.proposal?.id}`
                  );
                }}
              />
            </DataCell>
          </Grid>
        );
      })}
    </Box>
  );
};

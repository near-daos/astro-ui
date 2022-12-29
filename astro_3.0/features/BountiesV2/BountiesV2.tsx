import React, { VFC, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useFlags } from 'launchdarkly-react-client-sdk';
import { DebouncedInput } from 'components/inputs/Input';
import { OpenSearchQuery } from 'services/SearchService/types';
import {
  Flex,
  Show,
  Box,
  Grid,
  GridItem,
  Button,
  forwardRef,
  BoxProps,
} from '@chakra-ui/react';

import { Icon } from 'components/Icon';
import { Loader } from 'components/loader';
import { BountyContext } from 'types/bounties';
import { useBountiesInfiniteV2 } from 'services/ApiService/hooks/useBounties';
import { BountiesList } from './BountiesList';

const STATUS_LIST = {
  Available: 'Available',
  'In Progress': 'InProgress',
  Completed: 'Completed',
};

export type Filter = {
  daoId: string;
  tags: string[];
  statuses: {
    Available: boolean;
    InProgress: boolean;
    Completed: boolean;
  };
};

export const buildQuery = (filter: Filter): OpenSearchQuery => {
  const tagsQueries =
    filter.tags?.map(tag => ({
      match: {
        tags: tag,
      },
    })) ?? ([] as Record<string, unknown>[]);

  const statusQueries = [] as Record<string, unknown>[];

  if (filter.statuses.Available) {
    statusQueries.push({
      bool: {
        must: [
          {
            simple_query_string: {
              query: 0,
              fields: ['numberOfClaims'],
            },
          },
        ],
        must_not: [
          {
            simple_query_string: {
              query: 0,
              fields: ['times'],
            },
          },
        ],
      },
    });
  }

  if (filter.statuses.InProgress) {
    statusQueries.push({
      bool: {
        must_not: [
          {
            simple_query_string: {
              query: 0,
              fields: ['numberOfClaims'],
            },
          },
        ],
      },
    });
  }

  if (filter.statuses.Completed) {
    statusQueries.push({
      bool: {
        must: [
          {
            simple_query_string: {
              query: 0,
              fields: ['times'],
            },
          },
        ],
      },
    });
  }

  const query: OpenSearchQuery = {
    bool: {
      must: [
        {
          bool: {
            should: tagsQueries,
          },
        },
        {
          bool: {
            should: statusQueries,
          },
        },
      ],
    },
  };

  if (filter.daoId) {
    query.bool?.must?.push({
      match: {
        daoId: filter.daoId,
      },
    });
  }

  return query;
};

const FilterLabel = forwardRef<BoxProps, 'div'>((props, ref) => (
  <Box pt="10px" color="neutral.60" fontWeight="bold" ref={ref} {...props} />
));

const FilterInput = (props: {
  onValueChange: (
    value: string | number | readonly string[] | undefined
  ) => void;
}) => (
  <DebouncedInput inputStyles={{ height: '35px' }} size="block" {...props} />
);

export const BountiesV2: VFC = () => {
  const { showBountyTags } = useFlags();

  const [filter, setFilter] = useState<Filter>({
    daoId: '',
    tags: [],
    statuses: {
      Available: false,
      InProgress: false,
      Completed: false,
    },
  });

  const { size, setSize, data, isValidating } = useBountiesInfiniteV2(
    buildQuery(filter)
  );

  const handleLoadMore = () => setSize(size + 1);

  const bountiesContext =
    data?.reduce<BountyContext[]>((acc, item) => {
      acc.push(...item.data);

      return acc;
    }, []) ?? ([] as BountyContext[]);

  const hasMore = data ? bountiesContext.length < data[0].total : false;

  const dataLength = bountiesContext.length ?? 0;

  const renderContent = () => {
    if (isValidating && !bountiesContext?.length) {
      return <Loader />;
    }

    return <BountiesList bountiesContext={bountiesContext} />;
  };

  return (
    <Flex w="100%" pl={{ base: '10px', md: '96px' }} pr="10px">
      <Show above="lg">
        <Box pt="50px" pr="30px" minW="200px" width="200px">
          <h3>FILTERS </h3>
          <FilterLabel>DAO ID</FilterLabel>
          <FilterInput
            onValueChange={val => {
              setFilter({ ...filter, daoId: val as string });
            }}
          />

          {showBountyTags && (
            <>
              <FilterLabel>Tags</FilterLabel>
              <FilterInput
                onValueChange={val => {
                  const tags = (val as string).trim();

                  setFilter({ ...filter, tags: tags ? tags.split(',') : [] });
                }}
              />
            </>
          )}
        </Box>
      </Show>
      <Grid flex="1">
        <GridItem>
          <h1>Bounties</h1>
        </GridItem>
        <GridItem>
          <Flex>
            {Object.entries(STATUS_LIST).map(([key, value]) => {
              const status = value as keyof typeof filter.statuses;

              return (
                <Button
                  size="sm"
                  bg="white"
                  border="1px"
                  borderColor="neutral.40"
                  borderRadius="full"
                  mr="8px"
                  onClick={() => {
                    const { statuses } = filter;

                    statuses[status] = !statuses[status];

                    setFilter({ ...filter, statuses });
                  }}
                >
                  {filter.statuses[status] ? (
                    <Flex h="10px" mr="5px">
                      <Icon name="check" />
                    </Flex>
                  ) : (
                    ''
                  )}
                  {key}
                </Button>
              );
            })}
          </Flex>
        </GridItem>
        <GridItem>
          <InfiniteScroll
            dataLength={dataLength}
            next={handleLoadMore}
            hasMore={hasMore}
            loader={<Loader />}
            style={{ overflow: 'initial' }}
            endMessage=""
          >
            {renderContent()}
          </InfiniteScroll>
        </GridItem>
      </Grid>
    </Flex>
  );
};

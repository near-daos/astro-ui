import React, { FC, useMemo } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import { useCompareProposalContext } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposalContext';

interface Props {
  oldValue: string;
  newValue: string;
}

export const DiffRenderer: FC<Props> = ({ oldValue, newValue }) => {
  const { view } = useCompareProposalContext();

  const viewStyles = useMemo(() => {
    const styles: Record<string, Record<string, string>> = {
      marker: {
        display: 'none',
      },
    };

    switch (view) {
      case 'current': {
        styles.diffRemoved = {
          display: 'none',
        };
        styles.diffAdded = {
          backgroundColor: 'white',
        };
        styles.wordAdded = {
          backgroundColor: 'white',
        };

        break;
      }
      case 'prev': {
        styles.diffRemoved = {
          display: 'none',
        };
        styles.diffAdded = {
          backgroundColor: 'white',
        };
        styles.wordAdded = {
          backgroundColor: 'yellow',
        };

        break;
      }
      default: {
        break;
      }
    }

    return styles;
  }, [view]);

  return (
    <ReactDiffViewer
      oldValue={oldValue}
      newValue={newValue}
      hideLineNumbers
      compareMethod={DiffMethod.WORDS}
      styles={viewStyles}
    />
  );
};

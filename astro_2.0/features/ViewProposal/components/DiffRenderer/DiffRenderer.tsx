import React, { FC, useMemo } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import cn from 'classnames';
import { useCompareProposalContext } from 'astro_2.0/features/ViewProposal/components/HistorySelector/components/CompareProposalContext';

import s from './DiffRenderer.module.scss';

interface Props {
  oldValue: string;
  newValue: string;
  codeView?: boolean;
}

export const DiffRenderer: FC<Props> = ({ oldValue, newValue, codeView }) => {
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

  if (oldValue === newValue) {
    return <>{newValue}</>;
  }

  return (
    <span
      className={cn(s.root, {
        [s.codeView]: codeView,
      })}
    >
      <ReactDiffViewer
        // splitView
        // showDiffOnly={false}
        oldValue={oldValue}
        newValue={newValue}
        hideLineNumbers
        compareMethod={DiffMethod.WORDS}
        styles={viewStyles}
      />
    </span>
  );
};

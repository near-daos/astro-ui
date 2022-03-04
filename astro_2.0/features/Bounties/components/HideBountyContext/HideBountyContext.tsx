import React, { createContext, FC, useContext, useMemo } from 'react';
import { useHideBounty } from 'astro_2.0/features/Bounties/components/hooks';
import { useRouter } from 'next/router';
import { AnimatePresence, motion } from 'framer-motion';
import { Tooltip } from 'astro_2.0/components/Tooltip';
import { Button } from 'components/button/Button';

import styles from './HideBountyContext.module.scss';

interface IHideBountyContext {
  handleSubmit: () => void;
  handleSelect: (id: string) => void;
  selected: string[];
  showHidden: boolean;
}

/* eslint-disable @typescript-eslint/no-empty-function */
export const HideBountyContext = createContext<IHideBountyContext>({
  handleSubmit: () => {},
  handleSelect: () => {},
  selected: [],
  showHidden: false,
});
/* eslint-enable @typescript-eslint/no-empty-function */

export const HideBountyContextProvider: FC = ({ children }) => {
  const router = useRouter();
  const showHidden = router.query?.bountyFilter === 'hidden';
  const { handleSubmit, handleSelect, selected, loading } = useHideBounty();

  const contextValue = useMemo(() => {
    return {
      handleSubmit,
      handleSelect,
      selected,
      showHidden,
    };
  }, [handleSelect, handleSubmit, selected, showHidden]);

  const buttonTitle = `${showHidden ? 'Show' : 'Hide'} ${
    selected.length
  } bount${selected.length === 1 ? 'y' : 'ies'}`;

  return (
    <HideBountyContext.Provider value={contextValue}>
      {children}
      <div className={styles.hideControlButtonWrapper}>
        <AnimatePresence>
          {!!selected.length && (
            <motion.div
              initial={{ opacity: 0, transform: 'translateY(60px)' }}
              animate={{ opacity: 1, transform: 'translateY(0px)' }}
              exit={{ opacity: 0, transform: 'translateY(60px)' }}
            >
              <Tooltip
                popupClassName={styles.tooltip}
                overlay={
                  <p>Hidden bounties will be displayed in filter as hidden</p>
                }
              >
                <Button
                  size="large"
                  variant="green"
                  disabled={loading}
                  onClick={handleSubmit}
                  className={styles.button}
                >
                  {buttonTitle}
                </Button>
              </Tooltip>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </HideBountyContext.Provider>
  );
};

export function useHideBountyContext(): IHideBountyContext {
  return useContext(HideBountyContext);
}

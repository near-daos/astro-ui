import React, { CSSProperties, FC, useCallback, useRef, useState } from 'react';
import {
  PluginCard,
  PluginCardProps,
} from 'features/plugins/components/PluginCard/PluginCard';
import { UsePluginPopup } from 'features/plugins/components/use-plugin-popup';
import { useModal } from 'components/modal/hooks';
import { ScrollList } from 'astro_2.0/components/ScrollList';
import { Button } from 'components/button/Button';
import { IconButton } from 'components/button/IconButton';
import { PLUGINS_DATA, PLUGIN_INITIAL_DATA } from 'lib/mocks/tasks/plugins';
import { ListOnScrollProps, VariableSizeList } from 'react-window';
import { useMedia } from 'react-use';
import styles from 'pages/dao/[dao]/tasks/plugins/plugins.module.scss';
import { useAuthContext } from 'context/AuthContext';

interface PluginPageProps {
  plugins: PluginCardProps[];
}

const PluginsPage: FC<PluginPageProps> = ({ plugins = PLUGINS_DATA }) => {
  const { accountId, login } = useAuthContext();

  const [pluginsList] = useState(plugins);

  const [showUsePluginPopup] = useModal(UsePluginPopup, {
    initialData: PLUGIN_INITIAL_DATA,
  });

  const [showResetScroll, setShowResetScroll] = useState(false);
  const scrollListRef = useRef<VariableSizeList>(null);
  const isMobileOrTablet = useMedia('(max-width: 767px)');

  const handleScroll = useCallback(({ scrollOffset }: ListOnScrollProps) => {
    if (scrollOffset > 100) {
      setShowResetScroll(true);
    } else {
      setShowResetScroll(false);
    }
  }, []);

  const handleCreateClick = useCallback(
    () => (accountId ? showUsePluginPopup() : login()),
    [login, showUsePluginPopup, accountId]
  );

  const resetScroll = useCallback(() => {
    if (!scrollListRef || !scrollListRef.current) {
      return;
    }

    scrollListRef.current.scrollToItem(0);
  }, [scrollListRef]);

  const renderCard = ({
    index,
    style,
  }: {
    index: number;
    style: CSSProperties;
  }) => (
    <div
      style={{
        ...style,
        marginTop: '0',
        marginBottom: '16px',
      }}
    >
      <PluginCard {...pluginsList[index]} />
    </div>
  );

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <h1>Plugins</h1>
        <Button variant="black" size="small" onClick={handleCreateClick}>
          Run a plugin
        </Button>
      </div>
      <div className={styles.description}>
        NEAR function calls let your DAO interact with applications in the NEAR
        ecosystem.
      </div>
      <div className={styles.plugins}>
        <ScrollList
          itemCount={pluginsList.length}
          onScroll={handleScroll}
          height={700}
          itemSize={() => (isMobileOrTablet ? 194 : 96)}
          ref={scrollListRef}
          renderItem={renderCard}
        />
        {showResetScroll ? (
          <IconButton
            icon="buttonResetScroll"
            size={isMobileOrTablet ? 'medium' : 'large'}
            className={styles.reset}
            onClick={resetScroll}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PluginsPage;

import React, { FC } from 'react';
import { nanoid } from 'nanoid';

import { Icon } from 'components/Icon';
import { Input } from 'components/input/Input';
import { Button } from 'components/button/Button';

import styles from './links-tab.module.scss';

type ExternalLink = {
  id: string;
  url: string;
};

export interface LinksTabProps {
  links: ExternalLink[];
  onChange: (links: ExternalLink[]) => void;
}

function getLinkIcon(link: string) {
  if (link.indexOf('twitter') > -1) {
    return 'socialTwitter';
  }

  if (link.indexOf('discord') > -1) {
    return 'socialDiscord';
  }

  if (link.indexOf('facebook') > -1) {
    return 'socialFacebook';
  }

  if (link.indexOf('github') > -1) {
    return 'socialGithub';
  }

  if (link.indexOf('instagram') > -1) {
    return 'socialInstagram';
  }

  if (link.indexOf('slack') > -1) {
    return 'socialSlack';
  }

  if (link.indexOf('telegram') > -1) {
    return 'socialTelegram';
  }

  return 'socialAnyUrl';
}

const LinksTab: FC<LinksTabProps> = ({ links, onChange }) => {
  const handleClickAdd = React.useCallback(() => {
    const newId = nanoid();
    const newItem = {
      id: newId,
      url: ''
    };

    if (links) {
      onChange([...links, newItem]);
    } else {
      onChange([newItem]);
    }
  }, [links, onChange]);

  return (
    <div className={styles.root}>
      <div className={styles.row}>
        <div className={styles.label}>Links</div>
      </div>
      {links.map(item => {
        const icon = getLinkIcon(item.url);

        return (
          <div className={styles.row} key={item.id}>
            <Icon name={icon} className={styles.icon} />
            <Input
              size="large"
              textAlign="left"
              value={item.url}
              onChange={e => {
                const updatedLinks = links.map(link => {
                  if (link.id === item.id) {
                    return {
                      ...link,
                      url: (e.target as HTMLInputElement).value
                    };
                  }

                  return link;
                });

                onChange(updatedLinks);
              }}
            />
          </div>
        );
      })}
      <div className={styles.row}>
        <Button
          className={styles.add}
          variant="tertiary"
          onClick={handleClickAdd}
        >
          <Icon name="buttonAdd" className={styles.icon} />
          <span>Add link</span>
        </Button>
      </div>
    </div>
  );
};

export default LinksTab;

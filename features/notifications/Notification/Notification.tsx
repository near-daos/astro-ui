import React from 'react';
import cn from 'classnames';

import { dispatchCustomEvent } from 'utils/dispatchCustomEvent';

import { Icon } from 'components/Icon';

import { HIDE_NOTIFICATION_EVENT } from 'constants/common';

import {
  NOTIFICATION_TYPES,
  NotificationProps,
} from 'features/notifications/types';

import s from './Notification.module.scss';

export const Notification: React.FC<NotificationProps> = props => {
  const { id, tag, flat, type, description } = props;

  const className = cn(s.body, {
    [s.success]: type === NOTIFICATION_TYPES.SUCCESS,
    [s.error]: type === NOTIFICATION_TYPES.ERROR,
    [s.info]: type === NOTIFICATION_TYPES.INFO,
    [s.flat]: flat,
  });

  function onCloseClick() {
    dispatchCustomEvent(HIDE_NOTIFICATION_EVENT, { id });
  }

  function renderTag() {
    return tag ? <div className={s.tag}>{tag}</div> : null;
  }

  return (
    <div className={cn(s.root, className)}>
      <div
        className={cn(s.status, {
          [s.success]: type === NOTIFICATION_TYPES.SUCCESS,
          [s.error]: type === NOTIFICATION_TYPES.ERROR,
          [s.info]: type === NOTIFICATION_TYPES.INFO,
        })}
      >
        <Icon name="info" width={18} />
      </div>
      <div className={s.content}>
        {renderTag()}
        {description}
      </div>
      <Icon
        name="close"
        className={s.closeIcon}
        onClick={onCloseClick}
        width={18}
        data-testid="agn-close-button"
      />
    </div>
  );
};

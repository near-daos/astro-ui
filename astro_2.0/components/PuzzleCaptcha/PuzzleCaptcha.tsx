import cn from 'classnames';
import { useTranslation } from 'next-i18next';
import { ChangeEvent, useEffect, useRef, useState, VFC } from 'react';

import { Icon } from 'components/Icon';

import { getRandomInt } from 'utils/getRandomInt';
import { getElementSize } from 'utils/getElementSize';

import styles from './PuzzleCaptcha.module.scss';

interface PuzzleCaptchaProps {
  className?: string;
  onReset?: () => void;
  onCaptchaDone: (isValid: boolean) => void;
}

const HOLE_WIDTH = 60;
const ALLOWED_DEVIATION = 20;

export const PuzzleCaptcha: VFC<PuzzleCaptchaProps> = props => {
  const { className, onCaptchaDone, onReset: onResetCallbasck } = props;

  const rootElRef = useRef(null);
  const { t } = useTranslation();

  const [isValid, setIsValid] = useState<boolean>();
  const [rootWidth, setRootWidth] = useState(0);
  const [canUpdate, setCanUpdate] = useState(true);
  const [rangeValue, setRangeValue] = useState('0');
  const [showHelper, setShowHelper] = useState(true);
  const [holePosition, setHolePosition] = useState(0);
  const [captchaBg] = useState(`/assets/captcha/bg/F${getRandomInt(1, 3)}.svg`);

  useEffect(() => {
    const rootEl = rootElRef.current;

    if (rootEl) {
      const { width } = getElementSize(rootEl);

      setRootWidth(width);

      const minPosition = width / 4;
      const maxPosition = width - HOLE_WIDTH;

      const position = getRandomInt(minPosition, maxPosition);

      setHolePosition(position);
    }
  }, [rootElRef]);

  useEffect(() => {
    if (!canUpdate) {
      const intRangeValue = parseInt(rangeValue, 10);
      const valid =
        intRangeValue >= holePosition - ALLOWED_DEVIATION &&
        intRangeValue <= holePosition + ALLOWED_DEVIATION;

      setIsValid(valid);
      onCaptchaDone(valid);
    }
  }, [canUpdate, rangeValue, holePosition, onCaptchaDone]);

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    if (canUpdate) {
      const { value } = e.target;

      setShowHelper(value === '0');
      setRangeValue(value);
    }
  }

  function onMouseUp() {
    setCanUpdate(false);
    setShowHelper(false);
  }

  function onReset() {
    if (onResetCallbasck) {
      onResetCallbasck();
    }

    setCanUpdate(true);
    setRangeValue('0');
    setShowHelper(true);
    setIsValid(undefined);
  }

  const rootClassName = cn(styles.root, className, {
    [styles.success]: isValid === true,
    [styles.failure]: isValid === false,
  });

  const helperTextClassName = cn(styles.helperText, {
    [styles.hidden]: !showHelper,
  });

  return (
    <div className={rootClassName} ref={rootElRef}>
      <div
        className={styles.captcha}
        style={{
          backgroundImage: `url(${captchaBg})`,
        }}
      >
        <Icon
          name="captchaHoleReg"
          className={styles.hole}
          style={{
            width: HOLE_WIDTH + 1,
            left: holePosition,
          }}
        />
        <Icon
          name="captchaFlag"
          className={styles.fill}
          style={{
            width: HOLE_WIDTH,
            left: parseInt(rangeValue, 10),
          }}
        />
      </div>
      <div className={styles.sliderContainer}>
        <input
          min="0"
          max={rootWidth - HOLE_WIDTH}
          step="1"
          type="range"
          value={rangeValue}
          onChange={onChange}
          onMouseUp={onMouseUp}
          onTouchEnd={onMouseUp}
          className={styles.rangeInput}
        />
        <div className={helperTextClassName}>
          {t('captcha.dragSliderRight')}
        </div>
      </div>
      <Icon
        onClick={onReset}
        name="captchaReset"
        className={styles.resetButton}
      />
    </div>
  );
};

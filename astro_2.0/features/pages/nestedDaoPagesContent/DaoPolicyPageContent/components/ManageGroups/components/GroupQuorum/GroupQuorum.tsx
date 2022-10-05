// TODO requires localisation
import cn from 'classnames';
import React from 'react';
import { Range, getTrackBackground } from 'react-range';

import { Icon } from 'components/Icon';

import styles from './GroupQuorum.module.scss';

type Props = {
  quorum: number;
  onChange: (quorum: number) => void;
  disabled: boolean;
};

export const GroupQuorum: React.FC<Props> = ({
  quorum,
  onChange,
  disabled,
}) => {
  return (
    <div className={styles.voting}>
      <div className={styles.votingHead}>
        <Icon name="votingPolicy" />

        <h6 className={styles.votingTitle}>Voting policy</h6>
      </div>

      <p className={styles.votingText}>
        What is the quorum required for the decision of this group
      </p>

      <div className={styles.quorum}>
        <p className={styles.quorumText}>Group quorum %</p>

        <input
          type="number"
          className={styles.quorumInput}
          min={0}
          max={100}
          value={quorum}
          disabled={disabled}
          onChange={e => onChange(parseInt(e.target.value, 10))}
        />
      </div>

      <Range
        step={1}
        min={0}
        max={100}
        disabled={disabled}
        values={[quorum]}
        onChange={values => onChange(values[0])}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            role="button"
            tabIndex={0}
            className={cn(styles.slider, {
              [styles.disabled]: disabled,
            })}
            style={props.style}
          >
            <div
              ref={props.ref}
              className={styles.sliderTrack}
              style={{
                background: getTrackBackground({
                  values: [quorum],
                  colors: ['#6038D0', 'rgba(0, 0, 0, 0.26)'],
                  min: 1,
                  max: 100,
                }),
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div {...props} className={styles.sliderThumb}>
            <div className={styles.sliderThumbFigure} />
          </div>
        )}
      />
    </div>
  );
};

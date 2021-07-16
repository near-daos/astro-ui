import React, { useRef, useState } from 'react';
import './toggle.module.scss';
import uniqueId from 'lodash.uniqueid';
import { motion } from 'framer-motion';

export interface CheckboxProps extends React.HTMLProps<HTMLInputElement> {
  label?: string | undefined;
}

const rectVariants = {
  on: {
    fill: '#4b28ab'
  },
  off: {
    fill: '#d9d9d9'
  }
};

const circleVariants = {
  on: {
    cx: 28
  },
  off: {
    cx: 12
  }
};

const ToggleDisplay: React.FC<{ value?: boolean }> = ({ value }) => {
  return (
    <motion.svg
      initial={value ? 'on' : 'off'}
      animate={value ? 'on' : 'off'}
      width="40px"
      height="24px"
    >
      <motion.rect
        variants={rectVariants}
        width="40"
        height="24"
        rx="12"
        fill="#D9D9D9"
      />
      <motion.circle variants={circleVariants} cy="12" r="9" fill="white" />
    </motion.svg>
  );
};

export const Toggle = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...props }, externalRef) => {
    const idRef = useRef(uniqueId('toggle-'));
    const [checked, setChecked] = useState(props.defaultChecked);

    const value = props.checked || checked;

    return (
      <label htmlFor={props.id || idRef.current}>
        <input
          id={idRef.current}
          {...props}
          ref={externalRef}
          type="checkbox"
          onChange={e => {
            setChecked(e.target.checked);
          }}
        />
        <ToggleDisplay value={value} />
        {label}
      </label>
    );
  }
);

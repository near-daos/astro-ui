import React, { FC } from 'react';

type DotProps = {
  className?: string;
  color: string;
};

export const Dot: FC<DotProps> = ({ className, color }) => (
  <svg className={className} width="8" height="8" viewBox="0 0 32 32">
    <path
      fill={color}
      cx="16"
      cy="16"
      type="circle"
      transform="translate(16, 16)"
      d="M16,0A16,16,0,1,1,-16,0A16,16,0,1,1,16,0"
    />
  </svg>
);

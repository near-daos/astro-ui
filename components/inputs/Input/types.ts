import React, { CSSProperties, ReactNode } from 'react';
import { Property } from 'csstype';

export interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, 'size' | 'label'> {
  label?: string | ReactNode;
  description?: string | undefined;
  isValid?: boolean | undefined;
  inputSize?: number | undefined;
  inputStyles?: CSSProperties;
  size?: 'small' | 'medium' | 'large' | 'block' | 'content' | 'auto';
  isBorderless?: boolean;
  textAlign?: Property.TextAlign;
  inputClassName?: string;
  rightContent?: ReactNode;
}

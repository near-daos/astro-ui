import React, { createContext } from 'react';

const noop = (): void => undefined;

export type RadioContextType = {
  itemClassName?: string;
  activeItemCalssName?: string;
  state: string;
  onChange: (value: string) => void;
};

export const RadioContext = createContext<RadioContextType>({
  state: '',
  onChange: noop,
});

type RadioGroupProps = {
  className?: string;
  itemClassName?: string;
  activeItemCalssName?: string;
  children: JSX.Element[] | JSX.Element;
  value: string;
  onChange: (value: string) => void;
};

const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  itemClassName,
  activeItemCalssName,
  children,
  value,
  onChange,
}: RadioGroupProps) => {
  return (
    <RadioContext.Provider
      value={{
        state: value,
        onChange,
        itemClassName,
        activeItemCalssName,
      }}
    >
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioContext.Provider>
  );
};

export default RadioGroup;

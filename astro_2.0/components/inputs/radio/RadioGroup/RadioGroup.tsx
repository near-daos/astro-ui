import React, { createContext } from 'react';

const noop = (): void => undefined;

export type RadioContextType = {
  itemClassName?: string;
  activeItemClassName?: string;
  state: string;
  onChange: (value: string, e?: React.ChangeEvent<HTMLInputElement>) => void;
};

export const RadioContext = createContext<RadioContextType>({
  state: '',
  onChange: noop,
});

type RadioGroupProps = {
  className?: string;
  itemClassName?: string;
  activeItemClassName?: string;
  children: JSX.Element[] | JSX.Element;
  value: string;
  onChange: RadioContextType['onChange'];
};

export const RadioGroup: React.FC<RadioGroupProps> = ({
  className,
  itemClassName,
  activeItemClassName,
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
        activeItemClassName,
      }}
    >
      <div className={className} role="radiogroup">
        {children}
      </div>
    </RadioContext.Provider>
  );
};

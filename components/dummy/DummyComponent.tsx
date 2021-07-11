import React, { useState } from 'react';

interface DummyComponentProps {
  label: string;
}

export const DummyComponent: React.FC<DummyComponentProps> = ({ label }) => {
  const [counter, setCounter] = useState(0);

  return (
    <button type="button" onClick={() => setCounter(value => value + 1)}>
      <h2>
        {label} {counter}
      </h2>
    </button>
  );
};

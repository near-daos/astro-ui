import React, { FC, useEffect, useRef } from 'react';
import Mark from 'mark.js';
import { useSearchResults } from 'features/search/search-results/SearchResults';

export const Highlighter: FC<{ className?: string }> = ({
  children,
  className,
}) => {
  const root = useRef<HTMLDivElement | null>(null);
  const { searchResults } = useSearchResults();

  useEffect(() => {
    const term = searchResults?.query;

    if (term && root.current) {
      const instance = new Mark(root.current);

      const t = term.trim();

      instance.mark(t);

      instance.unmark({
        done: () => {
          instance.mark(t);
        },
      });
    }
  }, [searchResults?.query]);

  return (
    <div ref={root} className={className}>
      {children}
    </div>
  );
};

import { useList } from 'react-use';

interface UseAccordionParams {
  allowMultiSelect: boolean;
  allowUnSelect: boolean;
}

interface ItemProps {
  isOpen: boolean;
  toggle: (nextValue?: boolean) => void;
}

interface UseAccordionReturnT {
  toggleItem: (id: string) => void;
  selected: string[];
  getItemProps: (id: string) => ItemProps;
}

const defaultOptions: UseAccordionParams = {
  allowMultiSelect: false,
  allowUnSelect: false
};

export function useAccordion(
  options: UseAccordionParams = defaultOptions
): UseAccordionReturnT {
  const [selected, { push, set, filter, clear }] = useList<string>([]);

  const toggleItem = (id: string) => {
    if (options.allowMultiSelect) {
      if (selected.includes(id)) {
        filter(item => item !== id);
      } else {
        push(id);
      }
    } else {
      const [currentItem] = selected;

      if (currentItem === id) {
        if (options.allowUnSelect) {
          clear();
        }
      } else {
        set([id]);
      }
    }
  };

  const getItemProps = (id: string): ItemProps => ({
    toggle: () => toggleItem(id),
    isOpen: selected.includes(id)
  });

  return {
    selected,
    toggleItem,
    getItemProps
  };
}

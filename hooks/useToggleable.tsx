import React, {
  ComponentType,
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AnimatedLayout } from 'astro_3.0/components/AnimatedLayout';

type RefToggle = [boolean, Dispatch<SetStateAction<boolean>>];
type RefProps<P> = [Partial<P>, Dispatch<SetStateAction<Partial<P>>>];
type UseToggleableResult<P> = [ComponentType<P>, (props?: Partial<P>) => void];

const useToggleable = <P,>(FC: ComponentType<P>): UseToggleableResult<P> => {
  const refToggle = useRef<RefToggle>();
  const refProps = useRef<RefProps<P>>();

  const toggle = useCallback((props?: Partial<P>) => {
    if (!refProps.current || !refToggle.current) {
      return;
    }

    const [visible, setVisible] = refToggle.current;
    const [, setProps] = refProps.current;

    if (props) {
      setProps(props);
    }

    setVisible(props ? true : !visible);
  }, []);

  const ToggleableComponent = useMemo(() => {
    const WrappedComponent: React.ComponentType<P> = props => {
      refToggle.current = useState<boolean>(false);
      refProps.current = useState<Partial<P>>(props);

      return (
        <AnimatedLayout>
          {refToggle.current[0] ? (
            <FC {...props} {...refProps.current[0]} />
          ) : null}
        </AnimatedLayout>
      );
    };

    return WrappedComponent;
  }, [FC]);

  return [ToggleableComponent, toggle];
};

export default useToggleable;

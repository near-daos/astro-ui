type ElSize = {
  height: number;
  width: number;
  clientHeight: number;
  clientWidth: number;
  offsetHeight: number;
  offsetWidth: number;
  heightWithMargin: number;
  widthWithMargin: number;
};

export function getElementSize(element: HTMLElement): ElSize {
  const styles = window.getComputedStyle(element);
  const {
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
  } = styles;

  // size include padding
  const { clientHeight, clientWidth } = element;

  // size include padding and border
  const { offsetHeight, offsetWidth } = element;

  // size without padding and border
  const height =
    clientHeight - parseFloat(paddingTop) - parseFloat(paddingBottom);
  const width =
    clientWidth - parseFloat(paddingLeft) - parseFloat(paddingRight);

  // size include padding, border and margin
  const heightWithMargin =
    offsetHeight + parseFloat(marginTop) + parseFloat(marginBottom);
  const widthWithMargin =
    offsetWidth + parseFloat(marginLeft) + parseFloat(marginRight);

  return {
    height,
    width,
    clientHeight,
    clientWidth,
    offsetHeight,
    offsetWidth,
    heightWithMargin,
    widthWithMargin,
  };
}

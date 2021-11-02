export const toggleItemInArray = <T extends string | number>(
  item: T,
  arr: T[]
): T[] => {
  const arrCopy = [...arr];
  const index = arrCopy.indexOf(item);

  if (index === -1) {
    arrCopy.push(item);
  } else {
    arrCopy.splice(index, 1);
  }

  return arrCopy;
};

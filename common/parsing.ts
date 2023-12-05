export const parseNum = (value: string): number | null => {
  const num = parseInt(value, 10);
  return isNaN(num) ? null : num;
};

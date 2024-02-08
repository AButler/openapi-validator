export const isNumber = (value: string) => {
  return !isNaN(value as unknown as number) && !isNaN(parseInt(value));
};

export const calculateScore = (moves: number, seconds: number) =>
  Math.round((1 / (moves * seconds)) * 1000000);

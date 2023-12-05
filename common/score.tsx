export const calculateScore = (moves: number, seconds: number) => {
  const score = Math.round(1 / (moves * seconds * 1000000));
  return score;
};

/**
 * Calculate the mean, quartiles, and max of a set of durations
 *
 * @param numbers The durations to calculate the statistics for
 * @returns An object containing the mean, Q1, Q3, and max of the durations
 */
export const calculateQuartileStatistics = (numbers: number[]) => {
  const sorted = numbers.sort((a, b) => a - b);
  const mean = sorted.reduce((acc, val) => acc + val, 0) / sorted.length;
  const median = calculateMedian(sorted);

  const upperHalf =
    sorted.length % 2 === 0
      ? sorted.slice(Math.floor(sorted.length / 2))
      : sorted.slice(Math.ceil(sorted.length / 2));
  const lowerHalf = sorted.slice(0, Math.floor(sorted.length / 2));

  const Q1 = calculateMedian(lowerHalf);
  const Q3 = calculateMedian(upperHalf);

  const max = sorted[sorted.length - 1];

  return { mean, Q1, median, Q3, max };
};

/**
 * Calculate the median of a set of numbers
 *
 * @param numbers The numbers to calculate the median for
 * @returns The median of the numbers
 */
export const calculateMedian = (numbers: number[]) => {
  const sorted = numbers.sort((a, b) => a - b);
  let median;

  if (sorted.length % 2 === 0) {
    median = (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2;
  } else {
    median = sorted[Math.floor(sorted.length / 2)];
  }

  return median;
};

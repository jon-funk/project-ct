import {
  calculateMedian,
  calculateQuartileStatistics,
} from "../../utils/statistics";

describe("calculateMedian", () => {
  it("correctly calculates the median for an odd number of numbers", () => {
    const numbers = [1, 2, 3, 4, 5];

    const result = calculateMedian(numbers);

    expect(result).toBe(3);
  });

  it("correctly calculates the median for an even number of numbers", () => {
    const numbers = [1, 2, 3, 4];

    const result = calculateMedian(numbers);

    expect(result).toBe(2.5);
  });

  it("correctly calculates the median for a single number", () => {
    const numbers = [1];

    const result = calculateMedian(numbers);

    expect(result).toBe(1);
  });
});
describe("calculateQuartileStatistics", () => {
  it("correctly calculates statistical metrics for an odd number of numbers", () => {
    const durations = [15, 30, 60, 90, 120, 150, 165];

    const result = calculateQuartileStatistics(durations);

    expect(result).toEqual({
      Q1: 30,
      mean: 90,
      median: 90,
      Q3: 150,
      max: 165,
    });
  });

  it("correctly calculates statistical metrics for an even number of numbers", () => {
    const durations = [15, 30, 60, 90, 120, 150];

    const result = calculateQuartileStatistics(durations);

    expect(result).toEqual({
      Q1: 30,
      mean: 77.5,
      median: 75,
      Q3: 120,
      max: 150,
    });
  });

  it("correctly calculates Q1 and Q3 quartiles for five numbers", () => {
    const durations = [30, 60, 90, 120, 150];

    const result = calculateQuartileStatistics(durations);

    expect(result).toEqual({
      Q1: 45,
      Q3: 135,
      max: 150,
      mean: 90,
      median: 90,
    });
  });
});

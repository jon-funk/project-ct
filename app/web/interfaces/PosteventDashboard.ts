import { PatientEncounterRow } from "./PatientEncounterRow";

export interface AggregatedDurations {
  totalDurations: number[];
  redDurations: number[];
  yellowDurations: number[];
  greenDurations: number[];
  whiteDurations: number[];
}
export interface LosDuration {
  durationMinutes: number | null;
  acuity: string;
}

export type RowDataCCCount = [string, number, number, number, number, number];

export type FilterConditionFunction = (
  encounter: PatientEncounterRow
) => boolean;

export interface ComplaintCount {
  complaint: string;
  count: number;
}

export type AcuityCountPerDay = Record<
  string,
  {
    countWhite: number;
    countGreen: number;
    countYellow: number;
    countRed: number;
    totalCounts: number;
    percWhite: number;
    percGreen: number;
    percYellow: number;
    percRed: number;
  }
>;

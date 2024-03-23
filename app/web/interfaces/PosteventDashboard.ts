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

export type OffsiteTransportCountTotals = {
  ambulance: number;
  private: number;
  nonEmergency: number;
};

export type OffsiteTransportEntry = {
  id: string;
  date: string;
  timeLeft: string;
  method: string;
  chiefComplaint: string;
};

export interface BoxPlotData {
  day: string;
  data: number[];
}

export interface LengthOfStayDashboardData {
  all: BoxPlotData[];
  red: BoxPlotData[];
  yellow: BoxPlotData[];
  green: BoxPlotData[];
  white: BoxPlotData[];
}

export interface LengthOfStayDashboardProps {
  losBoxPlotData: LengthOfStayDashboardData;
  losMedianData: LengthOfStayMedianTableAllData;
  transportLosListData: LengthOfStayTransportItem[];
}

export interface LengthOfStayMedianRow {
  chiefComplaint: string;
  medianLosMinutes: number;
  hospital: number;
}

export interface LengthOfStayMedianTableAllData {
  red: LengthOfStayMedianTableData;
  yellow: LengthOfStayMedianTableData;
  green: LengthOfStayMedianTableData;
  white: LengthOfStayMedianTableData;
}

export interface LengthOfStayMedianTableData {
  tableData: LengthOfStayMedianRow[];
  acuityMedianMinutes: number;
}

export interface LengthOfStayStyle {
  title: string;
  titleColor: string;
  titleBackground: string;
  boxFill?: string;
  boxStroke?: string;
}

export const defaultStyle: LengthOfStayStyle = {
  title: "",
  titleColor: "",
  titleBackground: "",
  boxFill: "",
  boxStroke: "",
};

export const defaultLosMedianTableData: LengthOfStayMedianTableData = {
  tableData: [],
  acuityMedianMinutes: 0,
};

export const defaultLosMedianTableAllData: LengthOfStayMedianTableAllData = {
  red: defaultLosMedianTableData,
  yellow: defaultLosMedianTableData,
  green: defaultLosMedianTableData,
  white: defaultLosMedianTableData,
};

export interface LengthOfStayTransportItem {
  patient_encounter_uuid: string;
  triage_acuity: string;
  chief_complaint: string;
  length_of_stay: string;
}

export interface LengthOfStayTransportsListProps {
  data: LengthOfStayTransportItem[];
}

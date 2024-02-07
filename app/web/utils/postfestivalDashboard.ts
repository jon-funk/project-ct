import { PatientEncounterRow } from "../interfaces/PatientEncounterRow";
import { PresentationGroup } from "../interfaces/PresentationGroup";
import { buildBearerTokenHeader } from "./authentication";
import { SubmitAlert } from "../interfaces/SubmitAlert";
import { ChiefComplaintCountsTableRowData } from "../interfaces/ChiefComplaintCountsTableProps";
import { TriageAcuities } from "../constants/medicalForm";
import { LengthOfStayCountsTableProps } from "../interfaces/LengthOfStayCountsTableProps";

/**
 * Generates data for the Post Festival Common Presentations table
 *
 * @param data The patient encounters data to generate the table from
 *
 * @returns An object containing the data for the Post Festival Common Presentations table
 */
export const generatePostFestivalCommonPresentationsData = (
  data: PatientEncounterRow[]
) => {
  // TODO: Implement actual generation logic
  console.log("TODO: Implement actual generation logic:", data);

  const commonPresentationsDataRed: PresentationGroup = {
    rows: [
      { complaint: "Loss of Consciousness", count: 8 },
      { complaint: "Chest Pain", count: 2 },
      { complaint: "Abdominal Pain", count: 2 },
      { complaint: "Trauma", count: 2 },
    ],
    totals: { totalCount: 14, outOf: 50 },
    headerName: "Common Presentations Red",
    backgroundColor: "#800020",
    textColor: "#FFFFFF",
  };

  const transportsDataRed: PresentationGroup = {
    rows: [
      { complaint: "Seizure", count: 3 },
      { complaint: "Loss of Consciousness", count: 2 },
      { complaint: "Agitation", count: 1 },
    ],
    totals: { totalCount: 6, outOf: 12 },
    headerName: "Common Transports Red",
    backgroundColor: "#800020",
    textColor: "#FFFFFF",
  };

  const commonPresentationsDataYellow: PresentationGroup = {
    rows: [
      { complaint: "Loss of Consciousness", count: 8 },
      { complaint: "Chest Pain", count: 2 },
      { complaint: "Abdominal Pain", count: 2 },
      { complaint: "Trauma", count: 2 },
    ],
    totals: { totalCount: 14, outOf: 14 },
    headerName: "Common Presentations Yellow",
    backgroundColor: "#ffbf00",
    textColor: "#000000",
  };

  const transportsDataYellow: PresentationGroup = {
    rows: [
      { complaint: "Seizure", count: 3 },
      { complaint: "Loss of Consciousness", count: 2 },
      { complaint: "Agitation", count: 1 },
    ],
    totals: { totalCount: 6, outOf: 12 },
    headerName: "Common Transports Yellow",
    backgroundColor: "#ffbf00",
    textColor: "#000000",
  };

  return {
    commonPresentationsDataRed,
    transportsDataRed,
    commonPresentationsDataYellow,
    transportsDataYellow,
  };
};

export function buildPatientEncountersAPIPathQuery(
  startDate: string | null,
  endDate: string | null
): string {
  const baseUrl = `${process.env.NEXT_PUBLIC_HOSTNAME}/patient-encounters`;
  const queryParams = [];

  if (startDate) {
    queryParams.push(`arrival_date_min=${encodeURIComponent(startDate)}`);
  }

  if (endDate) {
    queryParams.push(`arrival_date_max=${encodeURIComponent(endDate)}`);
  }

  // Join all query parameters with '&' and prepend '?' if there are any parameters
  const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
  const fullPath = `${baseUrl}${queryString}`;

  return fullPath;
}

export async function fetchPatientEncountersData(
  startDate: string | null,
  endDate: string | null,
  setApiAlert: React.Dispatch<React.SetStateAction<SubmitAlert | null>>
): Promise<PatientEncounterRow[]> {
  try {
    const token = buildBearerTokenHeader().headers.Authorization;
    const response = await fetch(
      buildPatientEncountersAPIPathQuery(startDate, endDate),
      {
        method: "GET",
        mode: "cors",
        headers: {
          Accept: "application/json",
          Authorization: token,
        },
      }
    );

    const response_data = await response.json();

    for (let i = 0; i < response_data.length; i++) {
      const encounter = response_data[i];

      // Split the chief complaints into an array
      encounter.chief_complaints = encounter.chief_complaints.split(",");

      // Convert the date and time strings into Date objects
      encounter.arrival_date = new Date(`${encounter.arrival_date}Z`);
      encounter.arrival_time = new Date(`${encounter.arrival_time}Z`);
      if (encounter.departure_date !== null) {
        encounter.departure_date = new Date(`${encounter.departure_date}Z`);
      }
      if (encounter.departure_time !== null) {
        encounter.departure_time = new Date(`${encounter.departure_time}Z`);
      }
      response_data[i] = encounter;
    }
    if (response.ok) {
      return response_data;
    } else {
      console.error(
        "Unable to retrieve data from API. Received error: ",
        response_data
      );
      setApiAlert({
        type: "error",
        message: `Unable to retrieve data from API. Received error: ${response_data}`,
      });
      return [];
    }
  } catch (error) {
    console.error(
      "Error while trying to retrieve patient encounter forms: ",
      error
    );
    setApiAlert({
      type: "error",
      message: `Error while trying to retrieve patient encounter forms: ${error}`,
    });
    return [];
  }
}

export function calculateChiefComplaintEncounterCountsData(
  patientEncounters: PatientEncounterRow[]
): number[] {
  const counts = [0, 0, 0, 0];

  patientEncounters.forEach((encounter) => {
    const numberComplaints = encounter.chief_complaints.length;

    if (numberComplaints > 3) {
      counts[3]++;
    } else {
      counts[numberComplaints - 1]++;
    }
  });
  return counts;
}

export function calculateChiefComplaintEncounterCountsSummary(
  patientEncounters: PatientEncounterRow[]
): ChiefComplaintCountsTableRowData[] {
  const counts = new Map<
    string,
    { total: number; exclusive: number; coOccurring: number }
  >();

  const normalizeComplaint = (complaint: string): string => {
    let normalized = complaint.toLowerCase().trim();
    normalized = normalized.includes("other:") ? "other" : normalized;
    return normalized;
  };

  patientEncounters.forEach((encounter) => {
    const normalizedComplaints =
      encounter.chief_complaints.map(normalizeComplaint);

    // Check if this encounter has a single (exclusive) complaint or multiple (co-occurring)
    const isExclusive = normalizedComplaints.length === 1;

    normalizedComplaints.forEach((complaint) => {
      if (!counts.has(complaint)) {
        counts.set(complaint, { total: 0, exclusive: 0, coOccurring: 0 });
      }
      const complaintData = counts.get(complaint)!;
      complaintData.total += 1;
      if (isExclusive) {
        complaintData.exclusive += 1;
      } else {
        complaintData.coOccurring += 1;
      }
    });
  });

  const summaryData: ChiefComplaintCountsTableRowData[] = [];
  let index = 0;

  counts.forEach((data, complaint) => {
    const totalEncounters = patientEncounters.length;
    const precOfPatientEncounters =
      totalEncounters > 0 ? (data.total / totalEncounters) * 100 : 0;

    summaryData.push({
      id: index++,
      chief_complaint: complaint.charAt(0).toUpperCase() + complaint.slice(1),
      total_count: data.total,
      prec_of_patient_encounters: parseFloat(
        precOfPatientEncounters.toFixed(2)
      ),
      exclusive_cc_count: data.exclusive,
      co_occuring_cc_count: data.coOccurring,
    });
  });

  summaryData.sort((a, b) => b.total_count - a.total_count);

  return summaryData;
}

export function calculatePostFestivalLengthOfStayData(
  patientEncounters: PatientEncounterRow[]
): LengthOfStayCountsTableProps {
  const rowsDataCCCount = [
    ["Unknown", 0, 0, 0, 0, 0],
    ["0 - 15 mins", 0, 0, 0, 0, 0],
    ["16 - 30 mins", 0, 0, 0, 0, 0],
    ["31 - 45 mins", 0, 0, 0, 0, 0],
    ["46 - 60 mins", 0, 0, 0, 0, 0],
    ["61 - 75 mins", 0, 0, 0, 0, 0],
    ["76 - 90 mins", 0, 0, 0, 0, 0],
    ["91 - 105 mins", 0, 0, 0, 0, 0],
    ["106 - 120 mins", 0, 0, 0, 0, 0],
    ["121 - 135 mins", 0, 0, 0, 0, 0],
    ["136 - 150 mins", 0, 0, 0, 0, 0],
    [">150 mins", 0, 0, 0, 0, 0],
  ];

  const summaryRowsCCCount = [
    ["Q1", 0, 0, 0, 0, 0],
    ["Mean", 0, 0, 0, 0, 0],
    ["Q3", 0, 0, 0, 0, 0],
    ["Max", 0, 0, 0, 0, 0],
  ];

  const losDurations = patientEncounters.map((encounter) => {
    const arrivalDateTime = new Date(encounter.arrival_date);
    arrivalDateTime.setHours(encounter.arrival_time.getHours());
    arrivalDateTime.setMinutes(encounter.arrival_time.getMinutes());
    arrivalDateTime.setSeconds(encounter.arrival_time.getSeconds());

    const departureDateTime = new Date(encounter.departure_date);
    departureDateTime.setHours(encounter.departure_time.getHours());
    departureDateTime.setMinutes(encounter.departure_time.getMinutes());
    departureDateTime.setSeconds(encounter.departure_time.getSeconds());

    const durationMinutes =
      (departureDateTime.getTime() - arrivalDateTime.getTime()) / (1000 * 60);

    return { durationMinutes, acuity: encounter.triage_acuity };
  });

  losDurations.forEach(({ durationMinutes, acuity }) => {
    let rowIndex;
    if (durationMinutes <= 15) {
      rowIndex = 1;
    } else if (durationMinutes <= 30) {
      rowIndex = 2;
    } else if (durationMinutes <= 45) {
      rowIndex = 3;
    } else if (durationMinutes <= 60) {
      rowIndex = 4;
    } else if (durationMinutes <= 75) {
      rowIndex = 5;
    } else if (durationMinutes <= 90) {
      rowIndex = 6;
    } else if (durationMinutes <= 105) {
      rowIndex = 7;
    } else if (durationMinutes <= 120) {
      rowIndex = 8;
    } else if (durationMinutes <= 135) {
      rowIndex = 9;
    } else if (durationMinutes <= 150) {
      rowIndex = 10;
    } else {
      rowIndex = 11;
    }

    (rowsDataCCCount[rowIndex][1] as number)++;

    console.log("acuity", acuity);
    // Increment the count for the specific triage acuity
    switch (acuity) {
      case TriageAcuities.Red:
        (rowsDataCCCount[rowIndex][2] as number)++;
        break;
      case TriageAcuities.Yellow:
        (rowsDataCCCount[rowIndex][3] as number)++;
        break;
      case TriageAcuities.Green:
        (rowsDataCCCount[rowIndex][4] as number)++;
        break;
      case TriageAcuities.White:
        (rowsDataCCCount[rowIndex][5] as number)++;
        break;
    }
  });

  // Step 1: Aggregate duration minutes into separate arrays
  const totalDurations: number[] = [];
  const redDurations: number[] = [];
  const yellowDurations: number[] = [];
  const greenDurations: number[] = [];
  const whiteDurations: number[] = [];

  losDurations.forEach(({ durationMinutes, acuity }) => {
    totalDurations.push(durationMinutes);
    switch (acuity) {
      case TriageAcuities.Red:
        redDurations.push(durationMinutes);
        break;
      case TriageAcuities.Yellow:
        yellowDurations.push(durationMinutes);
        break;
      case TriageAcuities.Green:
        greenDurations.push(durationMinutes);
        break;
      case TriageAcuities.White:
        whiteDurations.push(durationMinutes);
        break;
    }
  });

  // Helper function to calculate mean, quartiles, and max
  const calculateStatistics = (durations: number[]) => {
    const sorted = durations.sort((a, b) => a - b);
    const mean = sorted.reduce((acc, val) => acc + val, 0) / sorted.length;
    const Q1 = sorted[Math.floor(sorted.length / 4)];
    const Q3 = sorted[Math.floor(sorted.length * (3 / 4))];
    const max = sorted[sorted.length - 1];

    return { mean, Q1, Q3, max };
  };

  // Step 2, 3, 4, 5: Calculate statistics for each category
  const totalStats = calculateStatistics(totalDurations);
  const redStats = calculateStatistics(redDurations);
  const yellowStats = calculateStatistics(yellowDurations);
  const greenStats = calculateStatistics(greenDurations);
  const whiteStats = calculateStatistics(whiteDurations);

  // Populate summaryRowsCCCount with calculated statistics
  summaryRowsCCCount[0] = [
    "Q1",
    totalStats.Q1,
    redStats.Q1,
    yellowStats.Q1,
    greenStats.Q1,
    whiteStats.Q1,
  ];
  summaryRowsCCCount[1] = [
    "Mean",
    totalStats.mean,
    redStats.mean,
    yellowStats.mean,
    greenStats.mean,
    whiteStats.mean,
  ];
  summaryRowsCCCount[2] = [
    "Q3",
    totalStats.Q3,
    redStats.Q3,
    yellowStats.Q3,
    greenStats.Q3,
    whiteStats.Q3,
  ];
  summaryRowsCCCount[3] = [
    "Max",
    totalStats.max,
    redStats.max,
    yellowStats.max,
    greenStats.max,
    whiteStats.max,
  ];

  return { rows: rowsDataCCCount, summaryRows: summaryRowsCCCount };
}

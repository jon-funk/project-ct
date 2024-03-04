import { PatientEncounterRow } from "../interfaces/PatientEncounterRow";
import { buildBearerTokenHeader } from "./authentication";
import { SubmitAlert } from "../interfaces/SubmitAlert";
import { ChiefComplaintCountsTableRowData } from "../interfaces/ChiefComplaintCountsTableProps";
import { TriageAcuities, TriageAcuity } from "../constants/medicalForm";
import { LengthOfStayCountsTableProps } from "../interfaces/LengthOfStayCountsTableProps";
import { calculateQuartileStatistics } from "./statistics";
import {
  initialRowsDataCCCount,
  initialSummaryRowsCCCount,
} from "../constants/posteventDashboard";
import {
  AcuityCountPerDay,
  AggregatedDurations,
} from "../interfaces/PosteventDashboard";
import { LosDuration } from "../interfaces/PosteventDashboard";
import { RowDataCCCount } from "../interfaces/PosteventDashboard";
import { UserGroupKeys } from "../constants/keys";
import { AcuityCountsData } from "../interfaces/AcuityCountsData";
import { ValidTriageAcuities } from "../constants/medicalForm";

/**
 * Builds the API path with query parameters for the patient encounters
 *
 * @param startDate The start date to filter the patient encounters by
 * @param endDate The end date to filter the patient encounters by
 * @returns The full API path with query parameters
 */
export function buildPatientEncountersAPIPathQuery(
  startDate: string | null,
  endDate: string | null
): string {
  const baseUrl = `${process.env.NEXT_PUBLIC_HOSTNAME}/${UserGroupKeys.Medical}/forms`;
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

/**
 * Fetch the patient encounters data from the API
 *
 * @param startDate The start date to filter the patient encounters by
 * @param endDate The end date to filter the patient encounters by
 * @param setApiAlert The state setter for the API alert
 * @returns The patient encounters data
 */
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

/**
 * Calculate the chief complaint encounter counts data for the Post Festival Chief Complaints table
 *
 * @param patientEncounters The patient encounters to calculate the chief complaint encounter counts for
 * @returns An array containing the counts for each number of chief complaints
 */
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

/**
 * Calculate the chief complaint encounter counts summary for the Post Festival Chief Complaints table
 *
 * @param patientEncounters The patient encounters to calculate the chief complaint encounter counts summary for
 * @returns An array containing the summary data for the Post Festival Chief Complaints table
 */
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

/**
 * Calculate the length of stay data for the Post Festival Length of Stay table
 *
 * @param patientEncounters The patient encounters to calculate the length of stay data for
 * @returns An object containing the data for the Post Festival Length of Stay table
 */
export function calculatePostFestivalLengthOfStayData(
  patientEncounters: PatientEncounterRow[]
): LengthOfStayCountsTableProps {
  // Get the initial data templates for the table
  const rowsDataCCCount = initialRowsDataCCCount();
  const summaryRowsCCCount = initialSummaryRowsCCCount();

  // Calculate the length of stay durations for each patient encounter
  const losDurations = calculateLosDurations(patientEncounters);

  // Categorize and count the encounters based on their length of stay
  const updatedRowsDataCCCount: RowDataCCCount[] = categorizeAndCountEncounters(
    losDurations,
    rowsDataCCCount as RowDataCCCount[]
  );

  // Aggregate the duration data by acuity
  const aggregatedDurations = aggregateDurationByAcuity(losDurations);

  // Calculate the statistics for each acuity
  const { totalStats, redStats, yellowStats, greenStats, whiteStats } =
    calculateStatisticsForAcuity(aggregatedDurations);

  // Update the summary rows with the calculated statistics
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

  return { rows: updatedRowsDataCCCount, summaryRows: summaryRowsCCCount };
}

/**
 * Calculate the length of stay durations for each patient encounter
 *
 * @param patientEncounters The patient encounters to calculate the length of stay durations for
 * @returns An array of objects containing the duration in minutes and the acuity of the encounter
 */
export function calculateLosDurations(
  patientEncounters: PatientEncounterRow[]
) {
  return patientEncounters.map((encounter) => {
    if (encounter.departure_date == null || encounter.departure_time == null) {
      return { durationMinutes: null, acuity: encounter.triage_acuity };
    }

    const arrivalDateTime = new Date(encounter.arrival_date);
    arrivalDateTime.setHours(
      encounter.arrival_time.getHours(),
      encounter.arrival_time.getMinutes(),
      encounter.arrival_time.getSeconds()
    );

    const departureDateTime = new Date(encounter.departure_date);
    departureDateTime.setHours(
      encounter.departure_time.getHours(),
      encounter.departure_time.getMinutes(),
      encounter.departure_time.getSeconds()
    );

    const durationMinutes =
      (departureDateTime.getTime() - arrivalDateTime.getTime()) / (1000 * 60);

    return { durationMinutes, acuity: encounter.triage_acuity };
  });
}

/**
 * Categorize and count the encounters based on their length of stay
 *
 * @param losDurations The length of stay durations for each patient encounter
 * @param rowsDataCCCount The initial data for the Post Festival Length of Stay table
 * @returns The updated data for the Post Festival Length of Stay table
 */
export const categorizeAndCountEncounters = (
  losDurations: LosDuration[],
  rowsDataCCCount: RowDataCCCount[]
) => {
  losDurations.forEach(({ durationMinutes, acuity }) => {
    let rowIndex;
    if (durationMinutes === null) {
      rowIndex = 0;
    } else if (durationMinutes <= 15) {
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

  return rowsDataCCCount;
};

/**
 * Aggregates the duration data by acuity
 *
 * @param losDurations The length of stay durations for each patient encounter
 * @returns An object containing the aggregated duration data for each acuity
 */
export function aggregateDurationByAcuity(losDurations: LosDuration[]) {
  const aggregatedDurations: AggregatedDurations = {
    totalDurations: [],
    redDurations: [],
    yellowDurations: [],
    greenDurations: [],
    whiteDurations: [],
  };

  losDurations.forEach(({ durationMinutes, acuity }) => {
    if (durationMinutes === null) return;

    aggregatedDurations.totalDurations.push(durationMinutes);

    switch (acuity) {
      case TriageAcuities.Red:
        aggregatedDurations.redDurations.push(durationMinutes);
        break;
      case TriageAcuities.Yellow:
        aggregatedDurations.yellowDurations.push(durationMinutes);
        break;
      case TriageAcuities.Green:
        aggregatedDurations.greenDurations.push(durationMinutes);
        break;
      case TriageAcuities.White:
        aggregatedDurations.whiteDurations.push(durationMinutes);
        break;
    }
  });

  return aggregatedDurations;
}

/**
 * Calculate the statistics for each acuity and aggregate the duration data.
 *
 * @param aggregatedDurations The aggregated duration data for each acuity
 * @returns An object containing the statistics for each acuity
 */
export function calculateStatisticsForAcuity(
  aggregatedDurations: AggregatedDurations
) {
  return {
    totalStats: calculateQuartileStatistics(aggregatedDurations.totalDurations),
    redStats: calculateQuartileStatistics(aggregatedDurations.redDurations),
    yellowStats: calculateQuartileStatistics(
      aggregatedDurations.yellowDurations
    ),
    greenStats: calculateQuartileStatistics(aggregatedDurations.greenDurations),
    whiteStats: calculateQuartileStatistics(aggregatedDurations.whiteDurations),
  };
}

export function calculateCommonPresentationsAndTransports(
  patientEncounters: PatientEncounterRow[]
) {
  // Filter encounters for red and yellow acuities
  const filteredForRed = patientEncounters.filter(
    (e) => e.triage_acuity === "red"
  );
  const filteredForYellow = patientEncounters.filter(
    (e) => e.triage_acuity === "yellow"
  );

  // Calculating common presentations and transports for Red and Yellow acuities
  const {
    aggregatedComplaints: commonPresentationsRed,
    uniqueTop10Count: uniqueRedTop10,
    totalUniqueEncounters: uniqueRedEncounters,
  } = aggregateComplaints(filteredForRed, () => true);

  const {
    aggregatedComplaints: commonPresentationsYellow,
    uniqueTop10Count: uniqueYellowTop10,
    totalUniqueEncounters: uniqueYellowEncounters,
  } = aggregateComplaints(filteredForYellow, () => true);

  const {
    aggregatedComplaints: transportsDataRed,
    totalUniqueEncounters: uniqueRedTransports,
  } = aggregateComplaints(filteredForRed, (e) =>
    e.departure_dest?.toLowerCase().includes("hospital")
  );

  const {
    aggregatedComplaints: transportsDataYellow,
    totalUniqueEncounters: uniqueYellowTransports,
  } = aggregateComplaints(filteredForYellow, (e) =>
    e.departure_dest?.toLowerCase().includes("hospital")
  );

  const totalTransports = uniqueRedTransports + uniqueYellowTransports;

  return {
    commonPresentationsDataRed: {
      rows: commonPresentationsRed.map(({ complaint, count }) => ({
        complaint,
        count,
      })),
      totals: {
        totalCount: uniqueRedTop10,
        outOf: uniqueRedEncounters,
      },
      headerName: "Common Presentations Red",
      backgroundColor: "#800020",
      textColor: "#FFFFFF",
    },
    transportsDataRed: {
      rows: transportsDataRed.map(({ complaint, count }) => ({
        complaint,
        count,
      })),
      totals: {
        totalCount: uniqueRedTransports,
        outOf: totalTransports,
      },
      headerName: "Common Transports Red",
      backgroundColor: "#800020",
      textColor: "#FFFFFF",
    },
    commonPresentationsDataYellow: {
      rows: commonPresentationsYellow.map(({ complaint, count }) => ({
        complaint,
        count,
      })),
      totals: {
        totalCount: uniqueYellowTop10,
        outOf: uniqueYellowEncounters,
      },
      headerName: "Common Presentations Yellow",
      backgroundColor: "#ffbf00",
      textColor: "#000000",
    },
    transportsDataYellow: {
      rows: transportsDataYellow.map(({ complaint, count }) => ({
        complaint,
        count,
      })),
      totals: {
        totalCount: uniqueYellowTransports,
        outOf: totalTransports,
      },
      headerName: "Common Transports Yellow",
      backgroundColor: "#ffbf00",
      textColor: "#000000",
    },
  };
}

export function aggregateComplaints(
  encounters: PatientEncounterRow[],
  filterCondition: (e: PatientEncounterRow) => boolean
) {
  const complaintCounts: Record<
    string,
    { count: number; encounters: Set<string> }
  > = {};

  encounters.forEach((encounter) => {
    if (filterCondition(encounter)) {
      encounter.chief_complaints.forEach((complaint) => {
        const normalizedComplaint = complaint.toLowerCase().trim();
        if (!complaintCounts[normalizedComplaint]) {
          complaintCounts[normalizedComplaint] = {
            count: 0,
            encounters: new Set(),
          };
        }
        complaintCounts[normalizedComplaint].count += 1;
        complaintCounts[normalizedComplaint].encounters.add(
          encounter.patient_encounter_uuid
        );
      });
    }
  });

  const aggregatedComplaints = Object.entries(complaintCounts)
    .map(([complaint, data]) => ({
      complaint,
      count: data.count,
      encounters: data.encounters.size,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10); // Get top 10

  const uniqueTop10Encounters = new Set<string>();
  aggregatedComplaints.forEach(({ complaint }) => {
    complaintCounts[complaint].encounters.forEach((encounterId) =>
      uniqueTop10Encounters.add(encounterId)
    );
  });

  const totalUniqueEncounters = new Set<string>();
  Object.values(complaintCounts).forEach((data) => {
    data.encounters.forEach((encounterId) =>
      totalUniqueEncounters.add(encounterId)
    );
  });

  return {
    aggregatedComplaints,
    uniqueTop10Count: uniqueTop10Encounters.size,
    totalUniqueEncounters: totalUniqueEncounters.size,
  };
}

export function calculateAcuityCountsData(
  patientEncounters: PatientEncounterRow[]
): AcuityCountsData[] {
  const acuityCounts: Record<string, number> = {
    white: 0,
    green: 0,
    yellow: 0,
    red: 0,
  };

  patientEncounters.forEach((encounter) => {
    if (acuityCounts.hasOwnProperty(encounter.triage_acuity)) {
      acuityCounts[encounter.triage_acuity] += 1;
    } else {
      console.error(
        `ERROR: Encounter with unknown acuity: ${encounter.triage_acuity}`
      );
    }
  });

  return Object.entries(acuityCounts).map(([acuity, encounters]) => ({
    acuity,
    encounters,
  }));
}

export function calculatePatientEncountersByAcuityPerDay(
  patientEncounters: PatientEncounterRow[]
): AcuityCountPerDay {
  const encountersByAcuityPerDay: AcuityCountPerDay = {};

  // Tally counts for each acuity per day
  patientEncounters.forEach((encounter) => {
    const date = encounter.arrival_date.toISOString().split("T")[0];
    const acuity = encounter.triage_acuity;

    if (!encountersByAcuityPerDay[date]) {
      encountersByAcuityPerDay[date] = {
        countWhite: 0,
        countGreen: 0,
        countYellow: 0,
        countRed: 0,
        totalCounts: 0,
        percWhite: 0,
        percGreen: 0,
        percYellow: 0,
        percRed: 0,
      };
    }

    if (isValidAcuity(acuity)) {
      const key = getAcuityCountKey(acuity);
      encountersByAcuityPerDay[date][key] += 1;
      encountersByAcuityPerDay[date].totalCounts += 1;
    } else {
      console.warn(`Unknown acuity encountered: ${acuity}`);
    }
  });

  // Calculate percentages for each acuity per day
  Object.keys(encountersByAcuityPerDay).forEach((date) => {
    const dayData = encountersByAcuityPerDay[date];
    const total = dayData.totalCounts;

    dayData.percWhite = (dayData.countWhite / total) * 100;
    dayData.percGreen = (dayData.countGreen / total) * 100;
    dayData.percYellow = (dayData.countYellow / total) * 100;
    dayData.percRed = (dayData.countRed / total) * 100;
  });

  return encountersByAcuityPerDay;
}

function isValidAcuity(
  value: string
): value is (typeof ValidTriageAcuities)[number] {
  return ValidTriageAcuities.includes(value as TriageAcuity);
}

function getAcuityCountKey(
  acuity: TriageAcuity
): keyof AcuityCountPerDay[string] {
  switch (acuity) {
    case "white":
      return "countWhite";
    case "green":
      return "countGreen";
    case "yellow":
      return "countYellow";
    case "red":
      return "countRed";
    default:
      throw new Error(`Unknown acuity encountered: ${acuity}`);
  }
}

import { PatientEncounterRow } from "../interfaces/PatientEncounterRow";
import { PresentationGroup } from "../interfaces/PresentationGroup";
import { buildBearerTokenHeader } from "./authentication";
import { SubmitAlert } from "../interfaces/SubmitAlert";
import { ChiefComplaintCountsTableRowData } from "../interfaces/ChiefComplaintCountsTableProps";

/**
 * Generates data for the Post Festival Length of Stay table
 *
 * @param data The patient encounters data to generate the table from
 *
 * @returns An object containing the data for the Post Festival Length of Stay table
 */
export const generatePostFestivalLengthOfStayData = (
  data: PatientEncounterRow[]
) => {
  // TODO: Implement actual generation logic
  console.log("TODO: Implement actual generation logic:", data);

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

  return { rowsDataCCCount, summaryRowsCCCount };
};

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

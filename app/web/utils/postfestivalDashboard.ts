import { PatientEncounterRow } from "../interfaces/PatientEncounterRow";
import { PresentationGroup } from "../interfaces/PresentationGroup";

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

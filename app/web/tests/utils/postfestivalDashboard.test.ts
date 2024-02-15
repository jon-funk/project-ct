import {
  calculateChiefComplaintEncounterCountsData,
  calculateChiefComplaintEncounterCountsSummary,
  calculateLosDurations,
  categorizeAndCountEncounters,
  aggregateDurationByAcuity,
  calculatePostFestivalLengthOfStayData,
  aggregateComplaints,
  calculateCommonPresentationsAndTransports,
  calculateAcuityCountsData,
} from "../../utils/postfestivalDashboard";
import { PatientEncounterRow } from "../../interfaces/PatientEncounterRow";
import { generateFakePatientEncounter } from "../__fixtures__/patientEncounters";
import { TriageAcuities } from "../../constants/medicalForm";
import { initialRowsDataCCCount } from "../../constants/posteventDashboard";
import { RowDataCCCount } from "../../interfaces/PosteventDashboard";
import { describe } from "node:test";

describe("calculateChiefComplaintEncounterCountsData", () => {
  it("correctly calculates encounter counts for varying numbers of chief complaints", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1), // 1 complaint
      generateFakePatientEncounter(2), // 2 complaints
      generateFakePatientEncounter(3), // 3 complaints
      generateFakePatientEncounter(4), // 4 complaints
    ].map((encounter) => ({
      ...encounter,
    }));

    const expectedResult = [1, 1, 1, 1];

    const result =
      calculateChiefComplaintEncounterCountsData(patientEncounters);

    expect(result).toEqual(expectedResult);
  });

  it("correctly calculates encounter counts for exclusive chief complaints", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1),
      generateFakePatientEncounter(1),
      generateFakePatientEncounter(1),
      generateFakePatientEncounter(1),
    ].map((encounter) => ({
      ...encounter,
    }));

    const expectedResult = [4, 0, 0, 0];

    const result =
      calculateChiefComplaintEncounterCountsData(patientEncounters);

    expect(result).toEqual(expectedResult);
  });
});

describe("calculateChiefComplaintEncounterCountsSummary", () => {
  it("should accurately count a single encounter with a single chief complaint", () => {
    const encounters = [
      generateFakePatientEncounter(1, { chief_complaints: ["Headache"] }),
    ];
    const expected = [
      {
        id: 0,
        chief_complaint: "Headache",
        total_count: 1,
        prec_of_patient_encounters: 100,
        exclusive_cc_count: 1,
        co_occuring_cc_count: 0,
      },
    ];
    const result = calculateChiefComplaintEncounterCountsSummary(encounters);
    expect(result).toEqual(expected);
  });

  it("should correctly summarize multiple encounters with exclusive complaints", () => {
    const encounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1, { chief_complaints: ["Headache"] }),
      generateFakePatientEncounter(1, { chief_complaints: ["Seizure"] }),
    ];
    const result = calculateChiefComplaintEncounterCountsSummary(encounters);

    const headacheResult = result.find((r) => r.chief_complaint === "Headache");
    const seizureResult = result.find((r) => r.chief_complaint === "Seizure");

    expect(headacheResult).toBeDefined();
    expect(seizureResult).toBeDefined();

    if (headacheResult && seizureResult) {
      expect(headacheResult.total_count).toBe(1);
      expect(seizureResult.total_count).toBe(1);
      expect(
        result.every(
          (r) => r.exclusive_cc_count === 1 && r.co_occuring_cc_count === 0
        )
      ).toBeTruthy();
    }
  });

  it("should aggregate counts correctly for encounters with co-occurring complaints", () => {
    const encounters = [
      generateFakePatientEncounter(2, {
        chief_complaints: ["Headache", "Agitation"],
      }),
      generateFakePatientEncounter(2, {
        chief_complaints: ["Headache", "Seizure"],
      }),
    ];
    const result = calculateChiefComplaintEncounterCountsSummary(encounters);
    // Validate the co-occurring and exclusive counts
    const headacheData = result.find((r) => r.chief_complaint === "Headache");
    if (!headacheData) {
      throw new Error("Headache data not found");
    }
    expect(headacheData.co_occuring_cc_count).toBe(2);
    expect(headacheData.exclusive_cc_count).toBe(0);
  });

  it("should normalize 'Other:' complaints to 'other' and aggregate them correctly", () => {
    const encounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1, {
        chief_complaints: ["Other: unspecified"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Other: not listed"],
      }),
    ];
    const result = calculateChiefComplaintEncounterCountsSummary(encounters);
    const otherData = result.find((r) => r.chief_complaint === "Other");
    if (!otherData) {
      throw new Error("Other data not found");
    }
    expect(otherData.total_count).toBe(2);
    expect(otherData.exclusive_cc_count).toBe(2);
  });

  it("should return an empty array when there are no encounters", () => {
    const encounters: PatientEncounterRow[] = [];
    const expected: PatientEncounterRow[] = [];
    const result = calculateChiefComplaintEncounterCountsSummary(encounters);
    expect(result).toEqual(expected);
  });
});

describe("calculatePostFestivalLengthOfStayData Length of Stay buckets", () => {
  it("correctly categorizes encounters by length of stay and calculates triage acuity counts", () => {
    const patientEncounters: PatientEncounterRow[] = [
      // Encounter that should fall into the "0 - 15 mins" category
      generateFakePatientEncounter(1, {
        arrival_date: new Date("2024-02-12T08:00:00Z"),
        arrival_time: new Date("2024-02-12T08:00:00Z"),
        departure_date: new Date("2024-02-12T08:10:00Z"),
        departure_time: new Date("2024-02-12T08:10:00Z"),
        triage_acuity: TriageAcuities.Red,
      }),
      // Encounter that should be categorized as "Unknown" due to undefined departure time
      generateFakePatientEncounter(1, {
        departure_date: undefined,
        departure_time: undefined,
        triage_acuity: TriageAcuities.Green,
      }),
      // Encounter for testing the statistical calculations
      generateFakePatientEncounter(1, {
        arrival_date: new Date("2024-02-12T09:00:00Z"),
        arrival_time: new Date("2024-02-12T09:00:00Z"),
        departure_date: new Date("2024-02-12T10:30:00Z"),
        departure_time: new Date("2024-02-12T10:30:00Z"),
        triage_acuity: TriageAcuities.Yellow,
      }),
    ];

    const result = calculatePostFestivalLengthOfStayData(patientEncounters);

    expect(result.rows[1][1]).toBe(1); // "0 - 15 mins" total count
    expect(result.rows[1][2]).toBe(1); // "0 - 15 mins" Red acuity count
    expect(result.rows[0][1]).toBe(1); // "Unknown" total count
    expect(result.rows[0][4]).toBe(1); // "Unknown" Green acuity count

    expect(result.summaryRows[1][1]).toBeGreaterThan(0); // Check if Mean > 0, indicating calculation took place
  });
});

describe("calculateLosDurations", () => {
  it("correctly calculates the length of stay durations", () => {
    const patientEncounters: PatientEncounterRow[] = [
      // Encounter that should fall into the "0 - 15 mins" category
      generateFakePatientEncounter(1, {
        arrival_date: new Date("2024-02-12T08:00:00Z"),
        arrival_time: new Date("2024-02-12T08:00:00Z"),
        departure_date: new Date("2024-02-12T08:10:00Z"),
        departure_time: new Date("2024-02-12T08:10:00Z"),
        triage_acuity: TriageAcuities.Red,
      }),
    ];

    const durations = calculateLosDurations(patientEncounters);
    expect(durations).toEqual([
      { durationMinutes: 10, acuity: TriageAcuities.Red },
    ]);
  });

  it("correctly handles unknown length of stay durations", () => {
    const patientEncounters: PatientEncounterRow[] = [
      // Encounter that should be categorized as "Unknown" due to undefined departure time
      generateFakePatientEncounter(1, {
        departure_date: undefined,
        departure_time: undefined,
        triage_acuity: TriageAcuities.Green,
      }),
    ];

    const durations = calculateLosDurations(patientEncounters);
    expect(durations).toEqual([
      { durationMinutes: null, acuity: TriageAcuities.Green },
    ]);
  });
});

describe("categorizeAndCountEncounters", () => {
  it("correctly categorizes and counts encounters by length of stay", () => {
    const losDurations = [
      { durationMinutes: null, acuity: TriageAcuities.Green },
      { durationMinutes: 10, acuity: TriageAcuities.Red },
      { durationMinutes: 20, acuity: TriageAcuities.Yellow },
      { durationMinutes: 40, acuity: TriageAcuities.White },
      { durationMinutes: 50, acuity: TriageAcuities.Red },
      { durationMinutes: 60, acuity: TriageAcuities.Yellow },
      { durationMinutes: 70, acuity: TriageAcuities.Green },
      { durationMinutes: 80, acuity: TriageAcuities.White },
      { durationMinutes: 90, acuity: TriageAcuities.Red },
      { durationMinutes: 100, acuity: TriageAcuities.Yellow },
      { durationMinutes: 110, acuity: TriageAcuities.Green },
      { durationMinutes: 120, acuity: TriageAcuities.White },
      { durationMinutes: 130, acuity: TriageAcuities.Red },
      { durationMinutes: 140, acuity: TriageAcuities.Yellow },
      { durationMinutes: 150, acuity: TriageAcuities.Green },
      { durationMinutes: 160, acuity: TriageAcuities.White },
      { durationMinutes: 170, acuity: TriageAcuities.Red },
      { durationMinutes: 180, acuity: TriageAcuities.Yellow },
      { durationMinutes: 190, acuity: TriageAcuities.Green },
      { durationMinutes: 200, acuity: TriageAcuities.White },
    ];

    const rowsDataCCCount = initialRowsDataCCCount();
    const updatedRows: RowDataCCCount[] = categorizeAndCountEncounters(
      losDurations,
      rowsDataCCCount as RowDataCCCount[]
    );

    expect(updatedRows).toEqual([
      ["Unknown", 1, 0, 0, 1, 0],
      ["0 - 15 mins", 1, 1, 0, 0, 0],
      ["16 - 30 mins", 1, 0, 1, 0, 0],
      ["31 - 45 mins", 1, 0, 0, 0, 1],
      ["46 - 60 mins", 2, 1, 1, 0, 0],
      ["61 - 75 mins", 1, 0, 0, 1, 0],
      ["76 - 90 mins", 2, 1, 0, 0, 1],
      ["91 - 105 mins", 1, 0, 1, 0, 0],
      ["106 - 120 mins", 2, 0, 0, 1, 1],
      ["121 - 135 mins", 1, 1, 0, 0, 0],
      ["136 - 150 mins", 2, 0, 1, 1, 0],
      [">150 mins", 5, 1, 1, 1, 2],
    ]);
  });
});

describe("aggregateDurationByAcuity", () => {
  it("correctly aggregates durations by acuity", () => {
    const losDurations = [
      { durationMinutes: 10, acuity: TriageAcuities.Red },
      { durationMinutes: 20, acuity: TriageAcuities.Yellow },
      { durationMinutes: 30, acuity: TriageAcuities.Green },
      { durationMinutes: 40, acuity: TriageAcuities.White },
      { durationMinutes: 50, acuity: TriageAcuities.Red },
    ];

    const aggregatedDurations = aggregateDurationByAcuity(losDurations);

    expect(aggregatedDurations.totalDurations).toEqual([10, 20, 30, 40, 50]);
    expect(aggregatedDurations.redDurations).toEqual([10, 50]);
    expect(aggregatedDurations.yellowDurations).toEqual([20]);
    expect(aggregatedDurations.greenDurations).toEqual([30]);
    expect(aggregatedDurations.whiteDurations).toEqual([40]);
  });

  it("ignores encounters with null duration", () => {
    const losDurations = [
      { durationMinutes: null, acuity: TriageAcuities.Red },
      { durationMinutes: 25, acuity: TriageAcuities.Yellow },
    ];

    const aggregatedDurations = aggregateDurationByAcuity(losDurations);

    expect(aggregatedDurations.totalDurations).toEqual([25]);
    expect(aggregatedDurations.redDurations).toEqual([]);
    expect(aggregatedDurations.yellowDurations).toEqual([25]);
  });

  it("distributes durations across all acuity levels correctly", () => {
    const losDurations = [
      { durationMinutes: 5, acuity: TriageAcuities.Red },
      { durationMinutes: 15, acuity: TriageAcuities.Yellow },
      { durationMinutes: 25, acuity: TriageAcuities.Green },
      { durationMinutes: 35, acuity: TriageAcuities.White },
      { durationMinutes: 45, acuity: TriageAcuities.Red },
    ];

    const aggregatedDurations = aggregateDurationByAcuity(losDurations);

    expect(aggregatedDurations.totalDurations.length).toBe(5);
    expect(aggregatedDurations.redDurations).toEqual([5, 45]);
    expect(aggregatedDurations.yellowDurations).toEqual([15]);
    expect(aggregatedDurations.greenDurations).toEqual([25]);
    expect(aggregatedDurations.whiteDurations).toEqual([35]);
  });
});

describe("calculatePostFestivalLengthOfStayData", () => {
  it("correctly calculates the length of stay data", () => {
    const patientEncounters: PatientEncounterRow[] = [
      // Encounter that should fall into the "0 - 15 mins" category
      generateFakePatientEncounter(1, {
        arrival_date: new Date("2024-02-12T08:00:00Z"),
        arrival_time: new Date("2024-02-12T08:00:00Z"),
        departure_date: new Date("2024-02-12T08:10:00Z"),
        departure_time: new Date("2024-02-12T08:10:00Z"),
        triage_acuity: TriageAcuities.Red,
      }),
      // Encounter that should be categorized as "Unknown" due to undefined departure time
      generateFakePatientEncounter(1, {
        departure_date: undefined,
        departure_time: undefined,
        triage_acuity: TriageAcuities.Green,
      }),
      // Encounter for testing the statistical calculations
      generateFakePatientEncounter(1, {
        arrival_date: new Date("2024-02-12T09:00:00Z"),
        arrival_time: new Date("2024-02-12T09:00:00Z"),
        departure_date: new Date("2024-02-12T10:30:00Z"),
        departure_time: new Date("2024-02-12T10:30:00Z"),
        triage_acuity: TriageAcuities.Yellow,
      }),
    ];

    const result = calculatePostFestivalLengthOfStayData(patientEncounters);

    expect(result.rows).toBeDefined();
    expect(result.summaryRows).toBeDefined();

    expect(result.rows[1][1]).toBe(1); // "0 - 15 mins" total count
    expect(result.rows[1][2]).toBe(1); // "0 - 15 mins" Red acuity count
    expect(result.rows[0][1]).toBe(1); // "Unknown" total count
    expect(result.rows[0][4]).toBe(1); // "Unknown" Green acuity count
  });
});

describe("aggregateComplaints", () => {
  it("correctly aggregates chief complaints", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
    ];

    const { aggregatedComplaints, totalUniqueEncounters: totalEncounters } =
      aggregateComplaints(patientEncounters, () => true);

    expect(aggregatedComplaints).toEqual([
      { complaint: "headache", count: 4, encounters: 4 },
      { complaint: "seizure", count: 4, encounters: 4 },
    ]);

    expect(totalEncounters).toBe(4);
  });

  it("returns the top 10 complaints by count", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Headache",
          "Seizure",
          "Anxiety",
          "Bizarre Behaviour",
        ],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Headache",
          "Seizure",
          "Chest Pain",
          "Dizziness/Presyncope/Lightheaded",
        ],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Headache",
          "Seizure",
          "Hallucinations",
          "Loss of Consciousness",
        ],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Headache",
          "Seizure",
          "Nausea/Vomiting",
          "Other Pain",
        ],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure", "Trauma"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure", "Trauma"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
      }),
    ];

    const { aggregatedComplaints } = aggregateComplaints(
      patientEncounters,
      () => true
    );

    expect(aggregatedComplaints.length).toBe(10);
    expect(aggregatedComplaints[0].complaint).toBe("headache");
    expect(aggregatedComplaints[0].count).toBe(11);
    expect(aggregatedComplaints[1].complaint).toBe("seizure");
    expect(aggregatedComplaints[1].count).toBe(11);
    expect(aggregatedComplaints[2].complaint).toBe("trauma");
    expect(aggregatedComplaints[2].count).toBe(2);
  });

  it("Correctly counts transports", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
        departure_dest: "hospital-ambulance",
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache", "Seizure"],
        departure_dest: "hospital-ambulance",
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Trauma"],
        departure_dest: "hospital-ambulance",
      }),
      generateFakePatientEncounter(1, {
        chief_complaints: ["Chest Pain"],
        departure_dest: "hospital-ambulance",
      }),
    ];

    const { aggregatedComplaints } = aggregateComplaints(
      patientEncounters,
      (encounter) => encounter.departure_dest === "hospital-ambulance"
    );

    expect(aggregatedComplaints.length).toBe(4); // 4 unique complaints
    expect(aggregatedComplaints[0].complaint).toBe("headache");
    expect(aggregatedComplaints[0].count).toBe(2);
    expect(aggregatedComplaints[1].complaint).toBe("seizure");
    expect(aggregatedComplaints[1].count).toBe(2);
    expect(aggregatedComplaints[2].complaint).toBe("trauma");
    expect(aggregatedComplaints[2].count).toBe(1);
    expect(aggregatedComplaints[3].complaint).toBe("chest pain");
    expect(aggregatedComplaints[3].count).toBe(1);
  });

  it("Correctly counts the number of unique encounters in the top ten", () => {
    const top10Encounters = Array.from({ length: 5 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Trauma",
          "Seizure",
          "Chest Pain",
          "Headache",
          "Nausea/Vomiting",
          "Other Pain",
          "Shortness of Breath",
          "Abdominal Pain",
          "Adverse Drug Effect",
          "Agitation",
        ],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "left-ama",
      })
    );
    const notTop10Encounters = Array.from({ length: 4 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Hallucinations"],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "left-ama",
      })
    );

    const mockEncounters = [...top10Encounters, ...notTop10Encounters];

    const { aggregatedComplaints, uniqueTop10Count, totalUniqueEncounters } =
      aggregateComplaints(mockEncounters, () => true);

    expect(aggregatedComplaints.length).toBe(10);
    expect(totalUniqueEncounters).toBe(9);
    expect(uniqueTop10Count).toBe(5);
  });
});

describe("calculateCommonPresentationsAndTransports", () => {
  it("calculates common presentations and transports accurately", () => {
    const redEncounters = Array.from({ length: 5 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Trauma"],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "left-ama",
      })
    );
    const yellowEncounters = Array.from({ length: 6 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Headache"],
        triage_acuity: TriageAcuities.Yellow,
        departure_dest: "left-ama",
      })
    );
    const hospitalTransportsRed = Array.from({ length: 3 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Seizure"],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "hospital-ambulance",
      })
    );

    const hospitalTransportsYellow = Array.from({ length: 3 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Chest Pain"],
        triage_acuity: TriageAcuities.Yellow,
        departure_dest: "hospital-ambulance",
      })
    );

    const mockEncounters = [
      ...redEncounters,
      ...yellowEncounters,
      ...hospitalTransportsRed,
      ...hospitalTransportsYellow,
    ];

    const result = calculateCommonPresentationsAndTransports(mockEncounters);

    // Verify the structure of the result
    expect(result).toHaveProperty("commonPresentationsDataRed");
    expect(result).toHaveProperty("transportsDataRed");
    expect(result).toHaveProperty("commonPresentationsDataYellow");
    expect(result).toHaveProperty("transportsDataYellow");

    // Verify the counts
    expect(result.commonPresentationsDataRed.rows.length).toBe(2);
    expect(result.transportsDataRed.rows.length).toBe(1);
    expect(result.commonPresentationsDataYellow.rows.length).toBe(2);
    expect(result.transportsDataYellow.rows.length).toBe(1);
  });

  it("correctly counts the number of encounters", () => {
    const top10Encounters = Array.from({ length: 5 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: [
          "Trauma",
          "Seizure",
          "Chest Pain",
          "Headache",
          "Nausea/Vomiting",
          "Other Pain",
          "Shortness of Breath",
          "Abdominal Pain",
          "Adverse Drug Effect",
          "Agitation",
        ],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "left-ama",
      })
    );
    const notTop10Encounters = Array.from({ length: 4 }, () =>
      generateFakePatientEncounter(1, {
        chief_complaints: ["Hallucinations"],
        triage_acuity: TriageAcuities.Red,
        departure_dest: "left-ama",
      })
    );

    const mockEncounters = [...top10Encounters, ...notTop10Encounters];

    const result = calculateCommonPresentationsAndTransports(mockEncounters);

    // Verify the counts
    expect(result.commonPresentationsDataRed.rows.length).toBe(10);

    // verify the totals
    expect(result.commonPresentationsDataRed.totals.totalCount).toBe(5);
    expect(result.commonPresentationsDataRed.totals.outOf).toBe(9);
  });
});

describe("calculateAcuityCountsData", () => {
  it("correctly calculates acuity counts", () => {});

  const patientEncounters: PatientEncounterRow[] = [
    generateFakePatientEncounter(1, {
      triage_acuity: TriageAcuities.Red,
    }),
    generateFakePatientEncounter(1, {
      triage_acuity: TriageAcuities.Yellow,
    }),
    generateFakePatientEncounter(1, {
      triage_acuity: TriageAcuities.Green,
    }),
    generateFakePatientEncounter(1, {
      triage_acuity: TriageAcuities.White,
    }),
  ];

  const result = calculateAcuityCountsData(patientEncounters).sort((a, b) =>
    a.acuity.localeCompare(b.acuity)
  );

  const expected = [
    { acuity: "red", encounters: 1 },
    { acuity: "yellow", encounters: 1 },
    { acuity: "green", encounters: 1 },
    { acuity: "white", encounters: 1 },
  ].sort((a, b) => a.acuity.localeCompare(b.acuity));

  expect(result).toEqual(expected);
});

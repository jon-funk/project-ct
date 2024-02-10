import { calculateChiefComplaintEncounterCountsData } from "../../utils/postfestivalDashboard";
import { PatientEncounterRow } from "../../interfaces/PatientEncounterRow";
import { generateFakePatientEncounter } from "../__fixtures__/patientEncounters";

describe("calculateChiefComplaintEncounterCountsData", () => {
  it("correctly calculates encounter counts for varying numbers of chief complaints", () => {
    const patientEncounters: PatientEncounterRow[] = [
      generateFakePatientEncounter(1), // 1 complaint
      generateFakePatientEncounter(2), // 2 complaints
      generateFakePatientEncounter(3), // 3 complaints
      generateFakePatientEncounter(4), // 4 complaints
    ].map((encounter) => ({
      ...encounter,
      patient_encounter_uuid: "",
      patient_rfid: "",
      document_num: "",
      location: "",
      handover_from: "",
      arrival_date: new Date(),
      arrival_time: new Date(),
      triage_acuity: "",
      age: 0,
      gender: "",
      on_shift: "",
      chief_complaint_other: "",
      arrival_method: "",
      handover_too: "",
      departure_time: new Date(),
      departure_date: new Date(),
      departure_dest: "",
      comment: "",
      qr_code: null,
    }));

    const expectedResult = [1, 1, 1, 1];

    const result =
      calculateChiefComplaintEncounterCountsData(patientEncounters);

    expect(result).toEqual(expectedResult);
  });
});

import { chiefComplaints, TriageAcuities } from "../../constants/medicalForm";
import { PatientEncounterRow } from "../../interfaces/PatientEncounterRow";
import { faker } from "@faker-js/faker";

export function generateFakePatientEncounter(
  numberOfChiefComplaints: number = 1,
  overrides?: Partial<PatientEncounterRow>
): PatientEncounterRow {
  const patient_encounter_uuid = faker.string.uuid();
  const patient_rfid = faker.string.uuid();
  const qr_code = faker.string.uuid();
  const document_num = faker.number.int().toString();
  const location = "Main Medical";
  const handover_from = faker.person.fullName();
  const arrival_date = faker.date.recent();
  const arrival_time = faker.date.recent();
  const arrival_method = faker.helpers.arrayElement([
    "self-presented",
    "med-transport",
    "security",
    "harm-reduction",
    "other",
  ]);
  const triage_acuity =
    Object.values(TriageAcuities)[
      faker.number.int(Object.values(TriageAcuities).length)
    ];
  const age = faker.number.int();
  const gender = faker.helpers.arrayElement(["male", "female", "other"]);
  const on_shift = faker.datatype.boolean().toString();
  const chief_complaints = Array.from({ length: numberOfChiefComplaints }, () =>
    faker.helpers.arrayElement(chiefComplaints)
  );
  const chief_complaint_other = chief_complaints.includes("Other:")
    ? faker.lorem.sentence()
    : "";

  // May or may not have departure_time and departure_date
  const departure_datetime = faker.datatype.boolean();

  let departure_time = faker.date.recent();
  let departure_date = faker.date.recent();
  let departure_dest = "";

  if (departure_datetime) {
    departure_time = faker.date.recent();
    departure_date = faker.date.recent();
  }

  if (departure_datetime) {
    departure_dest = faker.helpers.arrayElement([
      "back-to-festival",
      "left-ama",
      "return-to-event",
      "security",
      "hospital-private",
      "hospital-ambulance",
      "other",
    ]);
  }

  // if departure_dest is "security", "hospital-private", or "hospital-ambulance", then handover_too is required
  const handover_too =
    departure_dest === "security" ||
    departure_dest === "hospital-private" ||
    departure_dest === "hospital-ambulance"
      ? faker.person.fullName()
      : "";

  // if departure_dest is "other", then comment is required
  const comment = departure_dest === "other" ? faker.lorem.sentence() : "";

  const patientEncounter: PatientEncounterRow = {
    patient_encounter_uuid,
    patient_rfid,
    qr_code,
    document_num,
    location,
    handover_from,
    arrival_date,
    arrival_time,
    arrival_method,
    triage_acuity,
    age,
    gender,
    on_shift,
    chief_complaints,
    chief_complaint_other,
    departure_time: departure_time,
    departure_date: departure_date,
    departure_dest,
    handover_too,
    comment,
    ...overrides,
  };

  return patientEncounter;
}

import { PatientEncounterFormDataInterface } from "../interfaces/PatientEncounterFormDataInterface";

export const MFPEFormData: PatientEncounterFormDataInterface = {
  patient_encounter_uuid: "",
  patient_rfid: "",
  document_num: "",
  qr_code: "",
  location: "Main Medical",
  handover_from: "",
  arrival_date: new Date(),
  arrival_time: new Date(),
  triage_acuity: "",
  age: 0,
  gender: "",
  on_shift: "",
  chief_complaints: [],
  chief_complaint_other: "",
  arrival_method: "",
  handover_too: "",
  departure_time: new Date(),
  departure_date: new Date(),
  departure_dest: "",
  comment: "",
};

export const chiefComplaints = [
  "Abdominal Pain",
  "Adverse Drug Effect",
  "Agitation",
  "Allergic Reaction",
  "Anxiety",
  "Bizarre Behaviour",
  "Chest Pain",
  "Dizziness/Presyncope/Lightheaded",
  "Hallucinations",
  "Headache",
  "Loss of Consciousness",
  "Nausea/Vomiting",
  "Other",
  "Other Pain",
  "Seizure",
  "Shortness of Breath",
  "Trauma",
];

export const TriageAcuities = {
  Red: "red",
  Yellow: "yellow",
  Green: "green",
  White: "white",
} as const;

export const ValidTriageAcuities = ["red", "yellow", "green", "white"] as const;

export type TriageAcuity = (typeof TriageAcuities)[keyof typeof TriageAcuities];

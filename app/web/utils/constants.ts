import { PatientEncounterFormDataInterface } from "../interfaces/PatientEncounterFormDataInterface";
import { IntakeFormDataInterface } from "../interfaces/IntakeFormDataInterface";

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

export const IntakeFormDataDefaults: IntakeFormDataInterface = {
  intake_uuid: "",
  guest_rfid: "",
  arrival_date: new Date(),
  arrival_time: new Date(),
  arrival_method: "",
  identified_gender: "",
  first_visit: false,
  presenting_complaint: "",
  guest_consciousness_level: [],
  guest_emotional_state: [],
  guest_emotional_state_other: "",
  substance_categories: [],
  substance_categories_other: "",
  time_since_last_dose: 0,
  departure_time: new Date(),
  departure_date: new Date(),
  departure_dest: "",
  departure_dest_other: "",
};

export const GuestConsciousnessLevelsOptions = [
  "Alert/Awake",
  "Improving with time",
  "Drowsy but responds to verbal commands",
  "Unconscious",
  "Lethargic (difficult to awaken)",
  "Worsening with time",
];

export const IntakeArrivalMethodOptions = [
  "Self",
  "Friends",
  "Outreach",
  "Security",
  "Transfer from Medical",
  "Other",
];

export const IntakeEmotionalStateOptions = [
  "Happy",
  "Sad",
  "Cooperative",
  "Irritable",
  "Confused",
  "Disoriented",
  "Agitated",
  "Overwhelmed",
  "Paranoid",
  "Suspicious",
  "Angry",
  "Tearful",
  "Scared",
  "Hostile",
  "Withdrawn",
  "Actively hallucinating",
  "Making physical/verbal threats",
  "Expressing suicidal thoughts",
  "Other: Describe",
];

export const IntakeSubstanceCategoryOptions = [
  "MDMA (Molly)",
  "Amphetamine (prescription as well)",
  "Cocaine",
  "Ketamine",
  "Mushrooms",
  "Alcohol",
  "LSD/Acid",
  "Cannabis",
  "GHB",
  "Benzo",
  "Opioids",
  "Sleep aids",
  "AntiHistamines",
  "DMT",
  "2CB",
  "Other: Please describe substance",
];

export const IntakeDepartureDestOptions = [
  "Returned to event escorted by friends/relatives (cleared)",
  "Escorted by Outreach",
  "Returned to event on their own (cleared)",
  "Transferred to Main Medical",
  "Escorted out by Security/Police",
  "Left event to go home via: Please describe below",
];

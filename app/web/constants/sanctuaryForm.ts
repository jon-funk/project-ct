import { IntakeFormDataInterface } from "../interfaces/IntakeFormDataInterface";

export const IntakeFormDataDefaults: IntakeFormDataInterface = {
  intake_uuid: "",
  guest_rfid: "",
  arrival_date: new Date(),
  arrival_time: new Date(),
  arrival_method: "",
  identified_gender: "",
  first_visit: false,
  presenting_complaint: "",
  guest_consciousness_level: "",
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

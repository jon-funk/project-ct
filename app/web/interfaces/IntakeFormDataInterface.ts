export interface IntakeFormDataInterface {
  intake_uuid: string;
  guest_rfid: string;
  document_num: string;
  arrival_date: Date;
  arrival_time: Date;
  arrival_method: string;
  identified_gender: string;
  first_visit: boolean;
  presenting_complaint: string;
  guest_consciousness_level: string;
  guest_emotional_state: string[];
  guest_emotional_state_other?: string;
  substance_categories: string[];
  substance_categories_other?: string;
  time_since_last_dose: number;
  departure_time: Date;
  departure_date: Date;
  departure_dest: string;
  departure_dest_other?: string;
  comment: string;
}

export interface APIIntakeFormData {
  guest_rfid: string;
  document_num: string;
  arrival_date: string;
  arrival_time: string;
  arrival_method: string;
  identified_gender: string;
  first_visit: boolean;
  presenting_complaint: string;
  guest_consciousness_level: string;
  guest_emotional_state: string;
  substance_categories: string;
  time_since_last_dose: number;
  discharge_date: string;
  discharge_time: string;
  discharge_method: string;
  intake_uuid: string;
  comment: string;
}

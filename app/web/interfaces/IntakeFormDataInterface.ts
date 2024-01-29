export interface IntakeFormDataInterface {
  intake_uuid: string;
  guest_rfid: string;
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
  departure_dest_other: string;
}

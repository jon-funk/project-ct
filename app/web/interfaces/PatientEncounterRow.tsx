export interface PatientEncounterRow {
    patient_encounter_uuid: string;
    patient_rfid: string;
    document_num: string;
    location: string;
    handover_from: string;
    arrival_date: Date;
    arrival_time: Date;
    triage_acuity: string;
    age: number;
    gender: string;
    on_shift: string;
    chief_complaints: string[];
    chief_complaint_other?: string;
    arrival_method: string;
    handover_too: string;
    departure_time: Date;
    departure_date: Date;
    departure_dest: string;
    comment: string;
    qr_code: string | null;
}

import { Control, FieldErrors } from "react-hook-form";
import { PatientEncounterFormDataInterface } from "./PatientEncounterFormDataInterface";

export interface PatientEncounterFormFieldsProps {
  control: Control<PatientEncounterFormDataInterface>;
  errors: FieldErrors<PatientEncounterFormDataInterface>;
  enableOtherChiefComplaint: boolean;
}

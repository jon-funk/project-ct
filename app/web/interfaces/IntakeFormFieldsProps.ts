import { Control, FieldErrors } from "react-hook-form";
import { IntakeFormDataInterface } from "./IntakeFormDataInterface";

export interface IntakeFormFieldsProps {
  control: Control<IntakeFormDataInterface>;
  errors: FieldErrors<IntakeFormDataInterface>;
  enableOtherEmotionalState: boolean;
  enableOtherSubstanceCategory: boolean;
  enableDepartureNotes: boolean;
}

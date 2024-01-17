import { Control, FieldErrors, FieldValues } from "react-hook-form";

export interface FormFieldProps<T extends FieldValues> {
  control: Control<T>;
  errors: FieldErrors<T>;
  enableField?: boolean;
}

import { Control, FieldErrors } from "react-hook-form";

export interface FormFieldProps {
    control: Control;
    errors: FieldErrors;
    enableField?: boolean;
}
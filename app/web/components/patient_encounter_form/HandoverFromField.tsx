import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders a handover from field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns HandoverFromField component.
 */
export function HandoverFromField({ control, errors }: FormFieldProps) {
  return (
    <FormControl>
      <Controller
        name="handover_from"
        control={control}
        render={({ field }) => (
          <TextField
            label="Handover From"
            helperText="Please specify who the patient was handed over from."
            variant="outlined"
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

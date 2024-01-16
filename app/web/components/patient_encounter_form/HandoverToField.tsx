import React from "react";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";


/**
 * Renders a handover to field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns HandoverToField component.
 */
export function HandoverToField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {
  return (
    <FormControl error={Boolean(errors?.handover_too)}>
      <Controller
        name="handover_too"
        control={control}
        render={({ field }) => (
          <TextField
            label="Handover To"
            helperText="Patient is going with..."
            variant="outlined"
            {...field}
          />
        )}
      />
      {errors.handover_too && (
        <FormHelperText error>{String(errors.handover_too?.message)}</FormHelperText>
      )}
    </FormControl>
  );
}

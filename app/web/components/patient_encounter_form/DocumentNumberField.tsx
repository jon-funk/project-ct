import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";


/**
 * Renders a document number input field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns DocumentNumberField component.
 */
export function DocumentNumberField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {
  return (
    <FormControl>
      <Controller
        name="document_num"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Document Number"
            variant="outlined"
            placeholder="1234"
            helperText="eg. 1000"
            error={Boolean(errors?.document_num)}
          />
        )}
      />
    </FormControl>
  );
}

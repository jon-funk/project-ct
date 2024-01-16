import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders the field for entering the patient's RFID.
 *
 * @param props FormField component props.
 *
 * @returns PatientRFIDField component.
 */

export function PatientRFIDField({ control }: FormFieldProps) {
  return (
    <FormControl>
      <Controller
        name="patient_rfid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Patient RFID"
            placeholder="04:FD:3E:2B:4F:5C:80"
            variant="outlined"
            helperText="Wristband RFID"
          />
        )}
      />
    </FormControl>
  );
}

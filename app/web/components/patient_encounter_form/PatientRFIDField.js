import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function PatientRFIDField(control, errors) {
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

import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function HandoverFromField(control, errors) {
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

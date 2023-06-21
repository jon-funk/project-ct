import React from "react";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function HandoverToField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.handover_too)}>
      <Controller
        name="handover_too"
        control={control}
        rules={{ required: "Please enter who patient is handed over to." }}
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
        <FormHelperText error>{errors.handover_too.message}</FormHelperText>
      )}
    </FormControl>
  );
}

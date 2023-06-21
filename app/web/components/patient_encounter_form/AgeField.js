import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function AgeField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <TextField
            type="number"
            label="Age"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            error={Boolean(errors?.age)}
          />
        )}
      />
    </FormControl>
  );
}

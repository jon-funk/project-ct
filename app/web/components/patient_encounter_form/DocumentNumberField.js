import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

export function DocumentNumberField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="document_num"
        control={control}
        rules={{ required: "Document number is required" }}
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

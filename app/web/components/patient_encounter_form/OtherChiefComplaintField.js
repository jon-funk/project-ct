import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function OtherChiefComplaintField(control, errors, disabled) {
  return (
    <FormControl error={Boolean(errors?.chief_complaint_other)}>
      <FormLabel> </FormLabel>
      <Controller
        name="chief_complaint_other"
        control={control}
        rules={{
          required: !disabled ? false : "Other chief complaint is required.",
        }}
        render={({ field }) => (
          <TextField
            type="text"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            label="Other chief complaint"
            disabled={!disabled}
            error={Boolean(errors?.chief_complaint_other)}
          />
        )}
      />
      {errors.chief_complaint_other && (
        <FormHelperText error>
          {errors.chief_complaint_other.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

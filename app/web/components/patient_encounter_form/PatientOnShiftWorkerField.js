import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function PatientOnShiftWorkerField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.on_shift)}>
      <Box component="fieldset">
        <FormLabel component="legend">
          Is the patient a worker who is on shift?
        </FormLabel>
        <Controller
          name="on_shift"
          control={control}
          rules={{ required: "Is patient an on-shift worker is required." }}
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="patient-Occupation"
              row
              {...field}
              error={Boolean(errors?.on_shift)}
            >
              <FormControlLabel
                value="Yes"
                control={<Radio required={true} />}
                label="Yes"
              />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          )}
        />
        {errors.on_shift && (
          <FormHelperText error>{errors.on_shift.message}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
}

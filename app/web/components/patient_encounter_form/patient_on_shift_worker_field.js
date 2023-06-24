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

/**
 * Renders the field for indicating if the patient is a worker on shift.
 *
 * @param {object} control - The control object from react-hook-form.
 * @param {object} errors - The form errors object.
 *
 * @returns {JSX.Element} - PatientOnShiftWorkerField component.
 */

export function PatientOnShiftWorkerField(control, errors) {
  const hasError = Boolean(errors?.arrival_method);
  return (
    <FormControl error={Boolean(errors?.on_shift)}>
      <Box
        component="fieldset"
        sx={{ borderColor: hasError ? "error.main" : "grey.100" }}
      >
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

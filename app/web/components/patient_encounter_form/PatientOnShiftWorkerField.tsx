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
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders the field for indicating if the patient is a worker on shift.
 *
 * @param props FormField component props.
 *
 * @returns PatientOnShiftWorkerField component.
 */

export function PatientOnShiftWorkerField({ control, errors }: FormFieldProps) {
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
          <FormHelperText error>{String(errors.on_shift?.message)}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
}

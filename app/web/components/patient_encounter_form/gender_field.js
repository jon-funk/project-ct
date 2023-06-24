import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a gender selection field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - GenderField component.
 */
export function GenderField(control, errors) {
  const hasError = Boolean(errors?.arrival_method);
  return (
    <FormControl>
      <Box
        component="fieldset"
        sx={{ borderColor: hasError ? "error.main" : "grey.100" }}
      >
        <FormLabel component="legend">Gender</FormLabel>
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="gender"
              row
              value={field.value}
              onChange={field.onChange}
              error={Boolean(errors?.gender)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

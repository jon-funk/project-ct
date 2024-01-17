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
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";


/**
 * Renders a gender selection field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns GenderField component.
 */
export function GenderField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {
  const hasError = Boolean(errors?.gender);
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

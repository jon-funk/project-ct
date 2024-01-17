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
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";


/**
 * Renders the field for selecting the triage acuity.
 *
 * @param props FormField component props.
 *
 * @returns TriageAcuityField component.
 */

export function TriageAcuityField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {
  const hasError = Boolean(errors?.arrival_method);
  return (
    <FormControl error={Boolean(errors?.triage_acuity)}>
      <Box
        component="fieldset"
        sx={{ borderColor: hasError ? "error.main" : "grey.100" }}
      >
        <FormLabel component="legend">Triage Acuity</FormLabel>
        <Controller
          name="triage_acuity"
          control={control}
          rules={{
            required: "Please select triage acuity.",
          }}
          render={({ field }) => (
            <Box>
              <RadioGroup
                aria-labelledby="triage_acuity"
                row
                value={field.value}
                onChange={field.onChange}
              >
                <FormControlLabel
                  value="white"
                  control={<Radio />}
                  label="White"
                />
                <FormControlLabel
                  value="green"
                  control={<Radio />}
                  label="Green"
                />
                <FormControlLabel
                  value="yellow"
                  control={<Radio />}
                  label="Yellow"
                />
                <FormControlLabel value="red" control={<Radio />} label="Red" />
              </RadioGroup>
              {errors.triage_acuity && (
                <FormHelperText>{String(errors.triage_acuity?.message)}</FormHelperText>
              )}
            </Box>
          )}
        />
      </Box>
    </FormControl>
  );
}

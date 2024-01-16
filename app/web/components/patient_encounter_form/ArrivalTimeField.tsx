import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";

/**
 * Renders an arrival time input field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns ArrivalTimeField component.
 */
export function ArrivalTimeField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Time</FormLabel>
        <Controller
          name="arrival_time"
          control={control}
          rules={{ required: "Arrival time is required" }}
          render={({ field: { onChange, value } }) => (
            <TimePicker
              ampm={false}
              value={value}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={true}
                  error={Boolean(errors?.arrival_time)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

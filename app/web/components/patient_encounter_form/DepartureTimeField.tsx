import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";

/**
 * Renders a departure time selection field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns DepartureTimeField component.
 */
export function DepartureTimeField({ control, errors }: FormFieldProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={Boolean(errors?.departure_time)}>
        <FormLabel>Departure Time</FormLabel>
        <Controller
          name="departure_time"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TimePicker
              ampm={false}
              value={value}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={Boolean(errors?.departure_time)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

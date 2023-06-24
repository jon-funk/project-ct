import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

/**
 * Renders a departure date input field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - DepartureDateField component.
 */
export function DepartureDateField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={Boolean(errors?.departure_date)}>
        <FormLabel>Departure Date</FormLabel>
        <Controller
          name="departure_date"
          control={control}
          rules={{ required: "A departure date is required." }}
          render={({ field }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              {...field}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={true}
                  error={Boolean(errors?.departure_date)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

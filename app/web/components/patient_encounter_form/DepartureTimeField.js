import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

export function DepartureTimeField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl error={Boolean(errors?.departure_time)}>
        <FormLabel>Departure Time</FormLabel>
        <Controller
          name="departure_time"
          control={control}
          rules={{ required: "A departure time is required." }}
          render={({ field }) => (
            <TimePicker
              ampm={false}
              {...field}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

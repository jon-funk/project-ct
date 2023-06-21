import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

export function DepartureTimeField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Time</FormLabel>
        <Controller
          name="departure_time"
          control={control}
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

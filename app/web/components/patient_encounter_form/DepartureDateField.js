import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

export function DepartureDateField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Date</FormLabel>
        <Controller
          name="departure_date"
          control={control}
          render={({ field }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              {...field}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

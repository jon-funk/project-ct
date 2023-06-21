import React from "react";
import { FormControl, FormLabel, TextField } from "@mui/material";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller } from "react-hook-form";

export function ArrivalDateField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Date</FormLabel>
        <Controller
          name="arrival_date"
          control={control}
          rules={{ required: "Arrival date is required" }}
          render={({ field: { onChange, value } }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={onChange}
              error={Boolean(errors?.arrival_date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={true}
                  error={Boolean(errors?.arrival_date)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

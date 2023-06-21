import React from "react";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";

export function LocationField(control, errors) {
  return (
    <FormControl>
      <FormLabel id="location-select-label">Location</FormLabel>
      <Controller
        name="location"
        control={control}
        rules={{ required: "Location is required" }}
        render={({ field }) => (
          <Select
            {...field}
            labelId="location-select-label"
            label="Location"
            defaultValue="Main Medical"
            disabled
          >
            <MenuItem value="Main Medical" required={true}>
              Main Medical
            </MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
}

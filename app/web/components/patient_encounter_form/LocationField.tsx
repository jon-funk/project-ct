import React from "react";
import { FormControl, FormLabel, MenuItem, Select } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders a location field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns {JSX.Element} - LocationField component.
 */

export function LocationField({ control, errors }: FormFieldProps) {
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
          >
            <MenuItem value="Main Medical">Main Medical</MenuItem>
            <MenuItem value="Harm Reduction">Harm Reduction</MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
}

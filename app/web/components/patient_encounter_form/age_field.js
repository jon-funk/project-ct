import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders an age input field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - AgeField component.
 */
export function AgeField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <TextField
            type="number"
            label="Age"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            error={Boolean(errors?.age)}
            inputProps={{ min: 0 }}
          />
        )}
      />
    </FormControl>
  );
}

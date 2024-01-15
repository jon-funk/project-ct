import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders an age input field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns AgeField component.
 */
export function AgeField({ control, errors }: FormFieldProps) {
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

import React from "react";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a handover to field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - HandoverToField component.
 */
export function HandoverToField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.handover_too)}>
      <Controller
        name="handover_too"
        control={control}
        render={({ field }) => (
          <TextField
            label="Handover To"
            helperText="Patient is going with..."
            variant="outlined"
            {...field}
          />
        )}
      />
      {errors.handover_too && (
        <FormHelperText error>{errors.handover_too.message}</FormHelperText>
      )}
    </FormControl>
  );
}

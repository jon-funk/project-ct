import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a handover from field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - HandoverFromField component.
 */
export function HandoverFromField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="handover_from"
        control={control}
        render={({ field }) => (
          <TextField
            label="Handover From"
            helperText="Please specify who the patient was handed over from."
            variant="outlined"
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

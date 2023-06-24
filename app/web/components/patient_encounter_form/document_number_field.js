import React from "react";
import { FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a document number input field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - DocumentNumberField component.
 */
export function DocumentNumberField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="document_num"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Document Number"
            variant="outlined"
            placeholder="1234"
            helperText="eg. 1000"
            error={Boolean(errors?.document_num)}
          />
        )}
      />
    </FormControl>
  );
}

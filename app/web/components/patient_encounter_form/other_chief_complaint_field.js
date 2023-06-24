import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a field for entering the "Other" chief complaint in the Music Festival Patient Encounter form.
 *
 * @param {object} control - The control object from react-hook-form.
 * @param {object} errors - The form errors object.
 * @param {boolean} disabled - Indicates if the field should be disabled.
 *
 * @returns {JSX.Element} - OtherChiefComplaintField component.
 */

export function OtherChiefComplaintField(control, errors, disabled) {
  return (
    <FormControl error={Boolean(errors?.chief_complaint_other)} fullWidth>
      <Controller
        name="chief_complaint_other"
        control={control}
        rules={{
          required: !disabled ? false : "Other chief complaint is required.",
        }}
        render={({ field }) => (
          <TextField
            type="text"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            label="Other chief complaint"
            disabled={!disabled}
            error={Boolean(errors?.chief_complaint_other)}
          />
        )}
      />
      {errors.chief_complaint_other && (
        <FormHelperText error>
          {errors.chief_complaint_other.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

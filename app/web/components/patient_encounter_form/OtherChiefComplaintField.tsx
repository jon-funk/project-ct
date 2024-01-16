import React from "react";
import {
  FormControl,
  FormHelperText,
  FormLabel,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * Renders a field for entering the "Other" chief complaint in the Music Festival Patient Encounter form.
 *
 * @param props FormField component props.
 *
 * @returns OtherChiefComplaintField component.
 */

export function OtherChiefComplaintField({ control, errors, enableField }: FormFieldProps) {
  return (
    <FormControl error={Boolean(errors?.chief_complaint_other)} fullWidth>
      <Controller
        name="chief_complaint_other"
        control={control}
        rules={{
          required: !enableField ? false : "Other chief complaint is required.",
        }}
        render={({ field }) => (
          <TextField
            type="text"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            label="Other chief complaint"
            disabled={!enableField}
            error={Boolean(errors?.chief_complaint_other)}
          />
        )}
      />
      {errors.chief_complaint_other && (
        <FormHelperText error>
          {errors.chief_complaint_other && (
            <FormHelperText error>
              {String(errors.chief_complaint_other?.message)}
            </FormHelperText>
          )}
        </FormHelperText>
      )}
    </FormControl>
  );
}

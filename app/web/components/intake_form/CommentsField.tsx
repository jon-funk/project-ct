import React from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";


/**
 * Renders a comments input field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns CommentsField component.
 */
export function CommentsField({ control }: FormFieldProps<IntakeFormDataInterface>) {
  return (
    <Box>
      <FormControl fullWidth>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter additional comments here"
              variant="outlined"
              label="Comments"
              multiline={true}
              rows={3}
              {...field}
            />
          )}
        />
      </FormControl>
    </Box>
  );
}

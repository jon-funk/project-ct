import React from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

/**
 * Renders a comments input field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - CommentsField component.
 */
export function CommentsField(control, errors) {
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

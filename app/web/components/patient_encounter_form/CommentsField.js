import React from "react";
import { Box, FormControl, TextField } from "@mui/material";
import { Controller } from "react-hook-form";

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

import React from "react";
import {
  Box,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { Controller } from "react-hook-form";

export function GenderField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset" sx={{ borderColor: "grey.100" }}>
        <FormLabel component="legend">Gender</FormLabel>
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="gender"
              row
              value={field.value}
              onChange={field.onChange}
              error={Boolean(errors?.gender)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

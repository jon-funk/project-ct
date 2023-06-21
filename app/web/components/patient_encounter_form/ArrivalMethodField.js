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

export function ArrivalMethodField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset">
        <FormLabel component="legend">Arrival Method</FormLabel>
        <Controller
          name="arrival_method"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-labelledby="arrival-method"
              row
              value={field.value}
              onChange={field.onChange}
            >
              <FormControlLabel
                value="self-presented"
                control={<Radio required={true} />}
                label="Self Presented"
              />
              <FormControlLabel
                value="med-transport"
                control={<Radio />}
                label="Medical Transport"
              />
              <FormControlLabel
                value="security"
                control={<Radio />}
                label="Brought by Security"
              />
              <FormControlLabel
                value="harm-reduction"
                control={<Radio />}
                label="Brought by Harm Reduction"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other (Please explain in the comment section)"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

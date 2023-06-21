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

export function DepartureDestinationField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset">
        <FormLabel component="legend">Departure Destination</FormLabel>
        <Controller
          name="departure_dest"
          control={control}
          render={({ field }) => (
            <RadioGroup aria-labelledby="departure-destination" row {...field}>
              <FormControlLabel
                value="back-to-festival"
                control={<Radio />}
                label="Back to Festival"
              />
              <FormControlLabel value="lwbs" control={<Radio />} label="LWBS" />
              <FormControlLabel
                value="left-ama"
                control={<Radio />}
                label="Left AMA"
              />
              <FormControlLabel
                value="return-to-event"
                control={<Radio />}
                label="Sanctuary"
              />
              <FormControlLabel
                value="security"
                control={<Radio />}
                label="Security"
              />
              <FormControlLabel
                value="hospital-private"
                control={<Radio />}
                label="Hospital by private car"
              />
              <FormControlLabel
                value="hostpital-ambulance"
                control={<Radio />}
                label="Hospital by ambulance"
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

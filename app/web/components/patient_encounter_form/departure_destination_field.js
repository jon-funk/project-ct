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

/**
 * Renders a departure destination selection field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - DepartureDestinationField component.
 */
export function DepartureDestinationField(control, errors) {
  const hasError = Boolean(errors?.arrival_method);
  return (
    <FormControl error={Boolean(errors?.departure_dest)}>
      <Box
        component="fieldset"
        sx={{ borderColor: hasError ? "error.main" : "grey.100" }}
      >
        <FormLabel component="legend">Departure Destination</FormLabel>
        <Controller
          name="departure_dest"
          control={control}
          rules={{ required: "A departure destination is required." }}
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

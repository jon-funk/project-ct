import React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItemText,
  MenuItem,
  MenuProps,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { chiefComplaints } from "../../utils/constants";

/**
 * Renders a chief complaint select field controlled by React Hook Form.
 *
 * @param {object} control - React Hook Form control object.
 * @param {object} errors - Object containing form errors.
 *
 * @returns {JSX.Element} - ChiefComplaintField component.
 */
export function ChiefComplaintField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.chief_complaints)} fullWidth>
      <FormLabel>Chief Complaint</FormLabel>
      <Controller
        name="chief_complaints"
        control={control}
        rules={{
          required: "A chief complaint is required.",
        }}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth={true}
            multiple={true}
            label="Select Complaint(s)"
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {chiefComplaints.map((complaint) => (
              <MenuItem key={complaint} value={complaint}>
                <Checkbox checked={field.value.indexOf(complaint) > -1} />
                <ListItemText primary={complaint} />
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors.chief_complaints && (
        <FormHelperText error>{errors.chief_complaints.message}</FormHelperText>
      )}
    </FormControl>
  );
}

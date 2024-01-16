import React from "react";
import {
  Checkbox,
  FormControl,
  FormHelperText,
  FormLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { chiefComplaints } from "../../utils/constants";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";

/**
 * Renders a chief complaint select field controlled by React Hook Form.
 *
 * @param props FormField component props.
 *
 * @returns ChiefComplaintField component.
 */
export function ChiefComplaintField({ control, errors }: FormFieldProps<PatientEncounterFormDataInterface>) {

  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: 300,
        width: 250,
      },
    },
  };

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
        <FormHelperText error>{String(errors.chief_complaints?.message)}</FormHelperText>
      )}
    </FormControl>
  );
}

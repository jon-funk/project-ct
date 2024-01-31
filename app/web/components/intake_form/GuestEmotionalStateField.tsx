import React from "react";
import {
    FormControl, FormLabel,
    Checkbox, Select,
    MenuItem, OutlinedInput,
    ListItemText,
    FormHelperText
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { IntakeEmotionalStateOptions } from "../../constants/sanctuaryForm";
import { MenuProps } from "../../pages/sanctuary/form";


/**
 * Guest emotional state field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns GuestEmotionalStateField component.
 */
export function GuestEmotionalStateField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <FormLabel>Guest Presentation, Emotional State</FormLabel>
        <Controller
            name="guest_emotional_state"
            control={control}
            rules={{
                required: "Guest emotional state is required",
            }}
            render={({ field }) => (
                <Select
                    {...field}
                    fullWidth={true}
                    multiple={true}
                    label="Select Emotional State(s)"
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {IntakeEmotionalStateOptions.map((emotion) => (
                        <MenuItem key={emotion} value={emotion}>
                            <Checkbox checked={field.value.indexOf(emotion) > -1} />
                            <ListItemText primary={emotion} />
                        </MenuItem>
                    ))}
                </Select>
            )} />
        {errors.guest_emotional_state && (
            <FormHelperText error>{String(errors.guest_emotional_state?.message)}</FormHelperText>
        )}
    </FormControl>;
}

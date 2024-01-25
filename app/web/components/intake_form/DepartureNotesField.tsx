import React from "react";
import { FormControl, TextField } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Departure Notes field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns DepartureNotesField component.
 */
export function DepartureNotesField({ control, errors, enableField }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <Controller
            name="departure_dest_other"
            control={control}
            rules={{ required: enableField ? "Departure notes are required" : false }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Departure Notes"
                    placeholder="Enter notes"
                    variant="outlined"
                    disabled={!enableField}
                    helperText={errors?.departure_dest_other?.message?.toString()}
                    error={Boolean(errors?.departure_dest_other)}
                    fullWidth={true} />
            )} />
    </FormControl>;
}

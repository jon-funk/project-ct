import React from "react";
import { FormControl, TextField } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Presenting Complaint field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns PresentingComplaintField component.
 */
export function PresentingComplaintField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <Controller
            name="presenting_complaint"
            control={control}
            rules={{ required: "Presenting complaint is required" }}
            render={({ field }) => (
                <TextField
                    {...field}
                    label="Presenting Complaint"
                    placeholder="Enter complaint"
                    variant="outlined"
                    helperText={errors?.presenting_complaint?.message?.toString()}
                    error={Boolean(errors?.presenting_complaint)}
                    multiline={true}
                    rows={2}
                    fullWidth={true} />
            )} />
    </FormControl>;
}

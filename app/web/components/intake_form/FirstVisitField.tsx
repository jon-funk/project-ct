import React from "react";
import {
    FormControl, Checkbox,
    FormControlLabel
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * First visit field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns FirstVisitField component.
 */
export function FirstVisitField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <Controller
            name="first_visit"
            control={control}
            render={({ field }) => (
                <FormControlLabel
                    control={<Checkbox
                        {...field}
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)} />}
                    label="First visit to Sanctuary?" />
            )} />
    </FormControl>;
}

import React from "react";
import { FormControl, TextField, FormHelperText } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Substance Categories Other field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns SubstanceCategoriesOtherField component.
 */
export function SubstanceCategoriesOtherField({ control, errors, enableField }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <Controller
            name="substance_categories_other"
            control={control}
            rules={{
                required: enableField ? "Other substance category is required" : false,
            }}
            render={({ field }) => (
                <TextField
                    type="text"
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    label="Other substance category"
                    disabled={!enableField}
                    error={Boolean(errors?.substance_categories_other)}
                    fullWidth={true} />
            )} />
        {errors.substance_categories_other && (
            <FormHelperText error>
                {errors.substance_categories_other && (
                    <FormHelperText error>
                        {String(errors.substance_categories_other?.message)}
                    </FormHelperText>
                )}
            </FormHelperText>
        )}
    </FormControl>;
}

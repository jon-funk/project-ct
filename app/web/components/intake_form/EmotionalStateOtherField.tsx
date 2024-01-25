import React from "react";
import { FormControl, TextField, FormHelperText } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Emotional State Other field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns EmotionalStateOtherField component.
 */
export function EmotionalStateOtherField({ control, errors, enableField }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <Controller
            name="guest_emotional_state_other"
            control={control}
            rules={{
                required: enableField ? "Other emotional state is required" : false,
            }}
            render={({ field }) => (
                <TextField
                    type="text"
                    variant="outlined"
                    value={field.value}
                    onChange={field.onChange}
                    label="Other emotional state"
                    disabled={!enableField}
                    error={Boolean(errors?.guest_emotional_state_other)}
                    fullWidth={true} />
            )} />
        {errors.guest_emotional_state_other && (
            <FormHelperText error>
                {errors.guest_emotional_state_other && (
                    <FormHelperText error>
                        {String(errors.guest_emotional_state_other?.message)}
                    </FormHelperText>
                )}
            </FormHelperText>
        )}
    </FormControl>;
}

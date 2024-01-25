import React from "react";
import {
    FormControl, FormLabel, FormControlLabel, Box,
    RadioGroup,
    Radio
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Identified Gender Field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns IdentifiedGenderField component.
 */
export function IdentifiedGenderField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <Box component="fieldset">
            <FormLabel component="legend">Identified Gender</FormLabel>
            <Controller
                name="identified_gender"
                control={control}
                defaultValue=""
                render={({ field }) => (
                    <RadioGroup
                        aria-labelledby="identified_gender"
                        row
                        value={field.value}
                        onChange={field.onChange}
                    >
                        <FormControlLabel value="male" control={<Radio />} label="Male" />
                        <FormControlLabel
                            value="female"
                            control={<Radio />}
                            label="Female" />
                        <FormControlLabel
                            value="trans"
                            control={<Radio />}
                            label="Trans" />
                        <FormControlLabel
                            value="other"
                            control={<Radio />}
                            label="Other" />
                    </RadioGroup>
                )} />
        </Box>
    </FormControl>;
}

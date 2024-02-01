import React from "react";
import {
    FormControl, FormLabel, FormControlLabel, Box,
    RadioGroup,
    Radio
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { IntakeArrivalMethodOptions } from "../../constants/sanctuaryForm";

/**
 * Arrival method field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns ArrivalMethodField component.
 */
export function ArrivalMethodField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <Box component="fieldset">
            <FormLabel component="legend">Arrival Method</FormLabel>
            <Controller
                name="arrival_method"
                control={control}
                defaultValue=""
                rules={{ required: "Arrival method is required" }}
                render={({ field }) => (
                    <RadioGroup
                        aria-label="arrival_method"
                        row
                        value={field.value}
                        onChange={field.onChange}
                    >
                        {IntakeArrivalMethodOptions.map((option) => (
                            <FormControlLabel
                                key={option}
                                value={option}
                                control={<Radio />}
                                label={option} />
                        ))}
                    </RadioGroup>
                )} />
        </Box>
    </FormControl>;
}

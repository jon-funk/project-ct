import React from "react";
import {
    FormControl, FormLabel,
    FormControlLabel,
    Box,
    RadioGroup,
    Radio
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { IntakeDepartureDestOptions } from "../../utils/constants";


/**
 * Departure destination field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns DepartureDestinationField component.
 */
export function DepartureDestinationField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <Box component="fieldset">
            <FormLabel component="legend">Departure Destination</FormLabel>
            <Controller
                name="departure_dest"
                control={control}
                defaultValue=""
                rules={{ required: "Departure destination is required" }}
                render={({ field }) => (
                    <RadioGroup
                        aria-label="departure_dest"
                        row
                        value={field.value}
                        onChange={field.onChange}
                    >
                        {IntakeDepartureDestOptions.map((option) => (
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

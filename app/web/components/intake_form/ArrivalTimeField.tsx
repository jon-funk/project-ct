import React from "react";
import {
    FormControl, TextField,
    FormLabel
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { FormFieldProps } from "../../interfaces/FormFieldProps";

/**
 * Arrival time field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns ArrivalTimeField component.
 */
export function ArrivalTimeField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormLabel>Arrival Time</FormLabel>
            <Controller
                name="arrival_time"
                control={control}
                rules={{ required: "Arrival time is required" }}
                render={({ field: { onChange, value } }) => (
                    <TimePicker
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={true}
                                error={Boolean(errors?.arrival_time)} />
                        )} />
                )} />
        </LocalizationProvider>
    </FormControl>;
}

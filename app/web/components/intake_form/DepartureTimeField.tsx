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
 * Departure time field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns DepartureTimeField component.
 */
export function DepartureTimeField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormLabel>Departure Time</FormLabel>
            <Controller
                name="departure_time"
                control={control}
                rules={{ required: "Departure time is required" }}
                render={({ field: { onChange, value } }) => (
                    <TimePicker
                        ampm={false}
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={true}
                                error={Boolean(errors?.departure_time)} />
                        )} />
                )} />
        </LocalizationProvider>
    </FormControl>;
}

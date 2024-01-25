import React from "react";
import {
    FormControl, TextField,
    FormLabel
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Departure Date field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns DepartureDateField component.
 */
export function DepartureDateField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormLabel>Departure Date</FormLabel>
            <Controller
                name="departure_date"
                control={control}
                rules={{ required: "Departure date is required" }}
                render={({ field: { onChange, value } }) => (
                    <MobileDatePicker
                        inputFormat="MM/dd/yyyy"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={true}
                                error={Boolean(errors?.departure_date)}
                                helperText={errors.departure_date?.message?.toString()} />
                        )} />
                )} />
        </LocalizationProvider>
    </FormControl>;
}

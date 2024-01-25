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
 * The Arrival Date field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns ArrivalDateField component.
 */
export function ArrivalDateField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <FormLabel>Arrival Date</FormLabel>
            <Controller
                name="arrival_date"
                control={control}
                rules={{ required: "Arrival date is required" }}
                render={({ field: { onChange, value } }) => (
                    <MobileDatePicker
                        inputFormat="MM/dd/yyyy"
                        value={value}
                        onChange={onChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                required={true}
                                error={Boolean(errors?.arrival_date)}
                                helperText={errors.arrival_date?.message?.toString()} />
                        )} />
                )} />
        </LocalizationProvider>
    </FormControl>;
}

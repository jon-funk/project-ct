import React from "react";
import { FormControl, TextField } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";


/**
 * The Guest RFID field for Sanctuary intake form.
 * 
 * @param props FormField component props.
 * 
 * @returns GuestRFIDField component.
 */
export function GuestRFIDField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl>
        <Controller name="guest_rfid" control={control} render={({ field }) => (
            <TextField
                {...field}
                label="Guest RFID"
                placeholder="04:FD:3E:2B:4F:5C:80"
                variant="outlined"
                helperText="Wristband RFID" />
        )} />
    </FormControl>;
}

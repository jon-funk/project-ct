import React from "react";
import {
    FormControl, InputLabel,
    Select,
    MenuItem
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { GuestConsciousnessLevelsOptions } from "../../utils/constants";


/**
 * Guest consciousness level field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns GuestConsciousnessLevelField component.
 */
export function GuestConsciousnessLevelField({ control }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <Controller
            name="guest_consciousness_level"
            control={control}
            rules={{ required: "Guest level of consciousness is required" }}
            render={({ field }) => (
                <FormControl fullWidth>
                    <InputLabel id="guest_consciousness_level">Guest Level of Consciousness</InputLabel>
                    <Select
                        labelId="guest_consciousness_level"
                        id="guest_consciousness_level"
                        value={field.value}
                        onChange={field.onChange}
                        label="Guest level of Consciousness"
                        multiple={false}
                    >
                        {GuestConsciousnessLevelsOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            )} />
    </FormControl>;
}

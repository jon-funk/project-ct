import React from "react";
import {
    FormControl, FormLabel,
    Checkbox, Select,
    MenuItem, OutlinedInput,
    ListItemText,
    FormHelperText
} from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { Controller } from "react-hook-form";
import { IntakeSubstanceCategoryOptions } from "../../constants/sanctuaryForm";
import { FormFieldProps } from "../../interfaces/FormFieldProps";
import { MenuProps } from "../../pages/sanctuary/form";


/**
 * Guest emotional state field for Sanctuary intake form
 * 
 * @param props FormField component props.
 * 
 * @returns GuestEmotionalStateField component.
 */
export function SubstanceCategoryField({ control, errors }: FormFieldProps<IntakeFormDataInterface>) {
    return <FormControl fullWidth={true}>
        <FormLabel>Substance Categories</FormLabel>
        <Controller
            name="substance_categories"
            control={control}
            render={({ field }) => (
                <Select
                    {...field}
                    fullWidth={true}
                    multiple={true}
                    label="Select Substance Categorie(s)"
                    input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => selected.join(", ")}
                    MenuProps={MenuProps}
                >
                    {IntakeSubstanceCategoryOptions.map((substance) => (
                        <MenuItem key={substance} value={substance}>
                            <Checkbox checked={field.value.indexOf(substance) > -1} />
                            <ListItemText primary={substance} />
                        </MenuItem>
                    ))}
                </Select>
            )} />
        {errors.substance_categories && (
            <FormHelperText error>{String(errors.substance_categories?.message)}</FormHelperText>
        )}
    </FormControl>;
}

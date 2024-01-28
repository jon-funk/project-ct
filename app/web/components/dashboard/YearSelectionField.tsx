import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import React from "react";


/**
 * Used to select a year for the dashboard.
 * 
 * @returns The YearSelectionField component
 */
export const YearSelectionField = () => {

    return (
        <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select>
                <MenuItem value={2023}>2023</MenuItem>
            </Select>
        </FormControl>
    );
};
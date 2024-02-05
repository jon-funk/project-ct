import { FormControl, Select, MenuItem } from "@mui/material";
import { Control, Controller } from "react-hook-form";
import React from "react";
import { MedicalPostEventSummaryDashboardConfig } from "../../interfaces/MedicalPostEventSummaryDashboardProps";


/**
 * Used to select a year for the dashboard.
 * 
 * @returns The YearSelectionField component
 */
export const YearSelectionField = ({
    control,
}: {
    control: Control<MedicalPostEventSummaryDashboardConfig>;
}) => {
    return (

        <FormControl fullWidth>
            <Controller
                name="selectedYear"
                control={control}
                render={({ field }) => (
                    <Select
                        value={field.value}
                        onChange={field.onChange}
                    >
                        <MenuItem value={"2023"}>2023</MenuItem>
                    </Select>
                )}

            />
        </FormControl>
    );
};
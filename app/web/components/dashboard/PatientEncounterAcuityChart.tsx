import React from "react";
import { Box, Typography, Paper } from "@mui/material";


/**
 * Placeholder representing the Patient Encounter Acuity bar chart.
 * TODO: This is a placeholder component. Replace with data viz compenent when library is selected.
 * 
 * 
 * @returns The PatientEncounterAcuityBarChart component
 */
export const PatientEncounterAcuityBarChart = () => {

    return (
        <Paper elevation={3} sx={{ padding: "1rem", minHeight: "300px" }}>
            <Typography variant="h5" gutterBottom>TODO: Patient Encounters by Acuity Placeholder</Typography>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    backgroundColor: "#e0e0e0",
                }}
            >
                <Typography variant="subtitle1" color="textSecondary">
                    TODO: Bar Chart Placeholder
                </Typography>
            </Box>
        </Paper>
    );
};
import React from "react";
import { ProtectedRoute } from "../../../contexts/auth";

import { Typography } from "@mui/material";


const MedicalPostEventSummaryDashboard = () => {
    return (
        <Typography variant="h1">Post-Event Summary Dashboard</Typography>
    );
};

export default ProtectedRoute(MedicalPostEventSummaryDashboard);
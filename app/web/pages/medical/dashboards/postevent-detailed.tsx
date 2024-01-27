import React from "react";
import { ProtectedRoute } from "../../../contexts/auth";

import { Typography } from "@mui/material";


const MedicalPostEventDetailedDashboard = () => {
    return (
        <Typography variant="h1">Post-Event Detailed Dashboard</Typography>
    );
};

export default ProtectedRoute(MedicalPostEventDetailedDashboard);
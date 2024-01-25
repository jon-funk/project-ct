import React from "react";
import { ProtectedRoute } from "../../../contexts/auth";

import { Typography } from "@mui/material";


const MedicalRealTimeDetailedDashboard = () => {
    return (
        <Typography variant="h1">Real-Time Detailed Dashboard</Typography>
    );
};

export default ProtectedRoute(MedicalRealTimeDetailedDashboard);
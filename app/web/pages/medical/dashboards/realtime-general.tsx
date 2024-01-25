import React from "react";
import { ProtectedRoute } from "../../../contexts/auth";

import { Typography } from "@mui/material";


const MedicalRealTimeGeneralDashboard = () => {
    return (
        <Typography variant="h1">Real-Time General Dashboard</Typography>
    );
};

export default ProtectedRoute(MedicalRealTimeGeneralDashboard);
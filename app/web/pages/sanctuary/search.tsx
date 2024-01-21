import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ProtectedRoute } from "../../contexts/auth";



function SanctuaryIntakeSearch(): JSX.Element {
    return (
        <Container maxWidth="md">
            <Typography variant="h1">Sanctuary Search</Typography>
        </Container>
    );
}

export default ProtectedRoute(SanctuaryIntakeSearch);
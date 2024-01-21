import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ProtectedRoute } from "../../contexts/auth";



function SanctuaryHome(): JSX.Element {
    return (
        <Container maxWidth="md">
            <Typography variant="h1">Sanctuary Home</Typography>
        </Container>
    );
}

export default ProtectedRoute(SanctuaryHome);
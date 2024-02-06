import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/ProtectedNavbar";


function SanctuaryHome(): JSX.Element {
    return (
        <Container maxWidth="md">
            <ProtectedNavbar />
            <Typography variant="h1">Sanctuary Home</Typography>
        </Container>
    );
}

export default ProtectedRoute(SanctuaryHome);
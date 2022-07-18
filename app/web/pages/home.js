import React from "react";
import { Container } from '@mui/material';

import useAuth, { ProtectedRoute } from '../contexts/auth';

function Home() {
    const { user, loading } = useAuth();
    const notAuthenticated = !user || loading;

    if (notAuthenticated) {
        return (
            <>
                <Container maxWidth="md"></Container>
            </>
        )
    } else {
        // Display your desired component here
        return (
            <> 
                <Container>
                    <h1>
                        Display of all entries should be shown here.
                    </h1>
                </Container>
            </>
        )
    }
}

export default ProtectedRoute(Home);
import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";

import useAuth, { ProtectedRoute } from '../contexts/auth';
import ProtectedNavbar from "../components/protected_navbar";


function Home() {
    const { user, loading } = useAuth();
    const notAuthenticated = !user || loading;

    if (notAuthenticated) {
        return (
            <>
                <ProtectedNavbar/>
                <Container maxWidth="md"></Container>
            </>
        )
    } else {
        // Display your desired component here
        return (
            <> 

                <Container>
                    <ProtectedNavbar/>
                    <Typography variant="h4" component="h4" sx={{ margin: "2rem", textAlign: "center", fontWeight: "bold" }}>
                        Data Entry Service
                    </Typography>
                    <Typography variant="p" component="p" sx={{ margin: "2rem", textAlign: "center"}}>
                        This is a service for saving patient encounter information.
                    </Typography>
                </Container>
            </>
        )
    }
}

export default ProtectedRoute(Home);
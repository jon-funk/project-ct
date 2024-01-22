import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/ProtectedNavbar";

function MedicalHome() {
  return (
    <>
      <Container>
        <ProtectedNavbar />
        <Typography
          variant="h4"
          component="h4"
          sx={{ margin: "2rem", textAlign: "center", fontWeight: "bold" }}
        >
          Data Entry Service
        </Typography>
        <Typography
          variant="body1"
          component="p"
          sx={{ margin: "2rem", textAlign: "center" }}
        >
          This is a service for saving patient encounter information.
        </Typography>
      </Container>
    </>
  );
}

export default ProtectedRoute(MedicalHome);

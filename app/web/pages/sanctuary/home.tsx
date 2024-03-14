import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/ProtectedNavbar";
import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@mui/material";
import { UserGroupRoutes } from "../../constants/routes";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SearchIcon from "@mui/icons-material/Search";

function SanctuaryHome(): JSX.Element {

    const routes = UserGroupRoutes.sanctuary;

    const listItemStyle = {
        "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
            cursor: "pointer"
        },
        textDecoration: "underline",
    };

    return (
        <Container maxWidth="md">
            <ProtectedNavbar navigationText="Home" />
            <Paper elevation={3} sx={{ maxWidth: 360, margin: "auto", padding: "20px" }}>
                <Typography variant="h4" gutterBottom sx={{ textAlign: "center", marginBottom: "20px" }}>
                    Sanctuary Home
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ textAlign: "center", margin: "20px" }}>
                    Get started by creating a new intake or searching through existing ones.
                </Typography>
                <Typography variant="body1" gutterBottom sx={{ textAlign: "center", margin: "20px" }}>
                    You can use the links below to navigate to the respective pages as well as the navigation bar at the top.
                </Typography>
                <List>
                    <ListItem
                        button
                        component="a"
                        href={routes.form}
                        sx={listItemStyle}
                    >
                        <ListItemIcon>
                            <AddCircleOutlineIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Create a New Intake" />
                    </ListItem>
                    <ListItem
                        button
                        component="a"
                        href={routes.search}
                        sx={listItemStyle}
                    >
                        <ListItemIcon>
                            <SearchIcon color="primary" />
                        </ListItemIcon>
                        <ListItemText primary="Search for an existing intake" />
                    </ListItem>
                </List>
            </Paper>
        </Container>
    );

}

export default ProtectedRoute(SanctuaryHome);
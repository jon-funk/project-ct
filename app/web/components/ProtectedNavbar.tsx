import React, { useState } from "react";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

/**
 * Renders a navbar for the protected routes.
 *
 * @returns JSX element representing the navbar.
 */
const ProtectedNavbar: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    window.localStorage.removeItem("auth-token");
    window.location.pathname = "/";
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        MUI
      </Typography>
      <Divider />
      <List>
        <ListItem key="New Entry" disablePadding>
          <ListItemButton href="/medical/form" sx={{ textAlign: "center" }}>{/* TODO: Implement logic for user's group form */}
            <ListItemText primary="New Entry" />
          </ListItemButton>
        </ListItem>
        <ListItemButton onClick={logout} sx={{ textAlign: "center" }}>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex", pb: "60px" }}>
        <AppBar component="nav">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: "none" } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "block", fontWeight: "bold" },
              }}
            >
              <Link href="/medical/home">Home</Link>{/* TODO: Implement logic for user's group home */}
            </Typography>
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                href="/medical/search"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >{/* TODO: Implement logic for user's group search */}
                List Entries
              </Button>
              <Button
                href="/medical/form"
                sx={{ color: "#fff", fontWeight: "bold" }}
              >{/* TODO: Implement logic to user's group form */}
                New Entry
              </Button>
              <Button
                key="logout"
                sx={{ color: "#fff", fontWeight: "bold" }}
                onClick={logout}
              >
                Logout
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        <Box component="nav">
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>
      </Box>
    </>
  );
};

export default ProtectedNavbar;

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
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
import { UserGroupRoutes, UserGroupKey } from "../constants/routes";
import { getUserGroupKey, removeUserGroup } from "../utils/authentication";

/**
 * Renders a navbar for the protected routes.
 *
 * @returns JSX element representing the navbar.
 */
const ProtectedNavbar: React.FC = () => {

  // Ensure the component is mounted before running any logic
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const userGroupKey = getUserGroupKey() as UserGroupKey;
  const userRoutes = userGroupKey ? UserGroupRoutes[userGroupKey] : null;

  // Check if the current route is allowed for the user group
  useEffect(() => {
    if (isMounted && userRoutes) {
      const currentPath = window.location.pathname;
      const isRouteAllowed = Object.values(userRoutes).includes(currentPath);
      if (!isRouteAllowed) {
        router.push(userRoutes.home);
      }
    }
  }, [isMounted, userRoutes, router]);

  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const logout = () => {
    removeUserGroup();
    window.localStorage.removeItem("auth-token");
    window.location.pathname = "/";
  };

  // Render the navbar once the user group routes are loaded
  if (!isMounted || !userRoutes) {
    return <div>Loading...</div>;
  } else {
    const drawer = (
      <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
        <Typography variant="h6" sx={{ my: 2 }}>
          MUI
        </Typography>
        <Divider />
        <List>
          <ListItem key="New Entry" disablePadding>
            <ListItemButton href={userRoutes.form} sx={{ textAlign: "center" }}>
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
                <Link href={userRoutes.home}>Home</Link>
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Button
                  href={userRoutes.search}
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
                  List Entries
                </Button>
                <Button
                  href={userRoutes.form}
                  sx={{ color: "#fff", fontWeight: "bold" }}
                >
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
  }
};

export default ProtectedNavbar;

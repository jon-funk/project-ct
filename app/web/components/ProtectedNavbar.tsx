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
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { BoxProps } from "@mui/material/Box";
import { UserGroupRoutes, UserGroupKey } from "../constants/routes";
import { getUserGroupKey, removeUserGroup } from "../utils/authentication";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddIcon from "@mui/icons-material/Add";
import QueryStatsIcon from "@mui/icons-material/QueryStats";


interface ProtectedNavbarProps extends BoxProps {
  navigationText?: string;
}



/**
 * Renders a navbar for the protected routes.
 *
 * @returns JSX element representing the navbar.
 */
const ProtectedNavbar: React.FC<ProtectedNavbarProps> = (props) => {

  // Ensure the component is mounted before running any logic
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const router = useRouter();
  const userGroupKey = getUserGroupKey() as UserGroupKey;
  const userRoutes = userGroupKey ? UserGroupRoutes[userGroupKey] : null;

  const [anchorAccountEl, setAnchorAccountEl] = useState<null | HTMLElement>(null);
  const [patientEncountersAnchorEl, setPatientEncountersAnchorEl] = useState<null | HTMLElement>(null);
  const [dashboardAnchorEl, setDashboardAnchorEl] = useState<null | HTMLElement>(null);
  const isDashboardMenuOpen = Boolean(dashboardAnchorEl);
  const isPatientEncountersMenuOpen = Boolean(patientEncountersAnchorEl);

  const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAccountEl(event.currentTarget);
  };
  const handleAccountMenuClose = () => {
    setAnchorAccountEl(null);
  };

  const handlePatientEncountersMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setPatientEncountersAnchorEl(event.currentTarget);
  };

  const handlePatientEncountersMenuClose = () => {
    setPatientEncountersAnchorEl(null);
  };

  const handleDashboardMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setDashboardAnchorEl(event.currentTarget);
  };

  const handleDashboardMenuClose = () => {
    setDashboardAnchorEl(null);
  };

  const logout = () => {
    handleAccountMenuClose(); // Close menu before logging out
    removeUserGroup();
    window.localStorage.removeItem("auth-token");
    router.push("/");
  };

  const currentFormMenuButtonText = buttonFormMenuTextByUserGroup[userGroupKey] || "Forms";
  const currentNewFormButtonText = formMenuItemsTextByUserGroup[userGroupKey]?.newEntry || "New Entry";
  const currentListFormsButtonText = formMenuItemsTextByUserGroup[userGroupKey]?.listEntries || "List Entries";

  const menuId = "primary-search-account-menu";

  const renderAccountMenu = (
    <Menu
      anchorEl={anchorAccountEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={Boolean(anchorAccountEl)}
      onClose={handleAccountMenuClose}
    >
      <MenuItem onClick={logout}>
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </MenuItem>
    </Menu>
  );

  // Patient encounters menu
  const renderPatientEncountersMenu = (
    <Menu
      anchorEl={patientEncountersAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isPatientEncountersMenuOpen}
      onClose={handlePatientEncountersMenuClose}
    >
      <MenuItem onClick={() => {
        if (userRoutes) {
          router.push(userRoutes.form); handlePatientEncountersMenuClose();
        }
      }}>
        <ListItemIcon>
          <AddIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{currentNewFormButtonText}</ListItemText>
      </MenuItem>
      <MenuItem onClick={() => {
        if (userRoutes) {
          router.push(userRoutes.search); handlePatientEncountersMenuClose();
        }
      }}>
        <ListItemIcon>
          <SearchIcon fontSize="small" />
        </ListItemIcon>
        <ListItemText>{currentListFormsButtonText}</ListItemText>
      </MenuItem>
    </Menu>
  );

  const renderDashboardMenu = (
    <Menu
      anchorEl={dashboardAnchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isDashboardMenuOpen}
      onClose={handleDashboardMenuClose}
    >
      {userRoutes?.dashboards && Object.entries(userRoutes.dashboards).map(([key, path]) => (
        <MenuItem key={key} onClick={() => { router.push(path); handleDashboardMenuClose(); }}>
          <ListItemText>{key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, " ")}</ListItemText>
        </MenuItem>
      ))}
    </Menu>
  );


  // Check if the current route is allowed for the user group
  useEffect(() => {
    if (isMounted && userRoutes) {
      const currentPath = window.location.pathname;
      const isRouteAllowed = Object.keys(userRoutes).some(routeKey => {
        const routePath = userRoutes[routeKey as keyof typeof userRoutes];
        return typeof routePath === "string" ? currentPath === routePath || currentPath.startsWith(routePath) : Object.values(routePath as Record<string, string>).some(subPath => currentPath.startsWith(subPath));
      });
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
        <Box sx={{ display: "flex", pb: "60px", ...props.sx }}>
          <AppBar component="nav" position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { xs: "none", sm: "none" } }}
              >
                <MenuIcon />
              </IconButton>
              <Link href={userRoutes.home} passHref>
                <IconButton
                  color="inherit"
                  aria-label="home"
                  sx={{ mr: 2, display: { xs: "none", sm: "block" } }}
                >
                  <HomeIcon />
                </IconButton>
              </Link>
              <Typography
                variant="body2"
                component="div"
                sx={{
                  flexGrow: 1,
                  display: { xs: "none", sm: "block", fontWeight: "bold" },
                }}
              >
                {/* Create nav bread crumbs */}
                {userGroupKey.charAt(0).toUpperCase() + userGroupKey.slice(1).replace(/-/g, " ")} {" > "} {props.navigationText}
              </Typography>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Box sx={{ display: "flex" }}>
                  {userRoutes?.dashboards && (
                    <Button
                      startIcon={<QueryStatsIcon />}
                      onClick={handleDashboardMenuOpen}
                      sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.25rem", textTransform: "none" }}
                    >
                      Dashboards
                    </Button>
                  )}
                  {renderDashboardMenu}
                  <Button
                    onClick={handlePatientEncountersMenuOpen}
                    sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.25rem", textTransform: "none" }}
                  >
                    <AssignmentIcon sx={{ fontSize: "1.5rem", mr: 1 }} />
                    {currentFormMenuButtonText}
                  </Button>
                  {renderPatientEncountersMenu}
                  <Button
                    onClick={handleAccountMenuOpen}
                    sx={{ color: "#fff", fontWeight: "bold", fontSize: "1.25rem", textTransform: "none" }}
                  >
                    <AccountCircleIcon sx={{ fontSize: "1.5rem", mr: 1 }} />
                    Account
                  </Button>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
          {renderAccountMenu}
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

const buttonFormMenuTextByUserGroup = {
  medical: "Patient Encounters",
  sanctuary: "Intakes",
};


const formMenuItemsTextByUserGroup = {
  medical: {
    newEntry: "New Encounter",
    listEntries: "List Encounters",
  },
  sanctuary: {
    newEntry: "New Intake",
    listEntries: "List Intakes",
  },
};


export default ProtectedNavbar;

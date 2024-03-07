import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemText, Toolbar } from "@mui/material";
import { YearSelectionField } from "./YearSelectionField";
import { FormProvider, Control, UseFormReturn } from "react-hook-form";
import { MedicalPostEventSummaryDashboardConfig } from "../../interfaces/MedicalPostEventSummaryDashboardProps";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const drawerWidth = 240;

const theme = createTheme({

    palette: {
        mode: "dark",
        primary: {
            main: "#1963d2",
        },

    },
    components: {
        MuiDrawer: {
            styleOverrides: {
                paper: {
                },
            },
        },
    },
});

interface PostEventDashboardSidebarProps {
    control: Control<MedicalPostEventSummaryDashboardConfig>;
    methods: UseFormReturn<MedicalPostEventSummaryDashboardConfig>;
    onSelectView: (view: string) => void; // Add this line
    selectedView: string;
}


const PostEventDashboardSidebar: React.FC<PostEventDashboardSidebarProps> = ({ control, methods, onSelectView, selectedView }) => {

    return (
        <ThemeProvider theme={theme}>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                        backgroundColor: "#1963d2",
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                <Toolbar />
                <Box sx={{ overflow: "auto" }}>
                    <List>
                        <ListItem>
                            <ListItemText>
                                <FormProvider {...methods}>
                                    <YearSelectionField control={control} />
                                </FormProvider>
                            </ListItemText>
                        </ListItem>
                        {["Summary", "Patient Encounters", "Offsite Transports", "Patient Length of Stay Times"].map((text) => (
                            <ListItemButton key={text} onClick={() => onSelectView(text)} sx={{ backgroundColor: text === selectedView ? "rgba(255, 255, 255, 0.2)" : "transparent", }}>
                                <ListItemText primary={text} />
                            </ListItemButton>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </ThemeProvider >
    );
}

export default PostEventDashboardSidebar;
import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { ProtectedRoute } from "../../contexts/auth";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import ProtectedNavbar from "../../components/ProtectedNavbar";
import { AppBar, Box, Dialog, IconButton, Toolbar } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGrid } from "@mui/x-data-grid";
import { SlideTransition } from "../../components/SlideTransition";
import { SanctuaryModifyIntakeForm } from "../../components/intake_form/SanctuaryModifyIntakeForm";
import { fetchSanctuaryIntakes } from "../../utils/api_sanctuary";


/**
 * SanctuaryIntakeSearch is the page that displays all the intake forms in the database.
 * 
 * @returns The page that displays all the intake forms in the database.
 */
function SanctuaryIntakeSearch(): React.JSX.Element {

    const [sanctuaryIntakes, setSanctuaryIntakes] = useState<IntakeFormDataInterface[]>([]);
    const [isError, setIsErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState<IntakeFormDataInterface>({} as IntakeFormDataInterface);
    const [formUUID, setFormUUID] = useState("");

    const openDialogWindow = (rowData: { row: IntakeFormDataInterface }) => {
        setOpenDialog(true);
        setSelectedRow(rowData.row);
        setFormUUID(rowData.row.intake_uuid);
    };

    const closeDialogWindow = () => {
        setOpenDialog(false);
        setSelectedRow({} as IntakeFormDataInterface);
    };

    useEffect(() => {
        const token = `Bearer ${window.localStorage.getItem("auth-token")}`;
        if (sanctuaryIntakes.length === 0) {
            fetchSanctuaryIntakes(token, setSanctuaryIntakes, setIsErrorMessage, setErrorMessage);
        }
    }, [sanctuaryIntakes]);

    const columns = [
        { field: "intake_uuid", headerName: "UUID", width: 200 },
        { field: "guest_rfid", headerName: "Guest RFID", width: 150 },
        { field: "arrival_date", headerName: "Arrival Date", width: 100 },
        { field: "arrival_time", headerName: "Arrival Time", width: 150 },
        { field: "arrival_method", headerName: "Arrival Method", width: 150 },
        { field: "identified_gender", headerName: "Identified Gender", width: 200 },
        { field: "first_visit", headerName: "First Visit", width: 200 },
        { field: "presenting_complaint", headerName: "Presenting Complaint", width: 200 },
        { field: "guest_consciousness_level", headerName: "Guest Consciousness Level", width: 150 },
        { field: "guest_emotional_state", headerName: "Guest Emotional State", width: 250 },
        { field: "substance_categories", headerName: "Substance Categories", width: 250 },
        { field: "time_since_last_dose", headerName: "Time Since Last Dose", width: 250 },
        { field: "departure_date", headerName: "Discharge Date", width: 250 },
        { field: "departure_time", headerName: "Discharge Time", width: 250 },
        { field: "departure_dest", headerName: "Discharge Destination", width: 250 },
    ];

    if (isError) {
        return (
            <>
                <ProtectedNavbar navigationText="List Intakes" />
                <Container>
                    {isError && (
                        <Typography
                            variant="h4"
                            component="h4"
                            sx={{
                                pt: "2rem",
                                margin: "2rem",
                                textAlign: "center",
                                fontWeight: "bold",
                            }}
                        >
                            {"ERROR: " + errorMessage}
                        </Typography>
                    )}
                </Container>
            </>
        );
    } else {
        return (
            <>
                <ProtectedNavbar navigationText="List Intakes" />
                <Container>
                    <Typography
                        variant="h4"
                        component="h4"
                        sx={{
                            pt: "2rem",
                            margin: "2rem",
                            textAlign: "center",
                            fontWeight: "bold",
                        }}
                    >
                        All Intake Forms
                    </Typography>
                    <Box sx={{ height: 600, width: "100%" }}>
                        <DataGrid
                            rows={sanctuaryIntakes}
                            columns={columns}
                            onRowClick={openDialogWindow}
                            pageSize={10}
                            getRowId={(row) => row.intake_uuid}
                            rowsPerPageOptions={[20]}
                            checkboxSelection={false}
                            disableSelectionOnClick={true}
                        />
                    </Box>

                    <Dialog fullScreen open={openDialog} TransitionComponent={SlideTransition}>
                        <AppBar sx={{ position: "fixed" }}>
                            <Toolbar>
                                <Typography
                                    sx={{ ml: 2, flex: 1, fontWeight: "bold" }}
                                    variant="h6"
                                    component="div"
                                >
                                    UUID: {formUUID}
                                </Typography>
                                <IconButton
                                    edge="start"
                                    color="inherit"
                                    onClick={closeDialogWindow}
                                    aria-label="close"
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        {
                            openDialog && (
                                <SanctuaryModifyIntakeForm formUUID={formUUID} rowData={selectedRow} />
                            )
                        }
                    </Dialog>
                </Container>
            </>
        );
    }
}

export default ProtectedRoute(SanctuaryIntakeSearch);
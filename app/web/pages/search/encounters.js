import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

import { DataGrid } from "@mui/x-data-grid";
import Dialog from "@mui/material/Dialog";

import Container from "@mui/material/Container";

import useAuth, { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/protected_navbar";
import { getAllPatientEncounters } from "../../utils/api";
import MFPEModifyForm from "../../components/patient_encounter_form/modify_form";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PESearch() {
  const [encounters, setPatientEncounters] = React.useState([]);
  const [isError, setIsErrorMessage] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [openDialog, setOpenDialog] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState(new Object());
  const [formUUID, setFormUUID] = React.useState("");

  const openDialogWindow = (rowData) => {
    setOpenDialog(true);
    setSelectedRow(rowData?.row);
    setFormUUID(rowData?.row?.patient_encounter_uuid);
  };

  const closeDialogWindow = (event) => {
    setOpenDialog(false);
    setSelectedRow(new Object());
  };

  React.useEffect(() => {
    async function fetchPatientEncounters() {
      const token = `Bearer ${window.localStorage.getItem("auth-token")}`;
      const patientEncounters = await getAllPatientEncounters(token);
      if (Array.isArray(patientEncounters)) {
        setPatientEncounters(patientEncounters);
      } else {
        // Internal server error has been observed that should be displayed to users
        setErrorMessage(
          "Unable to load data from the server. Try refreshing and if the problem persists, contact the development team"
        );
        setIsErrorMessage(true);
      }
    }

    if (encounters.length === 0) {
      fetchPatientEncounters();
    }
  });

  const columns = [
    { field: "patient_encounter_uuid", headerName: "UUID", width: 200 },
    { field: "document_num", headerName: "Document ID", width: 150 },
    { field: "age", headerName: "Age", width: 100 },
    { field: "gender", headerName: "Gender", width: 150 },
    { field: "arrival_date", headerName: "Arrival Date", width: 150 },
    { field: "arrival_time", headerName: "Arrival Time", width: 200 },
    { field: "arrival_method", headerName: "Arrival Method", width: 200 },
    { field: "location", headerName: "Location", width: 200 },
    { field: "on_shift", headerName: "On Shift", width: 150 },
    { field: "triage_acuity", headerName: "Triage Acuity", width: 250 },
    { field: "chief_complaints", headerName: "Chief Complaints", width: 250 },
    { field: "departure_date", headerName: "Departure Date", width: 150 },
    { field: "departure_time", headerName: "Departure Time", width: 200 },
    {
      field: "departure_dest",
      headerName: "Departure Destination",
      width: 250,
    },
    { field: "handover_from", headerName: "Handover From", width: 250 },
    { field: "handover_too", headerName: "Handover To", width: 250 },
    { field: "comment", headerName: "Comment", width: 250 },

    { field: "patient_rfid", headerName: "Patient RFID", width: 150 },
    { field: "qr_code", headerName: "QR Code", width: 150 },
  ];

  if (isError) {
    return (
      <>
        <ProtectedNavbar />
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
              {errorMessage}
            </Typography>
          )}
        </Container>
      </>
    );
  } else {
    return (
      <>
        <ProtectedNavbar />
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
            All Patient Encounter Forms
          </Typography>
          <Box sx={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={encounters}
              columns={columns}
              onRowClick={openDialogWindow}
              pageSize={10}
              getRowId={(row) => row.patient_encounter_uuid}
              rowsPerPageOptions={[20]}
              checkboxSelection={false}
              disableSelectionOnClick={true}
            />
          </Box>

          <Dialog fullScreen open={openDialog} TransitionComponent={Transition}>
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
              // Conditionally rendering this ensures the element is refreshed when the data does...
              openDialog && (
                <MFPEModifyForm formUUID={formUUID} rowData={selectedRow} />
              )
            }
          </Dialog>
        </Container>
      </>
    );
  }
}

export default ProtectedRoute(PESearch);

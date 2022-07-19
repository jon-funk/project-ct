import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Container from "@mui/material/Container";

import useAuth, { ProtectedRoute } from '../../contexts/auth';
import ProtectedNavbar from "../../components/protected_navbar";
import { getAllPatientEncounters } from "../../utils/api";


function PESearch() {
    const [encounters, setPatientEncounters] = React.useState([]);
    const [isError, setErrorMessage] = React.useState(false);

    const { user, loading } = useAuth();
    const columns = [
        { field: 'id', headerName: 'UID', width: 50 },
        {
            field: 'View', headerName: 'View',
            renderCell: (cellValues) => {
                return <Link href={`#${cellValues.row.url}`}>View</Link>;
            },
            width: 150
        },
        { field: 'document_num', headerName: 'ID', width: 150 },
        { field: 'triage_acuity', headerName: 'Triage Acuity', width: 150 },
        { field: 'arrival_method', headerName: 'Arrival Method', width: 150 },
        { field: 'arrival_time', headerName: 'Arrival Time', width: 150 },
        { field: 'departure_time', headerName: 'Departure Time', width: 150 },
    ];

    const rows = [
        { uid: 1, view: "PH", doc_id: 1, triage_acuity: 'yellow', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 2, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 3, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 4, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 5, triage_acuity: 'red', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 1, triage_acuity: 'yellow', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 2, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 3, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 4, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 5, triage_acuity: 'red', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 1, triage_acuity: 'yellow', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 2, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 3, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 4, triage_acuity: 'green', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
        { uid: 1, view: "PH", doc_id: 5, triage_acuity: 'red', arrival_method: 'yee', arrival_time: 'haw', departure_time: 'meemaw' },
    ];

    React.useEffect(() => {
        const fetchPatientEncounters = async () => {
            const token = `Bearer ${window.localStorage.getItem("auth-token")}`;
            const patientEncounters = await getAllPatientEncounters(token);

            console.log("Retrieved the following patient", patientEncounters);
            if (Array.isArray(patientEncounters)) {
                const encounterData = patientEncounters.forEach((obj, index) => {
                    return {...obj, id: index}
                })

                setPatientEncounters(patientEncounters);
            } else {
                errorMessage = "Unable to load data from the server. Try refreshing and if the problem persists, contact the development team";
                setErrorMessage(true);
                // Internal server error has been observed that should be displayed to users
            }
        }

        fetchPatientEncounters();
    });

    return (
        <>
            <ProtectedNavbar/>
            <Container>
            {
                isError && (
                    <Typography variant="h4" component="h4" sx={{ margin: "2rem", textAlign: "center", fontWeight: "bold" }}>
                        Patient Encouter Search
                    </Typography>
                )
            }
            </Container>
            <Container><Box sx={{ height: 600, width: '100%' }}>
            <Typography variant="h4" component="h4" sx={{ margin: "2rem", textAlign: "center", fontWeight: "bold" }}>
                Unable to load data from the server at this time. Please try again later or contact support.
            </Typography>
            <DataGrid
                    rows={encounters}
                    columns={columns}
                    // getRowId={(row) => row._id}
                    pageSize={10}
                    getRowId={(row) => row.document_num}
                    rowsPerPageOptions={[20]}
                    checkboxSelection={false}
                    disableSelectionOnClick={true}
                />
            </Box>
            </Container>
        </>
    );
}

export default ProtectedRoute(PESearch);
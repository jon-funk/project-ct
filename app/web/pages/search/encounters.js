


import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Typography from '@mui/material/Typography';
import Container from "@mui/material/Container";

import useAuth, { ProtectedRoute } from '../../contexts/auth';
import ProtectedNavbar from "../../components/protected_navbar";


function PESearch() {
    const [value, setValue] = React.useState(new Date());
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
        { field: 'doc_id', headerName: 'Document ID', width: 150 },
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


    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <ProtectedNavbar/>
            <Container>
                <Typography variant="h4" component="h4" sx={{ margin: "2rem", textAlign: "center", fontWeight: "bold" }}>
                    Patient Encouter Search
                </Typography>
            </Container>
            <Container><Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    getRowId={(row) => row.uid}
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
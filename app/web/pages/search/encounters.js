


import React from 'react';
import Link from 'next/link';
import Box from '@mui/material/Box';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import {
    FormGroup, Container, Grid, Autocomplete, Checkbox, TextField,
    RadioGroup, Radio, FormControlLabel, InputLabel, Select, MenuItem, Button
} from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { width } from '@mui/system';
import { Script } from 'vm';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import useAuth, { ProtectedRoute } from '../../contexts/auth';


// function Copyright(props) {
//     return (
//         <Typography variant="body2" color="text.secondary" align="center" {...props}>
//             {'Copyright © '}
//             {new Date().getFullYear()}
//             {'.'}
//         </Typography>
//     );
// }

// const theme = createTheme();

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
    ];


    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <>
            <Container>
                <Box m={5} pt={3}>
                    <a>Patient Encounter Search</a>
                </Box>
            </Container>
            <Container><Box sx={{ height: 600, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
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
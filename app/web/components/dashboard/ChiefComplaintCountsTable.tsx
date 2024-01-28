import React, { useEffect, useState } from "react";
import { DataGrid, GridSortItem } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import { ChiefComplaintCountsTableProps } from "../../interfaces/ChiefComplaintCountsTableProps";

/**
 * Represents the Chief Complaint Counts table
 * 
 * @param props The props for the Chief Complaint Counts table
 * 
 * @returns The ChiefComplaintCountsTable component
 */
export const ChiefComplaintCountsTable = ({ rows }: ChiefComplaintCountsTableProps) => {

    const [totalChiefComplaint, setTotalChiefComplaint] = useState(0);

    useEffect(() => {
        setTotalChiefComplaint(rows.reduce((total, row) => total + row.total_count, 0));
    }, [rows]);

    const showPagination = rows.length > 17;

    return (
        <Paper
            elevation={0}
            sx={{
                height: 1000,
                width: 800,
                "& .MuiDataGrid-columnHeaders": {
                    backgroundColor: "#0073e6",
                    color: "white",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                    backgroundColor: "#eff7fa",
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                    backgroundColor: "#ffffff",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                    whiteSpace: "normal",
                    lineHeight: "normal",
                    wordBreak: "break-word",
                },
                "& .MuiDataGrid-footerContainer": {
                    borderTop: "none",
                },
            }}
        >
            <Typography variant="h5">Chief Complaint Counts</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={18}
                rowsPerPageOptions={[18]}
                sortModel={sortModel}
                paginationMode={showPagination ? "server" : "client"}
            />
            <Box sx={{ textAlign: "center", marginTop: "1rem", marginBottom: "1rem", padding: "10px, 0px, 10px, 0px" }}>
                <Typography variant="body1">Total Chief Complaints: {totalChiefComplaint}</Typography>
            </Box>
        </Paper>
    )

};

/**
 * The columns for the Chief Complaint Counts table
 */
const columns = [
    { field: "chief_complaint", headerName: "Chief Complaint", flex: 1.25 },
    { field: "total_count", headerName: "Total Count", flex: 0.5 },
    { field: "prec_of_patient_encounters", headerName: "% of Patient Encounters", flex: 0.75 },
    { field: "exclusive_cc_count", headerName: "Exclusive CC Count", flex: 0.75 },
    { field: "co_occuring_cc_count", headerName: "Co-Occuring CC Count", flex: 0.75 },
];

/**
 * The sort model for the Chief Complaint Counts table
 */
const sortModel: GridSortItem[] = [
    {
        field: "total_count",
        sort: "desc",
    },
];
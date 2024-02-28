import React, { useEffect, useState } from "react";
import { DataGrid, GridSortItem } from "@mui/x-data-grid";
import { Box, Typography, Paper } from "@mui/material";
import { ChiefComplaintCountsTableProps } from "../../interfaces/ChiefComplaintCountsTableProps";
import { tableColorStylesLight } from "../../constants/colorPalettes";

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
                width: "auto",
                "& .MuiDataGrid-columnHeaders": {
                    ...tableColorStylesLight.subHeader,
                },
                "& .MuiDataGrid-row:nth-of-type(odd)": {
                    ...tableColorStylesLight.oddRow,
                },
                "& .MuiDataGrid-row:nth-of-type(even)": {
                    ...tableColorStylesLight.evenRow,
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
            <Typography variant="h5" align="center" sx={{ ...tableColorStylesLight.header, padding: "16px 0" }}>Chief Complaint Counts (Total: {totalChiefComplaint})</Typography>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={18}
                rowsPerPageOptions={[18]}
                sortModel={sortModel}
                paginationMode={showPagination ? "server" : "client"}
                autoHeight
            />
            <Box sx={{ textAlign: "center", marginTop: "1rem", marginBottom: "1rem", padding: "10px, 0px, 10px, 0px" }}>
            </Box>
        </Paper >
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
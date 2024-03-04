import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ChiefComplaintEncounterCountsTableProps } from "../../interfaces/ChiefComplaintEncounterCountsTableProps";
import { tableColorStylesLight } from "../../constants/colorPalettes";
import { StyledTableCell } from "../StyledTableComponents";

/**
 * Represents the table for the chief complaint encounter counts.
 * 
 * @param props The props for the component
 * 
 * @returns The ChiefComplaintEncounterCountsTable component
 */
export const ChiefComplaintEncounterCountsTable: React.FC<ChiefComplaintEncounterCountsTableProps> = ({ encounterCounts }) => {

    const rows = [
        { numberOfComplaints: "1", numberOfEncounters: encounterCounts[0] },
        { numberOfComplaints: "2", numberOfEncounters: encounterCounts[1] },
        { numberOfComplaints: "3", numberOfEncounters: encounterCounts[2] },
        { numberOfComplaints: ">3", numberOfEncounters: encounterCounts[3] },
    ]

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 50 }} aria-label="simple table">
                <TableHead>
                    <TableRow sx={{ ...tableColorStylesLight.header, "& > *": tableColorStylesLight.header }}>
                        <TableCell colSpan={2} align="center" sx={{ ...tableColorStylesLight.header }}>Chief Complaints across Patient Encounters</TableCell>
                    </TableRow>
                    <TableRow sx={{ ...tableColorStylesLight.subHeader, "& > *": tableColorStylesLight.subHeader }}>
                        <StyledTableCell align="center"># of Complaints</StyledTableCell>
                        <StyledTableCell align="center"># of Encounters</StyledTableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.numberOfComplaints}
                            sx={{
                                "&:nth-of-type(odd)": tableColorStylesLight.oddRow,
                                "&:nth-of-type(even)": tableColorStylesLight.evenRow,
                                "&:last-child td, &:last-child th": { border: 0 }
                            }}
                        >
                            <TableCell component="th" scope="row" align="center">
                                {row.numberOfComplaints}
                            </TableCell>
                            <TableCell align="center">{row.numberOfEncounters}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    )
};
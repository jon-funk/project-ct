import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { ChiefComplaintEncounterCountsTableProps } from "../../interfaces/ChiefComplaintEncounterCountsTableProps";


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
                    <TableRow>
                        <TableCell colSpan={2} align="center">Chief Complaints across Patient Encounters</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell># of Complaints</TableCell>
                        <TableCell align="right"># of Encounters</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.numberOfComplaints}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
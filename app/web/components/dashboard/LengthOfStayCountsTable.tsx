import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { LengthOfStayCountsTableProps } from "../../interfaces/LengthOfStayCountsTableProps";


/**
 * Represents the table for the length of stay counts.
 * 
 * @param props The props for the component
 * 
 * @returns The LengthOfStayCountsTable component
 */
export const LengthOfStayCountsTable: React.FC<LengthOfStayCountsTableProps> = (
    { rows, summaryRows }: LengthOfStayCountsTableProps
) => {

    return (
        <TableContainer component={Paper}>
            <Table aria-label="customized table">
                <TableHead>
                    <TableRow>
                        <TableCell align="center">Length of Stay</TableCell>
                        <TableCell align="center">Total</TableCell>
                        <TableCell align="center">Rd</TableCell>
                        <TableCell align="center">Yw</TableCell>
                        <TableCell align="center">Gr</TableCell>
                        <TableCell align="center">Wh</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row: (string | number)[], index: number) => (
                        <TableRow key={index}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} align="center">
                                    {typeof cell === "number" ? cell.toFixed(0) : cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                    {/* Quartiles Header */}
                    <TableRow>
                        <TableCell colSpan={6} align="left">Quartiles</TableCell>
                    </TableRow>
                    {/* Quantiles, Mean, etc. */}
                    {summaryRows.map((row: (string | number)[], index: number) => (
                        <TableRow key={index}>
                            {row.map((cell, cellIndex) => (
                                <TableCell key={cellIndex} align="center">
                                    {row[0] === "Mean" && typeof cell === "number" ? cell.toFixed(2) : cell}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};
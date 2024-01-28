import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper, Typography } from "@mui/material";
import { CommonPresentationsTableProps } from "../../interfaces/CommonPresentationsTableProps";

/**
 * Represents the table for the common presentations.
 * 
 * @param props The props for the component
 * 
 * @returns The CommonPresentationsTable component
 */
export const CommonPresentationsTable = (props: CommonPresentationsTableProps) => {

    const { commonPresentationsData } = props;
    const { rows, totals, headerName, backgroundColor, textColor } = commonPresentationsData;
    return (
        <TableContainer component={Paper} sx={{ margin: "16px 0", bgcolor: backgroundColor }}>
            <Typography variant="h6" sx={{ margin: "8px", color: textColor }}>{headerName}</Typography>
            <Table>
                <TableBody>
                    {rows.map((item, index) => (
                        <TableRow key={index} sx={{ color: textColor }}>
                            <TableCell sx={{ color: textColor, borderBottom: "none" }}>{item.complaint}</TableCell>
                            <TableCell align="right" sx={{ color: textColor, borderBottom: "none" }}>{item.count}</TableCell>
                        </TableRow>
                    ))}
                    <TableRow sx={{ color: textColor }}>
                        <TableCell sx={{ color: textColor, borderBottom: "none" }}>Total</TableCell>
                        <TableCell align="right" sx={{ color: textColor, borderBottom: "none" }}>{totals.totalCount}/{totals.outOf}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    );
};
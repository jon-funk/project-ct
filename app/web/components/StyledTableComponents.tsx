import { TableCell, TableCellProps } from "@mui/material";
import { tableColorStylesLight } from "../constants/colorPalettes";
import React from "react";

interface StyledTableCellProps extends TableCellProps {
    children: React.ReactNode;
    colSpan?: number;
}

/**
 * Represents a styled table cell.
 * 
 * @param align The alignment of the cell (default "inherit")
 * @param children The children of the cell
 * @param colSpan The column span of the cell (default 1)
 * @returns The StyledTableCell component
 */
export const StyledTableCell: React.FC<StyledTableCellProps> = ({ align = "inherit", children, colSpan = 1 }) => (
    <TableCell align={align} colSpan={colSpan} sx={{ ...tableColorStylesLight.subHeader }}>
        {children}
    </TableCell>
);
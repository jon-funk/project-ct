import React from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { BoxPlot } from "@visx/stats";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { BoxPlotData, LengthOfStayMedianRow, LengthOfStayTransportsListProps, LengthOfStayStyle } from "../../interfaces/PosteventDashboard";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { tableColorStylesLight } from "../../constants/colorPalettes";


export const LengthOfStayWhiskerBoxPlot: React.FC<{ boxPlotData: BoxPlotData[], style: LengthOfStayStyle }> = ({ boxPlotData: dataByDay, style }) => {


    // Calculate min and max for the yScale across all days
    const allData = dataByDay.flatMap(day => day.data);
    const min = Math.min(...allData);
    const max = Math.max(...allData);

    const buffer = Math.abs(max - min) * 0.1;

    // Scales
    const yScale = scaleLinear({
        domain: [Math.max(0, min) - buffer, max + buffer],
        range: [300, 0],
    });
    const xScale = scaleBand({
        domain: dataByDay.map(day => day.day),
        range: [0, 300],
        padding: 0.2,
    });

    // Dimensions
    const margin = { top: 20, right: 20, bottom: 80, left: 70 };
    const width = 300 + margin.left + margin.right;
    const height = 320 + margin.top + margin.bottom;

    // Calculate box width with a reduction factor
    const boxWidth = xScale.bandwidth() * 0.5;

    // Axis labels
    const xAxisLabel = "Days";
    const yAxisLabel = "Length of Stay";
    const axisFontSize = 18;

    const medianLineWidth = 3;

    return (
        <Paper sx={{ width: width, height: height }} elevation={3}>
            <Typography variant="h5" sx={{ textAlign: "center", fontWeight: "bold", color: style.titleColor, backgroundColor: style.titleBackground }}>{style.title}</Typography>
            <svg width={width} height={height}>
                <Group top={margin.top} left={margin.left}>
                    {dataByDay.map((dayData, i) => {
                        const { day, data } = dayData;
                        if (xScale(day) === undefined || !data) {
                            return null;
                        }
                        const min = Math.min(...data);
                        const max = Math.max(...data);
                        const quartiles = calculateQuartiles(data);
                        const leftPosition = xScale(day)! + (xScale.bandwidth() - boxWidth) / 2;

                        if (data.length > 1) {
                            const medianValue = yScale(quartiles.median);
                            return (
                                <Group key={i} left={leftPosition}>
                                    <BoxPlot
                                        min={min}
                                        max={max}
                                        firstQuartile={quartiles.firstQuartile}
                                        thirdQuartile={quartiles.thirdQuartile}
                                        median={quartiles.median}
                                        boxWidth={boxWidth}
                                        fill={style.boxFill}
                                        stroke={style.boxStroke}
                                        strokeWidth={2}
                                        valueScale={yScale}
                                    />
                                    {/* Custom median line */}
                                    <line
                                        x1={0}
                                        x2={boxWidth}
                                        y1={medianValue}
                                        y2={medianValue}
                                        stroke={style.titleColor}
                                        strokeWidth={medianLineWidth}
                                    />
                                </Group>
                            );
                        }
                    })}
                    <AxisLeft
                        scale={yScale}
                        label={yAxisLabel}
                        labelProps={{
                            fill: "#000",
                            textAnchor: "middle",
                            fontSize: axisFontSize,
                            fontFamily: "Arial",
                        }}
                        labelOffset={30}
                    />
                    <AxisBottom
                        top={yScale(min)}
                        scale={xScale}
                        label={xAxisLabel}
                        labelProps={{
                            fill: "#000",
                            textAnchor: "middle",
                            fontSize: axisFontSize,
                            fontFamily: "Arial",
                        }}
                        labelOffset={15}
                    />
                </Group>
            </svg>
        </Paper>
    );

};

function calculateQuartiles(data: number[]) {
    if (data.length === 1) {
        return {
            firstQuartile: data[0],
            median: data[0],
            thirdQuartile: data[0],
        };
    }
    const sortedData = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sortedData.length / 2);
    const isEven = sortedData.length % 2 === 0;

    // If even number of data points, median is average of two middle values
    const median = isEven
        ? (sortedData[mid] + sortedData[mid - 1]) / 2
        : sortedData[mid];

    const firstQuartile = sortedData[Math.floor((mid - 1) / 2)];
    const thirdQuartile = sortedData[Math.ceil((sortedData.length + mid - 1) / 2)];

    return { firstQuartile, median, thirdQuartile };
}


export const LengthOfStayMedianTable: React.FC<{ tableData: LengthOfStayMedianRow[]; acuityMedianMinutes: number; style: LengthOfStayStyle }> = ({ tableData, acuityMedianMinutes, style }) => {

    const titleText = style.title;
    const titleColor = style.titleColor;
    const titleBackground = style.titleBackground;



    return (
        <Paper sx={{ width: "auto", overflow: "hidden", display: "inline-block" }}>
            <Typography
                variant="h6"
                sx={{
                    padding: 2,
                    backgroundColor: titleBackground,
                    color: titleColor,
                    textAlign: "center"
                }}
            >
                {titleText} Median LOS: {acuityMedianMinutes} mins
            </Typography>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Chief Complaint</TableCell>
                            <TableCell align="right">Median LOS (minutes)</TableCell>
                            <TableCell align="right">Hospital</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tableData.map((row, index) => (
                            <TableRow key={index} hover role="checkbox" tabIndex={-1}>
                                <TableCell>{row.chiefComplaint}</TableCell>
                                <TableCell align="right">{row.medianLosMinutes}</TableCell>
                                <TableCell align="right">{row.hospital}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    );
}

export const LengthOfStayTransportsList: React.FC<LengthOfStayTransportsListProps> = ({ data }) => {

    const columns: GridColDef[] = [
        { field: "triage_acuity", headerName: "Acuity", minWidth: 100, flex: 0.5 },
        { field: "chief_complaint", headerName: "Chief Complaint", minWidth: 200, flex: 2 },
        { field: "length_of_stay", headerName: "Length of Stay", minWidth: 100, flex: 1 },
    ];

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
            <Typography variant="h5" align="center" sx={{ ...tableColorStylesLight.header, padding: "16px 0" }}>Offsite Transports List</Typography>

            <DataGrid
                rows={data}
                columns={columns}
                autoHeight
                getRowId={(row) => row.patient_encounter_uuid}
                hideFooter
            />
        </Paper>
    );
};
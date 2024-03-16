import React from "react";
import { AcuityCountPerDay, OffsiteTransportEntry } from "../../interfaces/PosteventDashboard";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";
import { Group } from "@visx/group";
import { BarStack } from "@visx/shape";
import { triageColorStyles } from "../../constants/colorPalettes";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { timeParse, timeFormat } from "d3-time-format";
import { Table, TableBody, TableCell, TableHead, TableRow, Box, TableContainer, Paper, Typography } from "@mui/material";
import { tableColorStylesLight, offsiteTransportColorStyles } from "../../constants/colorPalettes";
import { StyledTableCell } from "../StyledTableComponents";
import { DataGrid } from "@mui/x-data-grid";



export const PatientEncounterCountByDayStackedBarChart: React.FC<{
    acuityCountPerDay: AcuityCountPerDay;
    displayCounts?: boolean;
}> = (
    { acuityCountPerDay, displayCounts = true }
) => {

        const keys = displayCounts
            ? ["countWhite", "countGreen", "countYellow", "countRed"]
            : ["percWhite", "percGreen", "percYellow", "percRed"];


        const transformedData = Object.entries(acuityCountPerDay).map(([date, counts]) => {
            return {
                date,
                ...(displayCounts ? {
                    countWhite: counts.countWhite,
                    countGreen: counts.countGreen,
                    countYellow: counts.countYellow,
                    countRed: counts.countRed
                } : {
                    percWhite: counts.percWhite,
                    percGreen: counts.percGreen,
                    percYellow: counts.percYellow,
                    percRed: counts.percRed
                }),
                totalCounts: counts.totalCounts,
            };
        });

        const yAxisLabel = displayCounts ? "Counts" : "Percentage (%)";
        const chartTitle = displayCounts ? "Acuity Counts By Day" : "Acuity Percentages By Day";

        const width = 300;
        const height = 300;

        const margin = { top: 50, bottom: 35, left: 50, right: 20 };

        const xScale = scaleBand({
            range: [0, width - margin.left - margin.right],
            round: true,
            domain: transformedData.map((d) => d.date),
            padding: 0.2,
        });

        const yScale = scaleLinear({
            range: [height - margin.bottom - margin.top, 0],
            round: true,
            domain: displayCounts ? [0, Math.max(...transformedData.map(d => d.totalCounts))] : [0, 100],
        });

        const parseDate = timeParse("%Y-%m-%d");
        const formatDate = timeFormat("%b %d");
        const formatAxisDate = (date: string) => {
            const d = parseDate(date);
            return d ? formatDate(d) : date;
        };

        const getColor = (key: string) => {
            const acuityKey = key.replace("count", "").replace("perc", "").toLowerCase();
            if (Object.keys(triageColorStyles).includes(acuityKey)) {
                const colorStyle = triageColorStyles[acuityKey as keyof typeof triageColorStyles];
                return colorStyle.backgroundColor;
            } else {
                console.error(`No color style found for key: '${key}', derived acuityKey: '${acuityKey}'`);
                return "#000"; // Fallback color
            }
        };


        return (<Paper elevation={3} sx={{ padding: "1rem", minHeight: `${height}px`, minWidth: `${width}px` }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                {chartTitle}
            </Typography>
            <svg width={width} height={height} overflow={"visible"}>
                {/* Chart content*/}
                <Group left={margin.left} top={margin.top}>
                    <BarStack
                        data={transformedData}
                        keys={keys}
                        x={(d) => d.date}
                        xScale={xScale}
                        yScale={yScale}
                        color={getColor}
                    >
                        {(barStacks) =>
                            barStacks.map((barStack) =>
                                barStack.bars.map((bar) => (
                                    <rect
                                        key={`bar-stack-${barStack.index}-${bar.index}`}
                                        x={bar.x}
                                        y={bar.y}
                                        height={bar.height}
                                        width={bar.width}
                                        fill={bar.color}
                                        stroke="black"
                                        strokeWidth={1}
                                    />
                                ))
                            )
                        }
                    </BarStack>

                    {/* Conditionally render totals only if displaying counts */}
                    {displayCounts && transformedData.map(d => {
                        const x = xScale(d.date);
                        const y = yScale(d.totalCounts);

                        return (
                            <Text
                                key={`text-${d.date}`}
                                x={x ? x + xScale.bandwidth() / 2 : 0}
                                y={y - 10}
                                textAnchor="middle"
                            >
                                {d.totalCounts}
                            </Text>
                        );
                    })}
                </Group>
                <AxisLeft
                    scale={yScale}
                    left={margin.left}
                    top={margin.top}
                    label={yAxisLabel}
                    stroke="#000"
                    tickStroke="#000"
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 12,
                        textAnchor: "end",
                    })}
                    labelProps={{
                        fontSize: 14,
                        fill: "#000",
                        textAnchor: "middle",
                    }}
                />
                <AxisBottom
                    scale={xScale}
                    top={height - margin.bottom}
                    left={margin.left}
                    label="Day"
                    stroke="#000"
                    tickStroke="#000"
                    tickFormat={formatAxisDate}
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 12,
                        textAnchor: "middle",
                    })}
                    labelProps={{
                        fontSize: 14,
                        fill: "#000",
                        textAnchor: "middle",
                    }}
                />
            </svg>
        </Paper >
        );

    };

export const PatientEncounterCountByDayTable: React.FC<{ acuityCountPerDay: AcuityCountPerDay }> = ({ acuityCountPerDay }) => {

    let totalRed = 0;
    let totalGreen = 0;
    let totalYellow = 0;
    let totalWhite = 0;

    Object.values(acuityCountPerDay).forEach(dayCounts => {
        totalRed += dayCounts.countRed;
        totalGreen += dayCounts.countGreen;
        totalYellow += dayCounts.countYellow;
        totalWhite += dayCounts.countWhite;
    });

    const countBoxStyle = {
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "30px",
        border: "1px solid black",
        margin: "0px",
        fontSize: "16px",
        fontWeight: "bold",
    };

    // Create styles for each box color
    const countBoxStyleRed = {
        ...countBoxStyle,
        backgroundColor: triageColorStyles.red.backgroundColor,
        color: triageColorStyles.red.color,
    };

    const countBoxStyleYellow = {
        ...countBoxStyle,
        backgroundColor: triageColorStyles.yellow.backgroundColor,
        color: triageColorStyles.yellow.color,
    };

    const countBoxStyleGreen = {
        ...countBoxStyle,
        backgroundColor: triageColorStyles.green.backgroundColor,
        color: triageColorStyles.green.color,
    };

    const countBoxStyleWhite = {
        ...countBoxStyle,
        backgroundColor: triageColorStyles.white.backgroundColor,
        color: triageColorStyles.white.color,
    };

    return (
        <TableContainer component={Paper}>
            <Table size="small" aria-label="encounter counts">
                <TableHead>
                    <TableRow sx={{ ...tableColorStylesLight.header, "& > *": tableColorStylesLight.header }}>
                        <TableCell colSpan={2} align="center" sx={{ ...tableColorStylesLight.header }}>Acuity Counts By Day</TableCell>
                    </TableRow>
                    <TableRow sx={{ ...tableColorStylesLight.subHeader }}>
                        <StyledTableCell align="center" sx={{ ...tableColorStylesLight.subHeader }}>Date</StyledTableCell>
                        <StyledTableCell align="center" sx={{ ...tableColorStylesLight.subHeader }}>Counts</StyledTableCell>
                    </TableRow>
                </TableHead>
                {/* Counts by day */}
                <TableBody>
                    {Object.entries(acuityCountPerDay).map(([day, counts]) => (
                        <TableRow key={day} sx={{
                            "&:nth-of-type(odd)": tableColorStylesLight.oddRow,
                            "&:nth-of-type(even)": tableColorStylesLight.evenRow,
                            "&:last-child td, &:last-child th": { border: 0 }
                        }}>
                            <TableCell component="th" scope="row">
                                {formatDate(day)}
                            </TableCell>
                            <TableCell>
                                <Box display="flex">
                                    <Box flex={1} sx={{ ...countBoxStyleRed }}>
                                        {counts.countRed}
                                    </Box>
                                    <Box flex={1} sx={{ ...countBoxStyleGreen }}>
                                        {counts.countGreen}
                                    </Box>
                                </Box>
                                <Box display="flex">
                                    <Box flex={1} sx={{ ...countBoxStyleYellow }}>
                                        {counts.countYellow}
                                    </Box>
                                    <Box flex={1} sx={{ ...countBoxStyleWhite }}>
                                        {counts.countWhite}
                                    </Box>
                                </Box>
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* Subtotals row */}
                    <TableRow>
                        <StyledTableCell sx={{ ...tableColorStylesLight.subHeader }}>Subtotals</StyledTableCell>
                        <StyledTableCell sx={{ ...tableColorStylesLight.subHeader }}>
                            <Box display="flex">
                                <Box flex={1} sx={{ ...countBoxStyleRed }}>{totalRed}</Box>
                                <Box flex={1} sx={{ ...countBoxStyleGreen }}>{totalGreen}</Box>
                            </Box>
                            <Box display="flex">
                                <Box flex={1} sx={{ ...countBoxStyleYellow }}>{totalYellow}</Box>
                                <Box flex={1} sx={{ ...countBoxStyleWhite }}>{totalWhite}</Box>
                            </Box>
                        </StyledTableCell>
                    </TableRow>
                    {/* Total row */}
                    <TableRow>
                        <StyledTableCell align="left">Total</StyledTableCell>
                        <StyledTableCell align="center">{totalRed + totalGreen + totalYellow + totalWhite}</StyledTableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(
        "en-US",
        {
            weekday: "short",
            month: "short",
            day: "numeric",
        }
    );
};

export const OffsiteTransportBreakdownSideBarChart: React.FC<{
    offsiteTransportCounts: { ambulance: number, private: number, nonEmergency: number } | null
}> = ({ offsiteTransportCounts }) => {

    if (!offsiteTransportCounts) {
        return null;
    }

    const chartWidth = 400;
    const chartHeight = 200;

    const margin = { top: 20, bottom: 10, left: 80, right: 50 };

    const yScale = scaleBand({
        range: [0, chartHeight - margin.top - margin.bottom],
        round: true,
        domain: Object.keys(offsiteTransportCounts),
        padding: 0.5,
    });

    const xScale = scaleLinear({
        range: [0, chartWidth - margin.left - margin.right],
        round: true,
        domain: [0, Math.max(...Object.values(offsiteTransportCounts))],
    });

    return (
        <Paper elevation={3} sx={{ padding: "1rem", minHeight: `${chartHeight}px`, minWidth: `${chartWidth}px` }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                Offsite Transport Breakdown
            </Typography>
            <svg width={chartWidth} height={chartHeight} overflow="visible">
                <Group left={margin.left} top={margin.top}>
                    {Object.entries(offsiteTransportCounts).map(([transportType, count]) => {
                        const y = yScale(transportType);
                        if (y === undefined) {
                            console.error(`y is undefined for transportType: ${transportType}`);
                            return null;
                        }
                        const barWidth = xScale(count);
                        return (<>
                            <rect
                                key={transportType}
                                x={0}
                                y={y}
                                height={yScale.bandwidth()}
                                width={barWidth}
                                fill={offsiteTransportColorStyles[transportType].backgroundColor}
                                stroke="black"
                                strokeWidth={1}
                            />
                            <text
                                x={barWidth + 5}
                                y={y + yScale.bandwidth() / 2}
                                dy=".35em"
                                fill="#000"
                                fontSize={12}
                                textAnchor="start"
                            >{count}</text>
                        </>

                        );
                    })}
                </Group>
                <AxisLeft
                    scale={yScale}
                    top={margin.top}
                    left={margin.left}
                    stroke="#000"
                    tickStroke="#000"
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 12,
                        textAnchor: "end",
                        style: { textTransform: "capitalize" }
                    })}
                />
                <AxisBottom
                    scale={xScale}
                    top={chartHeight - margin.bottom}
                    left={margin.left}
                    tickValues={xScale.ticks().filter(Number.isInteger)}
                    tickFormat={(value) => {
                        const numericValue = typeof value === "number" ? value : (value as { valueOf: () => number }).valueOf();
                        return numericValue.toString();
                    }}
                    stroke="#000"
                    tickStroke="#000"
                    tickLabelProps={() => ({
                        fill: "#000",
                        fontSize: 12,
                        textAnchor: "middle",
                    })}
                />
            </svg>
        </Paper>
    );
};


export const OffsiteTransportList: React.FC<{ offsiteTransportEntries: OffsiteTransportEntry[] | null }> = ({ offsiteTransportEntries }) => {

    if (!offsiteTransportEntries) {
        return null;
    }

    const columns = [
        { field: "date", headerName: "Date", width: 150 },
        { field: "timeLeft", headerName: "Time Left", width: 100 },
        { field: "method", headerName: "Method", width: 150 },
        { field: "chiefComplaint", headerName: "Chief Complaint", width: 350 },
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
            <Typography variant="h5" align="center" sx={{ ...tableColorStylesLight.header, padding: "16px 0" }}>Offsite Transport List</Typography>
            <DataGrid
                rows={offsiteTransportEntries}
                columns={columns}
                pageSize={5}
                rowsPerPageOptions={[5]}
                autoHeight
                disableSelectionOnClick
            />
        </Paper>
    );
};

type TransportTypes = "Ambulance" | "Private Vehicle";

type TransportData = {
    [key in TransportTypes]?: number;
};

type DayData = {
    date: string;
    totalCount: number;
} & TransportData;


export const OffsiteTransportStackedBarChart: React.FC<{ offsiteTransportsPerDayCount: Record<string, Record<string, number>> | null }> = ({ offsiteTransportsPerDayCount }) => {
    if (!offsiteTransportsPerDayCount) {
        return null;
    }

    const allTransportTypes = ["Ambulance", "Private Vehicle"];
    console.log("offsiteTransportsPerDayCount: ", offsiteTransportsPerDayCount)

    // Convert data to an array format that can be used with visx
    const data: DayData[] = Object.keys(offsiteTransportsPerDayCount).map(date => {
        const dayData = offsiteTransportsPerDayCount[date];
        const transportData: TransportData = allTransportTypes.reduce<TransportData>((accumulator, currentType) => {
            accumulator[currentType as TransportTypes] = dayData[currentType] ?? 0;
            return accumulator;
        }, {});

        // Calculate the total count for the day
        const totalCount = Object.values(transportData).reduce((total, count) => total + (count ?? 0), 0);

        return {
            date,
            ...transportData,
            totalCount,
        };
    });

    const parseDate = timeParse("%Y-%m-%d");
    const formatDate = timeFormat("%b %d");
    const formatAxisDate = (date: string) => {
        const d = parseDate(date);
        return d ? formatDate(d) : date;
    };


    // Define the dimensions and margins of the chart
    const width = 400;
    const height = 300;
    const margin = { top: 20, bottom: 90, left: 60, right: 20 };

    // Define scales
    const dateScale = scaleBand({
        range: [0, width - margin.left - margin.right],
        round: true,
        domain: data.map(d => d.date),
        padding: 0.2,
    });

    const maxCount = Math.max(
        ...data.map(d =>
            allTransportTypes.reduce((total, type) => total + (d[type as TransportTypes] || 0), 0)
        )
    );
    const transportScale = scaleLinear({
        domain: [0, maxCount],
        range: [height - margin.bottom - margin.top, 0],
        round: true,
    });


    const colorScale = scaleOrdinal({
        domain: ["Ambulance", "Private Vehicle"],
        range: [offsiteTransportColorStyles.ambulance.backgroundColor, offsiteTransportColorStyles.private.backgroundColor],
    });

    dateScale.rangeRound([margin.left, width - margin.right]);
    transportScale.range([height - margin.bottom, margin.top]);

    const yTickValues = [];
    for (let i = 0; i <= maxCount; i++) {
        yTickValues.push(i);
    }

    return (
        <Paper style={{ width, height }}>
            <Typography variant="h5" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
                Offsite Transports by Day
            </Typography>
            <svg width={width} height={height} overflow={"visible"}>
                <Group>
                    <BarStack
                        data={data}
                        keys={colorScale.domain()}
                        x={d => d.date}
                        xScale={dateScale}
                        yScale={transportScale}
                        color={colorScale}
                    >
                        {barStacks =>
                            barStacks.map(barStack => (
                                <>
                                    {barStack.bars.map(bar => (
                                        <rect
                                            key={`bar-stack-${barStack.index}-${bar.index}`}
                                            x={bar.x}
                                            y={bar.y}
                                            height={bar.height}
                                            width={bar.width}
                                            fill={bar.color}
                                            stroke="black"
                                            strokeWidth={1}
                                        />
                                    ))}
                                </>
                            ))
                        }
                    </BarStack>
                    {data.map(d => {
                        const x = (dateScale(d.date) ?? 0) + dateScale.bandwidth() / 2;
                        const y = transportScale(d.totalCount) - 10;

                        return (
                            <text
                                key={`total-${d.date}`}
                                x={x}
                                y={y}
                                fill="black"
                                fontSize="12"
                                textAnchor="middle"
                                alignmentBaseline="baseline"
                            >
                                {d.totalCount}
                            </text>
                        );
                    })}

                    <AxisLeft
                        scale={transportScale}
                        left={margin.left}
                        label={"Count"}
                        tickValues={yTickValues}
                        tickLabelProps={() => ({
                            fill: "#000",
                            fontSize: 12,
                            textAnchor: "end",
                        })}
                        labelProps={{
                            fontSize: 14,
                            fill: "#000",
                            textAnchor: "middle",
                        }}
                    />

                    <AxisBottom
                        top={height - margin.bottom}
                        scale={dateScale}
                        tickFormat={formatAxisDate}
                        label={"Day"}
                        tickLabelProps={() => ({
                            fill: "#000",
                            fontSize: 12,
                            textAnchor: "end",
                        })}
                        labelProps={{
                            fontSize: 14,
                            fill: "#000",
                            textAnchor: "middle",
                        }}
                    />


                </Group>
            </svg>
        </Paper>
    );
};

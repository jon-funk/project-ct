import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { ChiefComplaintCountsTable } from "./ChiefComplaintCountsTable";
import { PatientEncounterAcuityBarChart } from "./PatientEncounterAcuityChart";
import { ChiefComplaintEncounterCountsTable } from "./ChiefComplaintEncounterCountsTable";
import { LengthOfStayCountsTable } from "./LengthOfStayCountsTable";
import { CommonPresentationsAndTransportsTables } from "./TopTenCommonPresentationsTable";
import { ChiefComplaintCountsTableRowData } from "../../interfaces/ChiefComplaintCountsTableProps";
import { LengthOfStayCountsTableProps } from "../../interfaces/LengthOfStayCountsTableProps";
import { TopTenCommonPresentationsTableProps } from "../../interfaces/TopTenCommonPresentationsTableProps";
import { AcuityCountsData } from "../../interfaces/AcuityCountsData";
import { AcuityCountPerDay, OffsiteTransportCountTotals, OffsiteTransportEntry } from "../../interfaces/PosteventDashboard";
import { PatientEncounterCountByDayStackedBarChart, PatientEncounterCountByDayTable, OffsiteTransportBreakdownSideBarChart, OffsiteTransportList, OffsiteTransportStackedBarChart } from "./PatientEncounterCountsByDay";
import { triageColorStyles, offsiteTransportColorStyles, tableColorStylesLight } from "../../constants/colorPalettes";
import { LengthOfStayWhiskerBoxPlot } from "./LengthOfStayComponents";
import { LengthOfStayDashboardProps } from "../../interfaces/PosteventDashboard";

interface PostFestivalSummaryProps {
    selectedYear: string;
    acuityCountsData: AcuityCountsData[];
    chiefComplaintEncounterCountsData: number[];
    chiefComplaintCountRows: ChiefComplaintCountsTableRowData[];
    lengthOfStayData: LengthOfStayCountsTableProps;
    commonPresentationData: TopTenCommonPresentationsTableProps | null;
}

export const PostFestivalSummaryComponent: React.FC<PostFestivalSummaryProps> = ({
    acuityCountsData,
    chiefComplaintEncounterCountsData,
    chiefComplaintCountRows,
    lengthOfStayData,
    commonPresentationData,
}) => {
    return <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
        <Grid>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <PatientEncounterAcuityBarChart acuityCountsData={acuityCountsData} />
                </Grid>
                <Grid item>
                    <ChiefComplaintEncounterCountsTable encounterCounts={chiefComplaintEncounterCountsData} />
                </Grid>
            </Grid>
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={6}>
            <ChiefComplaintCountsTable rows={chiefComplaintCountRows} />
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={6}>
            <LengthOfStayCountsTable {...lengthOfStayData} />
        </Grid>
        {commonPresentationData && (<CommonPresentationsAndTransportsTables
            commonPresentationsDataRed={commonPresentationData?.commonPresentationsDataRed}
            transportsDataRed={commonPresentationData?.transportsDataRed}
            commonPresentationsDataYellow={commonPresentationData?.commonPresentationsDataYellow}
            transportsDataYellow={commonPresentationData?.transportsDataYellow} />)}
    </Grid>;
};



export const SelectYearPrompt = () => (
    <Box sx={{ p: 3, textAlign: "center" }}>
        <Typography variant="h6">Please select a year to get started.</Typography>
    </Box>
);


export interface PatientEncountersDashboardComponentProps {
    selectedYear: string;
    acuityCountPerDay: AcuityCountPerDay;
}


export const PatientEncountersDashboardComponent: React.FC<PatientEncountersDashboardComponentProps> = (
    {
        acuityCountPerDay,
    }
) => {
    return <>
        <Grid container spacing={2} style={{ padding: "1rem", justifyContent: "center" }}>
            <Grid item xs={12} md={6} lg={5} xl={3} sx={{ maxWidth: "400px" }}>
                <PatientEncounterCountByDayStackedBarChart acuityCountPerDay={acuityCountPerDay} />
            </Grid>
            <Grid item xs={12} md={6} lg={5} xl={3} sx={{ maxWidth: "400px" }}>
                <PatientEncounterCountByDayStackedBarChart acuityCountPerDay={acuityCountPerDay} displayCounts={false} />
            </Grid>

            <Grid item xs={12} md={6} lg={4} xl={2} sx={{ maxWidth: "400px" }}>
                <PatientEncounterCountByDayTable acuityCountPerDay={acuityCountPerDay} />
            </Grid>
            <Grid item xs={2}>
                <TriageAcuityLegend triageColorStyles={triageColorStyles} />
            </Grid>
        </Grid>
    </>
};

export interface OffsiteTransportsDashboardComponentProps {
    offsiteTransportCounts: OffsiteTransportCountTotals | null;
    offsiteTransportEntries: OffsiteTransportEntry[] | null;
    offsiteTransportsPerDayCount: Record<string, Record<string, number>> | null;
}

export const OffsiteTransportsDashboardComponent: React.FC<OffsiteTransportsDashboardComponentProps> = ({ offsiteTransportCounts, offsiteTransportEntries, offsiteTransportsPerDayCount }) => {


    return <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
        <Grid item xs={12} md={8} lg={7} xl={6} sx={{ maxWidth: "400px" }}>
            <OffsiteTransportBreakdownSideBarChart offsiteTransportCounts={offsiteTransportCounts} />
        </Grid>
        <Grid item xs={12} md={9} lg={8} xl={7} sx={{ maxWidth: "800px" }}>
            <OffsiteTransportList offsiteTransportEntries={offsiteTransportEntries} />
        </Grid>

        <Grid item xs={12} md={8} lg={7} xl={6} sx={{ maxWidth: "400px" }}>
            <OffsiteTransportStackedBarChart offsiteTransportsPerDayCount={offsiteTransportsPerDayCount} />
        </Grid>
        <Grid item xs={2}>
            <OffsiteTransportLegend transportColorStyles={offsiteTransportColorStyles} />
        </Grid>
    </Grid>
}


export const LengthOfStayDashboardComponent: React.FC<LengthOfStayDashboardProps> = ({ losBoxPlotData }) => {

    // Styles for the box plots
    const styleLosAll = {
        title: "All Acuity Levels",
        titleColor: tableColorStylesLight.subHeader.color,
        titleBackground: tableColorStylesLight.subHeader.backgroundColor,
        boxFill: tableColorStylesLight.subHeader.backgroundColor,
        boxStroke: "#000000",
    };

    const styleLosRed = {
        title: "Red Acuity Level",
        titleColor: triageColorStyles.red.color,
        titleBackground: triageColorStyles.red.backgroundColor,
        boxFill: triageColorStyles.red.backgroundColor,
        boxStroke: "#000000",
    };

    const styleLosYellow = {
        title: "Yellow Acuity Level",
        titleColor: triageColorStyles.yellow.color,
        titleBackground: triageColorStyles.yellow.backgroundColor,
        boxFill: triageColorStyles.yellow.backgroundColor,
        boxStroke: "#000000",
    };

    const styleLosGreen = {
        title: "Green Acuity Level",
        titleColor: triageColorStyles.green.color,
        titleBackground: triageColorStyles.green.backgroundColor,
        boxFill: triageColorStyles.green.backgroundColor,
        boxStroke: "#000000",
    };

    const styleLosWhite = {
        title: "White Acuity Level",
        titleColor: triageColorStyles.white.color,
        titleBackground: triageColorStyles.white.backgroundColor,
        boxFill: triageColorStyles.white.backgroundColor,
        boxStroke: "#000000",
    };

    console.log("losBoxPlotData:", losBoxPlotData);


    return <Grid container spacing={2} style={{ padding: 1 + "rem" }} >
        <Grid item xs={12} md={8} lg={8} xl={4}>
            <LengthOfStayWhiskerBoxPlot boxPlotData={losBoxPlotData.all} style={styleLosAll} />
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={4}>
            <LengthOfStayWhiskerBoxPlot boxPlotData={losBoxPlotData.red} style={styleLosRed} />
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={4}>
            <LengthOfStayWhiskerBoxPlot boxPlotData={losBoxPlotData.yellow} style={styleLosYellow} />
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={4}>
            <LengthOfStayWhiskerBoxPlot boxPlotData={losBoxPlotData.green} style={styleLosGreen} />
        </Grid>
        <Grid item xs={12} md={8} lg={8} xl={4}>
            <LengthOfStayWhiskerBoxPlot boxPlotData={losBoxPlotData.white} style={styleLosWhite} />
        </Grid>
    </Grid >
}

interface ColorStyle {
    backgroundColor: string;
    color: string;
}

interface TriageAcuityLegendProps {
    triageColorStyles: { [key: string]: ColorStyle };
    legendStyle?: React.CSSProperties;
}

export const TriageAcuityLegend: React.FC<TriageAcuityLegendProps> = ({ triageColorStyles }) => {

    const boxHeight = 25;
    const boxWidth = 75;
    const spaceBetweenBoxes = 5;
    const titlePaddingTop = 15;
    const svgWidth = Math.max(200, boxWidth);

    const svgHeight = Object.keys(triageColorStyles).length * (boxHeight + spaceBetweenBoxes) + titlePaddingTop * 2;

    return (
        <svg width={svgWidth} height={svgHeight} style={{ display: "block", margin: "auto" }}>
            {/* Title */}
            <text x={svgWidth / 2} y={titlePaddingTop} textAnchor="middle" fontWeight="bold" fontSize="16">
                Triage Acuity Legend
            </text>
            {/* Legend boxes */}
            {Object.keys(triageColorStyles).map((level, index) => {
                const yPosition = index * (boxHeight + spaceBetweenBoxes) + titlePaddingTop * 2;
                return (
                    <g key={level} transform={`translate(${(svgWidth - boxWidth) / 2}, ${yPosition})`}>
                        <rect width={boxWidth} height={boxHeight} fill={triageColorStyles[level].backgroundColor} stroke="black" />
                        <text x={boxWidth / 2} y={boxHeight / 2} textAnchor="middle" dy="0.35em" fill={triageColorStyles[level].color}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}


interface OffsiteTransportLegendProps {
    transportColorStyles: { [key: string]: ColorStyle };
    legendStyle?: React.CSSProperties;
}

export const OffsiteTransportLegend: React.FC<OffsiteTransportLegendProps> = ({ transportColorStyles }) => {

    const boxHeight = 25;
    const boxWidth = 120;
    const spaceBetweenBoxes = 5;
    const titlePaddingTop = 15;
    const svgWidth = Math.max(200, boxWidth);

    const svgHeight = Object.keys(transportColorStyles).length * (boxHeight + spaceBetweenBoxes) + titlePaddingTop * 2;

    return (
        <svg width={svgWidth} height={svgHeight} style={{ display: "block", margin: "auto" }}>
            {/* Title */}
            <text x={svgWidth / 2} y={titlePaddingTop} textAnchor="middle" fontWeight="bold" fontSize="16">
                Offsite Transport Legend
            </text>
            {/* Legend boxes */}
            {Object.keys(transportColorStyles).map((level, index) => {
                const yPosition = index * (boxHeight + spaceBetweenBoxes) + titlePaddingTop * 2;
                return (
                    <g key={level} transform={`translate(${(svgWidth - boxWidth) / 2}, ${yPosition})`}>
                        <rect width={boxWidth} height={boxHeight} fill={transportColorStyles[level].backgroundColor} stroke="black" />
                        <text x={boxWidth / 2} y={boxHeight / 2} textAnchor="middle" dy="0.35em" fill={transportColorStyles[level].color}>
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                        </text>
                    </g>
                );
            })}
        </svg>
    );
}
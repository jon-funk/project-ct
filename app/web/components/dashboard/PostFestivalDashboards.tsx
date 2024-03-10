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
import { AcuityCountPerDay } from "../../interfaces/PosteventDashboard";
import { PatientEncounterCountByDayStackedBarChart, PatientEncounterCountByDayTable, OffsiteTransportBreakdownSideBarChart } from "./PatientEncounterCountsByDay";
import { triageColorStyles, offsiteTransportColorStyles } from "../../constants/colorPalettes";

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

export const OffsiteTransportsDashboardComponent = () => {

    const offsiteTransportCounts = {
        ambulance: 3,
        private: 4,
        nonEmergency: 7,
    }

    return <Grid container spacing={2} style={{ padding: "1rem", justifyContent: "center" }}>
        <Grid item xs={12} md={6} lg={5} xl={3} sx={{ maxWidth: "400px" }}>
            <OffsiteTransportBreakdownSideBarChart offsiteTransportCounts={offsiteTransportCounts} />
        </Grid>
        <Grid item xs={12} md={6} lg={5} xl={3} sx={{ maxWidth: "400px" }}>
        </Grid>

        <Grid item xs={12} md={6} lg={4} xl={2} sx={{ maxWidth: "400px" }}>
        </Grid>
        <Grid item xs={2}>
            <OffsiteTransportLegend transportColorStyles={offsiteTransportColorStyles} />
        </Grid>
    </Grid>
}

export const PatientLengthOfStayDashboardComponent = () => {
    return <Box>
    </Box>;
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
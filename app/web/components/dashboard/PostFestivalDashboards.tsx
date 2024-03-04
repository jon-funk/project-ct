import React from "react";
import { Typography, Grid } from "@mui/material";
import { ChiefComplaintCountsTable } from "./ChiefComplaintCountsTable";
import { PatientEncounterAcuityBarChart } from "./PatientEncounterAcuityChart";
import { ChiefComplaintEncounterCountsTable } from "./ChiefComplaintEncounterCountsTable";
import { LengthOfStayCountsTable } from "./LengthOfStayCountsTable";
import { CommonPresentationsAndTransportsTables } from "./TopTenCommonPresentationsTable";
import { ChiefComplaintCountsTableRowData } from "../../interfaces/ChiefComplaintCountsTableProps";
import { LengthOfStayCountsTableProps } from "../../interfaces/LengthOfStayCountsTableProps";
import { TopTenCommonPresentationsTableProps } from "../../interfaces/TopTenCommonPresentationsTableProps";
import { AcuityCountsData } from "../../interfaces/AcuityCountsData";
import { Box } from "@mui/material";
import { AcuityCountPerDay } from "../../interfaces/PosteventDashboard";
import { PatientEncounterCountByDayStackedBarChart } from "./PatientEncounterCountsByDay";

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
        <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
            <Grid>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <PatientEncounterCountByDayStackedBarChart acuityCountPerDay={acuityCountPerDay} />
                    </Grid>
                    <Grid item>
                        <PatientEncounterCountByDayStackedBarChart acuityCountPerDay={acuityCountPerDay} displayCounts={false} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    </>
};

export const OffsiteTransportsDashboardComponent = () => {
    return <Box>
    </Box>;
}

export const PatientLengthOfStayDashboardComponent = () => {
    return <Box>
    </Box>;
}
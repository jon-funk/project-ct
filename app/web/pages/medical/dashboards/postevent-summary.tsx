import React, { useState } from "react";
import { Container, Typography, Grid } from "@mui/material";
import { ProtectedRoute } from "../../../contexts/auth";
import { ChiefComplaintCountsTable } from "../../../components/dashboard/ChiefComplaintCountsTable";
import { createMockChiefComplainCountTableData } from "../../../utils/mockDataGeneration";
import { YearSelectionField } from "../../../components/dashboard/YearSelectionField";
import { PatientEncounterAcuityBarChart } from "../../../components/dashboard/PatientEncounterAcuityChart";
import { ChiefComplaintEncounterCountsTable } from "../../../components/dashboard/ChiefComplaintEncounterCountsTable";
import { LengthOfStayCountsTable } from "../../../components/dashboard/LengthOfStayCountsTable";
import { generatePostFestivalLengthOfStayData, generatePostFestivalCommonPresentationsData } from "../../../utils/postfestivalDashboard";
import { PatientEncounterFormDataInterface } from "../../../interfaces/PatientEncounterFormDataInterface";
import { CommonPresentationsAndTransportsTables } from "../../../components/dashboard/TopTenCommonPresentationsTable";

/**
 * Rrepresents the dashboard for the post-event summary.
 * 
 * @returns The MedicalPostEventSummaryDashboard component
 */
const MedicalPostEventSummaryDashboard = () => {

    // TODO: Remove eslint-disable-next-line when API integration is complete
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [patientEncounters, setPatientEncounters] = useState<PatientEncounterFormDataInterface[]>([]);



    const chiefComplaintCountRows = createMockChiefComplainCountTableData(); // TODO: Replace with actual data when API integration is complete
    const { rowsDataCCCount, summaryRowsCCCount } = generatePostFestivalLengthOfStayData(patientEncounters);
    const { commonPresentationsDataRed, transportsDataRed, commonPresentationsDataYellow, transportsDataYellow } = generatePostFestivalCommonPresentationsData(patientEncounters);

    return (
        <Container>
            <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                <Grid item xs={12}>
                    <Typography variant="h3">Post-Event Summary Dashboard</Typography>
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <YearSelectionField />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <PatientEncounterAcuityBarChart />
                </Grid>
                <Grid item xs={12} sm={3} md={4}>
                    <ChiefComplaintEncounterCountsTable encounterCounts={[1, 2, 3, 4]} />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <ChiefComplaintCountsTable rows={chiefComplaintCountRows} />
                </Grid>
                <Grid item xs={12} md={8} lg={8}>
                    <LengthOfStayCountsTable rows={rowsDataCCCount} summaryRows={summaryRowsCCCount} />
                </Grid>
                <Grid item xs={12} md={4} lg={4}>
                    <CommonPresentationsAndTransportsTables
                        commonPresentationsDataRed={commonPresentationsDataRed}
                        transportsDataRed={transportsDataRed}
                        commonPresentationsDataYellow={commonPresentationsDataYellow}
                        transportsDataYellow={transportsDataYellow}
                    />
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProtectedRoute(MedicalPostEventSummaryDashboard);
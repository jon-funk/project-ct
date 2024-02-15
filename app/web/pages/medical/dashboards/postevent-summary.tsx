import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Typography, Grid } from "@mui/material";
import { ProtectedRoute } from "../../../contexts/auth";
import { ChiefComplaintCountsTable } from "../../../components/dashboard/ChiefComplaintCountsTable";
import { YearSelectionField } from "../../../components/dashboard/YearSelectionField";
import { PatientEncounterAcuityBarChart } from "../../../components/dashboard/PatientEncounterAcuityChart";
import { ChiefComplaintEncounterCountsTable } from "../../../components/dashboard/ChiefComplaintEncounterCountsTable";
import { LengthOfStayCountsTable } from "../../../components/dashboard/LengthOfStayCountsTable";
import {
    calculateChiefComplaintEncounterCountsData,
    calculatePostFestivalLengthOfStayData,
    calculateChiefComplaintEncounterCountsSummary,
    calculateCommonPresentationsAndTransports,
    calculateAcuityCountsData
} from "../../../utils/postfestivalDashboard";
import { CommonPresentationsAndTransportsTables } from "../../../components/dashboard/TopTenCommonPresentationsTable";
import { fetchPatientEncountersData } from "../../../utils/postfestivalDashboard";
import { MedicalDashboardConfigs } from "../../../constants/configs";
import { MedicalPostEventSummaryDashboardConfig } from "../../../interfaces/MedicalPostEventSummaryDashboardProps";
import { RenderErrorAlerts } from "../../../components/RenderErrorAlerts";
import { RenderSubmitAlert } from "../../../components/RenderSubmitAlert";
import { SubmitAlert } from "../../../interfaces/SubmitAlert";
import { PatientEncounterRow } from "../../../interfaces/PatientEncounterRow";
import { ChiefComplaintCountsTableRowData } from "../../../interfaces/ChiefComplaintCountsTableProps";
import { LengthOfStayCountsTableProps } from "../../../interfaces/LengthOfStayCountsTableProps";
import { TopTenCommonPresentationsTableProps } from "../../../interfaces/TopTenCommonPresentationsTableProps";
import { AcuityCountsData } from "../../../interfaces/AcuityCountsData";


/**
 * Rrepresents the dashboard for the post-event summary.
 * 
 * @returns The MedicalPostEventSummaryDashboard component
 */
const MedicalPostEventSummaryDashboard = () => {

    const [patientEncounters, setPatientEncounters] = useState<PatientEncounterRow[]>([]);
    const [apiAlert, setApiAlert] = useState<SubmitAlert | null>(null);
    const methods = useForm<MedicalPostEventSummaryDashboardConfig>();
    const { formState: { errors },
        control,
        setValue,
        watch, } = methods;

    const selectedYear = watch("selectedYear");

    // Calculated data
    const [chiefComplaintEncounterCountsData, setChiefComplaintEncounterCountsData] = useState<number[]>([]);
    const [chiefComplaintCountRows, setChiefComplaintCountRows] = useState<ChiefComplaintCountsTableRowData[]>([]);
    const [lengthOfStayData, setLengthOfStayData] = useState<LengthOfStayCountsTableProps>({ rows: [], summaryRows: [] });
    const [commonPresentationData, setCommonPresentationData] = useState<TopTenCommonPresentationsTableProps | null>(null);
    const [acuityCountsData, setAcuityCountsData] = useState<AcuityCountsData[]>([]);

    // When the year is selected, fetch the patient encounters for that year
    useEffect(() => {
        const fetchPatientEncounters = async () => {
            if (selectedYear) {
                // Get start and end dates for the selected year and set them in the form
                const { festivalStartDate, festivalEndDate } = MedicalDashboardConfigs[selectedYear];
                setValue("festivalStartDate", festivalStartDate);
                setValue("festivalEndDate", festivalEndDate);
                try {
                    const fetchedPatientEncounters = await fetchPatientEncountersData(festivalStartDate, festivalEndDate, setApiAlert);
                    setPatientEncounters(fetchedPatientEncounters);

                    // Calculate the data for the dashboard
                    const chiefComplaintEncounterCountsData = calculateChiefComplaintEncounterCountsData(patientEncounters);
                    setChiefComplaintEncounterCountsData(chiefComplaintEncounterCountsData);

                    const chiefComplaintCountRows = calculateChiefComplaintEncounterCountsSummary(patientEncounters);
                    setChiefComplaintCountRows(chiefComplaintCountRows);

                    const lengthOfStayData = calculatePostFestivalLengthOfStayData(patientEncounters);
                    setLengthOfStayData(lengthOfStayData);

                    const commonPresentationData = calculateCommonPresentationsAndTransports(patientEncounters);
                    setCommonPresentationData(commonPresentationData);

                    const acuityCountsData = calculateAcuityCountsData(patientEncounters);
                    setAcuityCountsData(acuityCountsData);

                } catch (error) {
                    console.error("Error fetching patient encounters: ", error);
                    setApiAlert({ type: "error", message: "Error fetching patient encounters" });
                }
            }
        };

        fetchPatientEncounters();
    }, [patientEncounters, selectedYear, setValue]);

    return (
        <Container>
            <FormProvider {...methods}>
                <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                    <Grid item xs={12}>
                        <Typography variant="h3">Post-Event Summary {selectedYear}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        {RenderErrorAlerts(errors)}
                        {RenderSubmitAlert(apiAlert)}
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <YearSelectionField control={control} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <PatientEncounterAcuityBarChart acuityCountsData={acuityCountsData} />
                    </Grid>
                    <Grid item xs={12} sm={3} md={4}>
                        <ChiefComplaintEncounterCountsTable encounterCounts={chiefComplaintEncounterCountsData} />
                    </Grid>
                    <Grid item xs={12} md={8} lg={8}>
                        <ChiefComplaintCountsTable rows={chiefComplaintCountRows} />
                    </Grid>
                    <Grid item xs={12} md={8} lg={8}>
                        <LengthOfStayCountsTable {...lengthOfStayData} />
                    </Grid>
                    <Grid item xs={12} md={4} lg={4}>
                        {commonPresentationData && (<CommonPresentationsAndTransportsTables
                            commonPresentationsDataRed={commonPresentationData?.commonPresentationsDataRed}
                            transportsDataRed={commonPresentationData?.transportsDataRed}
                            commonPresentationsDataYellow={commonPresentationData?.commonPresentationsDataYellow}
                            transportsDataYellow={commonPresentationData?.transportsDataYellow}
                        />)}
                    </Grid>
                </Grid>
            </FormProvider>
        </Container>
    );
};

export default ProtectedRoute(MedicalPostEventSummaryDashboard);
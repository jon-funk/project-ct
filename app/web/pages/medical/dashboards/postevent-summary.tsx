import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Grid, Box, useMediaQuery } from "@mui/material";
import { ProtectedRoute } from "../../../contexts/auth";
import {
    calculateChiefComplaintEncounterCountsData,
    calculatePostFestivalLengthOfStayData,
    calculateChiefComplaintEncounterCountsSummary,
    calculateCommonPresentationsAndTransports,
    calculateAcuityCountsData
} from "../../../utils/postfestivalDashboard";
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
import ProtectedNavbar from "../../../components/ProtectedNavbar";
import PostEventDashboardSidebar from "../../../components/dashboard/PostEventDashboardSidebar";
import { useTheme } from "@mui/material/styles";
import {
    PostFestivalSummaryComponent,
    PatientEncountersDashboardComponent,
    OffsiteTransportsDashboardComponent,
    PatientLengthOfStayDashboardComponent
} from "../../../components/dashboard/PostFestivalDashboards";
import { SelectYearPrompt } from "../../../components/dashboard/PostFestivalDashboards";



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
    const [selectedView, setSelectedView] = useState<string>("");

    const theme = useTheme();
    const breakpoints = {
        isXs: useMediaQuery(theme.breakpoints.only("xs")),
        isSm: useMediaQuery(theme.breakpoints.only("sm")),
        isMd: useMediaQuery(theme.breakpoints.only("md")),
        isLg: useMediaQuery(theme.breakpoints.only("lg")),
        isXl: useMediaQuery(theme.breakpoints.up("xl")),
    };


    const getCurrentBreakpoint = () => {
        if (breakpoints.isXl) return "xl";
        if (breakpoints.isLg) return "lg";
        if (breakpoints.isMd) return "md";
        if (breakpoints.isSm) return "sm";
        return "xs";
    };

    const currentBreakpoint = getCurrentBreakpoint();

    console.log("currentBreakpoint: ", currentBreakpoint);


    // Calculated data
    const [chiefComplaintEncounterCountsData, setChiefComplaintEncounterCountsData] = useState<number[]>([]);
    const [chiefComplaintCountRows, setChiefComplaintCountRows] = useState<ChiefComplaintCountsTableRowData[]>([]);
    const [lengthOfStayData, setLengthOfStayData] = useState<LengthOfStayCountsTableProps>({ rows: [], summaryRows: [] });
    const [commonPresentationData, setCommonPresentationData] = useState<TopTenCommonPresentationsTableProps | null>(null);
    const [acuityCountsData, setAcuityCountsData] = useState<AcuityCountsData[]>([]);

    // When the year is selected, fetch the patient encounters for that year
    useEffect(() => {

        if (selectedYear && selectedView === "") {
            setSelectedView("Summary");
        }

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
    }, [patientEncounters, selectedYear, setValue, selectedView, setApiAlert]);

    return (
        <>
            <ProtectedNavbar sx={{ zIndex: 1300 }} />
            <Box sx={{ display: "flex" }}>
                <PostEventDashboardSidebar control={control} methods={methods} onSelectView={setSelectedView} />
                <Box
                    component="main"
                    sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
                >
                    <Container maxWidth={false}>
                        <FormProvider {...methods}>
                            <Grid item xs={12}>
                                {RenderErrorAlerts(errors)}
                                {RenderSubmitAlert(apiAlert)}
                            </Grid>
                            {/* Conditional rendering based on whether a year is selected */}
                            {selectedView === "Summary" ? (
                                selectedYear ? (
                                    <PostFestivalSummaryComponent
                                        selectedYear={selectedYear}
                                        acuityCountsData={acuityCountsData}
                                        chiefComplaintEncounterCountsData={chiefComplaintEncounterCountsData}
                                        chiefComplaintCountRows={chiefComplaintCountRows}
                                        lengthOfStayData={lengthOfStayData}
                                        commonPresentationData={commonPresentationData}
                                    />
                                ) : (
                                    <SelectYearPrompt />
                                )
                            ) : selectedView === "Patient Encounters" ? (
                                <PatientEncountersDashboardComponent />
                            ) : selectedView === "Offsite Transports" ? (
                                <OffsiteTransportsDashboardComponent />
                            ) : selectedView === "Patient Length of Stay Times" ? (
                                <PatientLengthOfStayDashboardComponent />
                            ) : <SelectYearPrompt />}
                        </FormProvider>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default ProtectedRoute(MedicalPostEventSummaryDashboard);



import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { Container, Grid, Box, useMediaQuery } from "@mui/material";
import { ProtectedRoute } from "../../../contexts/auth";
import {
    calculateChiefComplaintEncounterCountsData,
    calculatePostFestivalLengthOfStayData,
    calculateChiefComplaintEncounterCountsSummary,
    calculateCommonPresentationsAndTransports,
    calculateAcuityCountsData,
    calculatePatientEncountersByAcuityPerDay,
    calculateOffsiteTransportCounts,
    generateOffsiteTransportList,
    calculateOffsiteTransportsPerDay,
    calculatePatientLosBoxPlotData,

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
    LengthOfStayDashboardComponent
} from "../../../components/dashboard/PostFestivalDashboards";
import { SelectYearPrompt } from "../../../components/dashboard/PostFestivalDashboards";
import { AcuityCountPerDay, LengthOfStayDashboardData, OffsiteTransportCountTotals, OffsiteTransportEntry } from "../../../interfaces/PosteventDashboard";



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
    const [acuityCountPerDay, setAcuityCountPerDay] = useState<AcuityCountPerDay>({});
    const [offsiteTransportCounts, setOffsiteTransportCounts] = useState<OffsiteTransportCountTotals | null>(null);
    const [offsiteTransportEntries, setOffsiteTransportEntries] = useState<OffsiteTransportEntry[]>([]);
    const [offsiteTransportsPerDayCount, setOffsiteTransportsPerDayCount] = useState<Record<string, Record<string, number>>>({});
    const [losBoxPlotData, setLosBoxPlotData] = useState<LengthOfStayDashboardData>({
        all: [],
        red: [],
        yellow: [],
        green: [],
        white: [],
    });

    // When the year is selected, fetch the patient encounters for that year
    useEffect(() => {

        if (selectedYear && selectedView === "") {
            setSelectedView("Summary");
        }

        if (!selectedYear) {
            return;
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

                } catch (error) {
                    setApiAlert({ type: "error", message: "Error fetching patient encounters" });
                }
            }
        };

        fetchPatientEncounters();
    }, [selectedYear, setValue, selectedView, setApiAlert]);


    useEffect(() => {
        if (patientEncounters.length > 0) {

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

            const patientEncounterAcuityCountsByDay = calculatePatientEncountersByAcuityPerDay(patientEncounters);
            setAcuityCountPerDay(patientEncounterAcuityCountsByDay);

            const offsiteTransportCounts = calculateOffsiteTransportCounts(patientEncounters);
            setOffsiteTransportCounts(offsiteTransportCounts);

            const offsiteTransportList = generateOffsiteTransportList(patientEncounters);
            setOffsiteTransportEntries(offsiteTransportList);

            const offsiteTransportsPerDayCount = calculateOffsiteTransportsPerDay(offsiteTransportList);
            setOffsiteTransportsPerDayCount(offsiteTransportsPerDayCount);

            const losBoxPlotData = calculatePatientLosBoxPlotData(patientEncounters);
            setLosBoxPlotData(losBoxPlotData);
        }
    }
        , [patientEncounters]);


    return (
        <>
            <ProtectedNavbar sx={{ zIndex: 1300 }} navigationText={getNavigationText(selectedView as SelectedView, selectedYear)} />
            <Box sx={{ display: "flex" }}>
                <PostEventDashboardSidebar control={control} methods={methods} onSelectView={setSelectedView} selectedView={selectedView} />
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
                                <PatientEncountersDashboardComponent selectedYear={selectedYear} acuityCountPerDay={acuityCountPerDay} />
                            ) : selectedView === "Offsite Transports" ? (
                                <OffsiteTransportsDashboardComponent offsiteTransportCounts={offsiteTransportCounts} offsiteTransportEntries={offsiteTransportEntries} offsiteTransportsPerDayCount={offsiteTransportsPerDayCount} />
                            ) : selectedView === "Length of Stay" ? (
                                <LengthOfStayDashboardComponent losBoxPlotData={losBoxPlotData} />
                            ) : <SelectYearPrompt />}
                        </FormProvider>
                    </Container>
                </Box>
            </Box>
        </>
    );
};

export default ProtectedRoute(MedicalPostEventSummaryDashboard);

type SelectedView = "Summary" | "Patient Encounters" | "Offsite Transports" | "Length of Stay" | "";

const viewToNavigationText: { [key in SelectedView]: string } = {
    "Summary": "Dashboard > Post-Event > Summary",
    "Patient Encounters": "Dashboard > Post-Event > Patient Encounters",
    "Offsite Transports": "Dashboard > Post-Event > Offsite Transports",
    "Length of Stay": "Dashboard > Post-Event > Length of Stay",
    "": "Dashboard > Post-Event",
};

const getNavigationText = (selectedView: SelectedView, selectedYear: string | undefined) => {
    const yearText = selectedYear ? ` for ${selectedYear}` : "";
    return (viewToNavigationText[selectedView] || "Dashboard > Post-Event") + yearText;
};
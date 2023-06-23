import React, { useEffect } from "react";
import Link from "next/link";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
  ListItemText,
  ListItem,
  List,
  Typography,
} from "@mui/material";
import { Form, useForm, useFormContext, FormProvider } from "react-hook-form";

import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/protected_navbar";

import { submitPatientEncounterForm } from "../../utils/api";
import { MFPEFormData } from "../../utils/constants";
import { PatientRFIDField } from "../../components/patient_encounter_form/PatientRFIDField";
import { DocumentNumberField } from "../../components/patient_encounter_form/DocumentNumberField";
import { LocationField } from "../../components/patient_encounter_form/LocationField";
import { ArrivalDateField } from "../../components/patient_encounter_form/ArrivalDateField";
import { ArrivalTimeField } from "../../components/patient_encounter_form/ArrivalTimeField";
import { GenderField } from "../../components/patient_encounter_form/GenderField";
import { AgeField } from "../../components/patient_encounter_form/AgeField";
import { TriageAcuityField } from "../../components/patient_encounter_form/TriageAcuityField";
import { PatientOnShiftWorkerField } from "../../components/patient_encounter_form/PatientOnShiftWorkerField";
import { ChiefComplaintField } from "../../components/patient_encounter_form/ChiefComplaintField";
import { OtherChiefComplaintField } from "../../components/patient_encounter_form/OtherChiefComplaintField";
import { ArrivalMethodField } from "../../components/patient_encounter_form/ArrivalMethodField";
import { HandoverFromField } from "../../components/patient_encounter_form/HandoverFromField";
import { DepartureDestinationField } from "../../components/patient_encounter_form/DepartureDestinationField";
import { DepartureDateField } from "../../components/patient_encounter_form/DepartureDateField";
import { DepartureTimeField } from "../../components/patient_encounter_form/DepartureTimeField";
import { HandoverToField } from "../../components/patient_encounter_form/HandoverToField";
import { CommentsField } from "../../components/patient_encounter_form/CommentsField";

function MFPEForm() {
  const [hasSuccess, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(false);

  const methods = useForm({ defaultValues: MFPEFormData });

  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = methods;

  const formData = watch();
  const chiefComplaints = watch("chief_complaints");
  const enableOtherChiefComplaint = chiefComplaints?.includes("Other");

  useEffect(() => {
    if (!chiefComplaints.includes("Other")) {
      setValue("chief_complaint_other", "");
    }
  }, [chiefComplaints]);

  const handleFormChange = (name, value) => {
    setValue(name, value);
  };

  const onSubmit = async (data) => {
    const token = `Bearer ${window.localStorage.getItem("auth-token")}`;

    if (data.chief_complaints.includes("Other")) {
      data.chief_complaints = data.chief_complaints.filter(
        (complaint) => complaint !== "Other"
      );
      data.chief_complaints.push(`Other: ${data.chief_complaint_other}`);
      delete data.chief_complaint_other;
    }

    const errorMessage = await submitPatientEncounterForm(data, token);
    if (!errorMessage) {
      setSuccessMessage("Patient encounter form was successfully created.");
      setSuccess(true);
    } else {
      setErrorMessage(errorMessage);
      setError(true);
    }
  };

  return (
    <>
      <ProtectedNavbar />
      <Container maxWidth="sm">
        <FormProvider {...methods}>
          <FormControl>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <FormGroup>
                <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                  <Grid item xs={12}>
                    <Typography variant="h4">
                      <Link href="/">
                        <a>Music Festival Patient Encounter Form</a>
                      </Link>
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    {PatientRFIDField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {DocumentNumberField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {LocationField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {ArrivalDateField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {ArrivalTimeField(control, errors)}
                  </Grid>
                  <Grid item xs={7}>
                    {GenderField(control, errors)}
                  </Grid>
                  <Grid item xs={5}>
                    {AgeField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {TriageAcuityField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {PatientOnShiftWorkerField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {ChiefComplaintField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {OtherChiefComplaintField(
                      control,
                      errors,
                      enableOtherChiefComplaint
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    {ArrivalMethodField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {HandoverFromField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {DepartureDestinationField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {DepartureDateField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {DepartureTimeField(control, errors)}
                  </Grid>
                  <Grid item xs={6}>
                    {HandoverToField(control, errors)}
                  </Grid>
                  <Grid item xs={12}>
                    {CommentsField(control, errors)}
                  </Grid>
                  {errors && (
                    <List style={{ color: "red" }}>
                      {Object.values(errors).map((error, index) => (
                        <ListItem key={index}>
                          <ListItemText primary={error.message} />
                        </ListItem>
                      ))}
                    </List>
                  )}
                  {hasSuccess && (
                    <p style={{ color: "green" }}>{successMessage}</p>
                  )}
                  <Grid item xs={12}>
                    <Button type="submit" fullWidth={true} variant="contained">
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              </FormGroup>
            </form>
          </FormControl>
        </FormProvider>
      </Container>
    </>
  );
}

export default ProtectedRoute(MFPEForm);

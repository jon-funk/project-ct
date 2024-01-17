import React, { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/ProtectedNavbar";
import { PatientEncounterFormFields } from "../../components/patient_encounter_form/PatientEncounterFormFields";

import { submitPatientEncounterForm } from "../../utils/api";
import { MFPEFormData } from "../../utils/constants";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";

import { RenderErrorAlerts } from "../../components/RenderErrorAlerts";
import { RenderSubmitAlert } from "../../components/RenderSubmitAlert";
import { SubmitAlert } from "../../interfaces/SubmitAlert";



/**
 * Renders a form for submitting a Shambhala Music Festival Patient Encounter.
 * 
 * @returns MFPEForm component.
 */
function MFPEForm(): JSX.Element {
  const [token, setToken] = useState<string | null>(null);
  const [submitAlert, setSubmitAlert] = useState<SubmitAlert | null>(null);
  const methods = useForm<PatientEncounterFormDataInterface>({ defaultValues: MFPEFormData });
  const {
    handleSubmit,
    formState: { errors },
    control,
    setValue,
    watch,
  } = methods;

  const chiefComplaints = watch("chief_complaints");
  const enableOtherChiefComplaint = chiefComplaints?.includes("Other");

  useEffect(() => {
    if (!chiefComplaints.includes("Other")) {
      setValue("chief_complaint_other", "");
    }
  }, [chiefComplaints, setValue]);

  useEffect(() => {
    const authToken = `Bearer ${window.localStorage.getItem("auth-token")}`;
    setToken(authToken);
  }, []);

  const handlePatientEncounterSubmit = async (data: PatientEncounterFormDataInterface) => {

    let errorMessage: string | null = null;

    if (data.chief_complaints.includes("Other")) {
      data.chief_complaints = data.chief_complaints.filter(
        (complaint) => complaint !== "Other"
      );
      data.chief_complaints.push(`Other: ${data.chief_complaint_other}`);
      delete data.chief_complaint_other;
    }

    if (token) {
      errorMessage = await submitPatientEncounterForm(data, token);
    } else {
      console.log("token is null");
    }

    if (!errorMessage) {
      setSubmitAlert({
        type: "success",
        message: "Successfully submitted patient encounter form!",
      });
    } else {
      setSubmitAlert({
        type: "error",
        message: errorMessage,
      });
    }
  };

  return (
    <>
      <ProtectedNavbar />
      <Container maxWidth="sm">
        <FormProvider {...methods}>
          <FormControl>
            <form
              onSubmit={handleSubmit(handlePatientEncounterSubmit)}
              noValidate
            >
              <FormGroup>
                <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                  <Grid item xs={12} style={{ textAlign: "center" }}>
                    <Typography variant="h5">
                      Music Festival Patient Encounter Form
                    </Typography>
                  </Grid>
                  <PatientEncounterFormFields
                    control={control}
                    errors={errors}
                    enableOtherChiefComplaint={enableOtherChiefComplaint}
                  />
                  <Grid item xs={12}>
                    {RenderErrorAlerts(errors)}
                    {RenderSubmitAlert(submitAlert)}
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      fullWidth={true}
                      variant="contained"
                      sx={{ mx: "1rem", fontWeight: "bold" }}
                    >
                      <CheckCircleOutlineIcon />
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



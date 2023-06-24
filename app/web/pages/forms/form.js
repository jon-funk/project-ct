import React, { useEffect } from "react";
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
import ProtectedNavbar from "../../components/protected_navbar";
import { useAuthToken } from "../../contexts/auth";
import { PatientEncounterFormFields } from "../../components/patient_encounter_form/patient_encounter_form_fields";

import { submitPatientEncounterForm } from "../../utils/api";
import { MFPEFormData } from "../../utils/constants";

import { renderErrorAlerts } from "../../components/render_error_alerts";
import { renderSubmitAlert } from "../../components/render_submit_alert";

/**
 * Shambhala Music Festival Patient Encounter Form page.
 *
 * Utilizes React Hook Form for form validation and submission.
 *
 * @returns {JSX.Element} - MFPEForm component.
 */
function MFPEForm() {
  const [submitAlert, setSubmitAlert] = React.useState(null);
  const methods = useForm({ defaultValues: MFPEFormData });
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
  }, [chiefComplaints]);

  const handlePatientEncounterSubmit = async (data) => {
    const token = useAuthToken();

    if (data.chief_complaints.includes("Other")) {
      data.chief_complaints = data.chief_complaints.filter(
        (complaint) => complaint !== "Other"
      );
      data.chief_complaints.push(`Other: ${data.chief_complaint_other}`);
      delete data.chief_complaint_other;
    }

    const errorMessage = await submitPatientEncounterForm(data, token);
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
                    {renderErrorAlerts(errors)}
                    {renderSubmitAlert(submitAlert)}
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

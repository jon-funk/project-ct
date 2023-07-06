import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";

import {
  Button,
  Container,
  FormControl,
  FormGroup,
  Grid,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import { PatientEncounterFormFields } from "./patient_encounter_form_fields";
import {
  deletePatientEncounterForm,
  updatePatientEncounterForm,
} from "../../utils/api";

import { useAuthToken } from "../../contexts/auth";
import { renderErrorAlerts } from "../render_error_alerts";
import { renderSubmitAlert } from "../render_submit_alert";
import { ConfirmDeletionDialog } from "../confirm_deletion_dialog";

/**
 * Renders a form for modifying a Shambhala Music Festival Patient Encounter.
 *
 * @param {string} formUUID - The UUID of the form.
 * @param {object} rowData - The data of the form.
 *
 * @returns {JSX.Element} - MFPEModifyForm component.
 */
function MFPEModifyForm({ formUUID, rowData }) {
  if (typeof rowData.on_shift === "boolean") {
    rowData.on_shift = rowData.on_shift === true ? "Yes" : "No";
  }
  if (typeof rowData.chief_complaints === "string") {
    rowData.chief_complaints = rowData.chief_complaints.split(", ");
  }

  if (Array.isArray(rowData.chief_complaints)) {
    rowData.chief_complaints.forEach((element, index) => {
      if (element.startsWith("Other:")) {
        rowData.chief_complaint_other = element.replace("Other: ", "");
        rowData.chief_complaints[index] = "Other";
      }
    });
  }

  const [formValues, setFormValues] = useState(rowData);
  const [uuid, setFormUUID] = useState(formUUID);

  const [openDialog, setOpenDialog] = useState(false);
  const [submitAlert, setSubmitAlert] = React.useState(null);

  const methods = useForm({ defaultValues: formValues });

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

  const handleUpdateSubmit = async (data) => {
    const token = useAuthToken();

    if (data.chief_complaints.includes("Other")) {
      data.chief_complaints = data.chief_complaints.filter(
        (complaint) => complaint !== "Other"
      );
      data.chief_complaints.push(`Other: ${data.chief_complaint_other}`);
      delete data.chief_complaint_other;
    }

    const errorMessage = await updatePatientEncounterForm(uuid, data, token);
    if (!errorMessage) {
      setSubmitAlert({
        type: "success",
        message: "Successfully submitted patient encounter form!",
      });
      window.location.pathname = "/search/encounters";
    } else {
      setSubmitAlert({
        type: "error",
        message: errorMessage,
      });
    }
  };

  const handleDeleteClick = () => {
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    setOpenDialog(false);
    const token = useAuthToken();
    const errorMessage = await deletePatientEncounterForm(uuid, token);
    if (!errorMessage) {
      window.location.pathname = "/search/encounters";
    } else {
      setErrorMessage(errorMessage);
      setError(true);
    }
  };

  const handleCancelDelete = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Container maxWidth="sm" sx={{ mt: "50px" }}>
        <FormProvider {...methods}>
          <FormControl>
            <form onSubmit={handleSubmit(handleUpdateSubmit)} noValidate>
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
                  <Grid
                    item
                    xs={12}
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      color="error"
                      size="large"
                      onClick={handleDeleteClick}
                      variant="outlined"
                      sx={{ mx: "1rem", fontWeight: "bold" }}
                    >
                      <DeleteIcon />
                      Delete
                    </Button>
                    <Button
                      type="submit"
                      size="large"
                      variant="contained"
                      sx={{ mx: "1rem", fontWeight: "bold" }}
                    >
                      <CheckCircleOutlineIcon />
                      Update
                    </Button>
                  </Grid>
                </Grid>
              </FormGroup>
            </form>
          </FormControl>
        </FormProvider>
      </Container>

      <ConfirmDeletionDialog
        open={openDialog}
        onClose={handleCancelDelete}
        onConfirmDelete={handleConfirmDelete}
      />
    </>
  );
}

export default MFPEModifyForm;

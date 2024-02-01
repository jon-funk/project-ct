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

import { PatientEncounterFormFields } from "./PatientEncounterFormFields";
import {
  deletePatientEncounterForm,
  updatePatientEncounterForm,
  setErrorMessage
} from "../../utils/api";

import { useAuthToken } from "../../contexts/auth";
import { RenderErrorAlerts } from "../RenderErrorAlerts";
import { RenderSubmitAlert } from "../RenderSubmitAlert";
import { ConfirmDeletionDialog } from "../ConfirmDeletionDialog";
import { AlertObject } from "../../interfaces/AlertObject";
import { PatientEncounterModifyFormProps } from "../../interfaces/PatientEncounterModifyFormProps";
import { SubmitAlert } from "../../interfaces/SubmitAlert";
import { PatientEncounterFormDataInterface } from "../../interfaces/PatientEncounterFormDataInterface";
import { RoutesMedical } from "../../constants/routes";

/**
 * Renders a form for modifying a Shambhala Music Festival Patient Encounter.
 *
 * @param formUUID - The UUID of the form.
 * @param rowData - The data of the form.
 *
 * @returns MFPEModifyForm component.
 */
function MFPEModifyForm({ formUUID, rowData }: PatientEncounterModifyFormProps): JSX.Element {
  const token = useAuthToken();

  if (typeof rowData.on_shift === "boolean") {
    rowData.on_shift = rowData.on_shift === true ? "Yes" : "No";
  }
  if (typeof rowData.chief_complaints === "string") {
    rowData.chief_complaints = (rowData.chief_complaints as string).split(", ");
  }

  if (Array.isArray(rowData.chief_complaints)) {
    rowData.chief_complaints.forEach((element: string, index: number) => {
      if (element.startsWith("Other:")) {
        rowData.chief_complaint_other = element.replace("Other: ", "");
        rowData.chief_complaints[index] = "Other";
      }
    });
  }

  const [openDialog, setOpenDialog] = useState(false);
  const [submitAlert, setSubmitAlert] = useState<SubmitAlert | null>(null);

  const methods = useForm({ defaultValues: rowData });

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

  const handleUpdateSubmit = async (data: PatientEncounterFormDataInterface) => {

    if (data.chief_complaints.includes("Other")) {
      data.chief_complaints = data.chief_complaints.filter(
        (complaint: string) => complaint !== "Other"
      );
      data.chief_complaints.push(`Other: ${data.chief_complaint_other}`);
      delete data.chief_complaint_other;
    }

    const errorMessage = await updatePatientEncounterForm(formUUID, data, token);
    if (!errorMessage) {
      setSubmitAlert({
        type: "success",
        message: "Successfully submitted patient encounter form!",
      });
      window.location.pathname = RoutesMedical.search;
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
    const errorMessage = await deletePatientEncounterForm(formUUID, token);
    if (!errorMessage) {
      window.location.pathname = RoutesMedical.search;
    } else {
      setErrorMessage(errorMessage);
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
                    {RenderErrorAlerts(errors)}
                    {RenderSubmitAlert(submitAlert as AlertObject)}
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
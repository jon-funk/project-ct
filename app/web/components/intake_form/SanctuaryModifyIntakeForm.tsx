import React, { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import {
    Typography,
    Grid,
    Button,
    FormControl,
    FormGroup,
    Container
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { useAuthToken } from "../../contexts/auth";
import { RenderErrorAlerts } from "../RenderErrorAlerts";
import { RenderSubmitAlert } from "../RenderSubmitAlert";
import { ConfirmDeletionDialog } from "../ConfirmDeletionDialog";
import { AlertObject } from "../../interfaces/AlertObject";
import { SubmitAlert } from "../../interfaces/SubmitAlert";
import { UserGroupRoutes, UserGroupKey } from "../../constants/routes";
import { UserGroupKeys } from "../../constants/keys";
import { IntakeFormFields } from "./IntakeFormFields";
import { deleteSanctuaryIntakeForm, updateSanctuaryIntakeForm } from "../../utils/api_sanctuary";

/**
 * Form to modify a sanctuary intake form.
 * 
 * @param props formUUID: string, rowData: SanctuaryIntakeRow
 */
export const SanctuaryModifyIntakeForm = (
    props: { formUUID: string, rowData: IntakeFormDataInterface }
) => {
    const { formUUID, rowData } = props;
    const token = useAuthToken();
    const methods = useForm<IntakeFormDataInterface>({
        defaultValues: rowData
    });
    const { control, handleSubmit, formState: { errors }, watch } = methods;


    // Convert guest emotional state to array
    if (typeof rowData.guest_emotional_state === "string") {
        rowData.guest_emotional_state = (rowData.guest_emotional_state as string).split(", ");
    }

    // Put Other: element into guest_emotional_state_other
    if (Array.isArray(rowData.guest_emotional_state)) {
        rowData.guest_emotional_state.forEach((element: string, index: number) => {
            if (element.startsWith("Other:")) {
                rowData.guest_emotional_state_other = element.replace("Other: ", "");
                rowData.guest_emotional_state[index] = "Other";
            }
        });
    }

    // Convert substance categories to array
    if (typeof rowData.substance_categories === "string") {
        rowData.substance_categories = (rowData.substance_categories as string).split(", ");
    }

    // Put Other: element into substance_categories_other
    if (Array.isArray(rowData.substance_categories)) {
        rowData.substance_categories.forEach((element: string, index: number) => {
            if (element.startsWith("Other:")) {
                rowData.substance_categories_other = element.replace("Other: ", "");
                rowData.substance_categories[index] = "Other";
            }
        });
    }

    // Create states for alerts and dialog
    const [submitAlert, setSubmitAlert] = useState<SubmitAlert | null>(null);
    const [openDialog, setOpenDialog] = useState(false);

    // Delete functions
    const handleDeleteClick = () => {
        setOpenDialog(true);
    };

    const handleCancelDelete = () => {
        setOpenDialog(false);
    };

    const handleConfirmDelete = () => {
        setOpenDialog(false);
        deleteSanctuaryIntakeForm(formUUID, token);
    };

    // Watch for specific form value changes to enable/disable other form fields.
    const emotionalState = watch("guest_emotional_state");
    const enableOtherEmotionalState = emotionalState?.includes("Other");

    useEffect(() => {
        if (!emotionalState.includes("Other")) {
            methods.setValue("guest_emotional_state_other", "");
        }
    }, [emotionalState, methods]);

    const substanceCategories = watch("substance_categories");
    const enableOtherSubstanceCategory = substanceCategories?.includes("Other");

    useEffect(() => {
        if (!substanceCategories.includes("Other")) {
            methods.setValue("substance_categories_other", "");
        }
    }, [substanceCategories, methods]);

    const departureDestination = watch("departure_dest");
    const enableDepartureNotes = departureDestination === "Other";

    useEffect(() => {
        if (departureDestination !== "Other") {
            methods.setValue("departure_dest_other", "");
        }
    }, [departureDestination, methods]);

    // Update form submit
    const handleUpdateSubmit = async (data: IntakeFormDataInterface) => {

        if (data.guest_emotional_state.includes("Other")) {
            data.guest_emotional_state = data.guest_emotional_state.filter(
                (state: string) => state !== "Other"
            );
            data.guest_emotional_state.push(`Other: ${data.guest_emotional_state_other}`);
            delete data.guest_emotional_state_other;
        }

        if (data.substance_categories.includes("Other")) {
            data.substance_categories = data.substance_categories.filter(
                (category: string) => category !== "Other"
            );
            data.substance_categories.push(`Other: ${data.substance_categories_other}`);
            delete data.substance_categories_other;
        }

        const errorMessage = await updateSanctuaryIntakeForm(formUUID, data, token);
        if (!errorMessage) {
            setSubmitAlert({
                type: "success",
                message: "Successfully submitted sanctuary intake form!"
            });
            window.location.pathname = UserGroupRoutes[UserGroupKeys.Sanctuary as UserGroupKey].search;
        } else {
            setSubmitAlert({
                type: "error",
                message: errorMessage
            });
        }
    }

    return (
        <>
            <Container maxWidth="sm">
                <FormProvider {...methods}>
                    <FormControl fullWidth>
                        <form onSubmit={handleSubmit(handleUpdateSubmit)} noValidate>
                            <FormGroup>
                                <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                                    <Grid item xs={12} style={{ textAlign: "center" }}>
                                        <Typography variant="h5">
                                            Sanctuary Intake Form
                                        </Typography>
                                    </Grid>
                                    {IntakeFormFields({ control, errors, enableOtherEmotionalState, enableOtherSubstanceCategory, enableDepartureNotes })}
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
};
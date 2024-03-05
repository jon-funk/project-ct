import React, { useEffect, useState } from "react";
import {
    Button,
    Container,
    FormControl,
    FormGroup,
    Grid,
    Typography,
    Paper
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { ProtectedRoute } from "../../contexts/auth";

import ProtectedNavbar from "../../components/ProtectedNavbar";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";
import { useForm, FormProvider } from "react-hook-form";

import { IntakeFormDataDefaults } from "../../constants/sanctuaryForm";
import { SubmitAlert } from "../../interfaces/SubmitAlert";

import { RenderErrorAlerts } from "../../components/RenderErrorAlerts";
import { RenderSubmitAlert } from "../../components/RenderSubmitAlert";
import { IntakeFormFields } from "../../components/intake_form/IntakeFormFields";
import { submitIntakeForm } from "../../utils/api";

export const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: 300,
            width: 250,
        },
    },
};


/**
 * The Sanctuary Intake Form page.
 * 
 * @returns {JSX.Element} The Sanctuary Intake Form page.
 */
function SanctuaryIntakeForm(): JSX.Element {
    const [token, setToken] = useState<string | null>(null);
    const [submitAlert, setSubmitAlert] = useState<SubmitAlert | null>(null);
    const methods = useForm<IntakeFormDataInterface>({ defaultValues: IntakeFormDataDefaults });
    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
    } = methods;


    // Watch for specific form value changes to enable/disable other form fields.
    const guestEmotionalState = watch("guest_emotional_state");
    const substanceCategories = watch("substance_categories");
    const departureDest = watch("departure_dest");

    const enableOtherEmotionalState = guestEmotionalState?.includes("Other: Describe");
    const enableOtherSubstanceCategory = substanceCategories?.includes("Other: Please describe substance");
    const enableDepartureNotes = departureDest?.includes("Left event to go home via:");


    // Load auth token from local storage.
    useEffect(() => {
        const authToken = `Bearer ${window.localStorage.getItem("auth-token")}`;
        setToken(authToken);
    }, []);

    // Enable the other emotional state textfield form if the user selects "Other" as a guest emotional state.
    useEffect(() => {
        if (!guestEmotionalState.includes("Other")) {
            setValue("guest_emotional_state_other", "");
        }
    }, [guestEmotionalState, setValue]);

    // Enable the other substance category textfield form if the user selects "Other" as a substance category.
    useEffect(() => {
        if (!substanceCategories.includes("Other")) {
            setValue("substance_categories_other", "");
        }
    }, [substanceCategories, setValue]);

    // Enable the departure destination textfield form if the user selects "Other" as a departure destination.
    useEffect(() => {
        if (!departureDest.includes("Left event to go home via:")) {
            setValue("departure_dest_other", "");
        }
    }, [departureDest, setValue]);


    // Submit handler for the intake form
    const handleIntakeSubmit = async (data: IntakeFormDataInterface) => {

        let errorMessage: string | null = null;

        if (data.guest_emotional_state.includes("Other: Describe")) {
            data.guest_emotional_state = data.guest_emotional_state.filter(
                (state) => state !== "Other: Describe"
            );
            data.guest_emotional_state.push(`Other: ${data.guest_emotional_state_other}`);
            delete data.guest_emotional_state_other;
        }

        if (data.substance_categories.includes("Other: Please describe substance")) {
            data.substance_categories = data.substance_categories.filter(
                (category) => category !== "Other: Please describe substance"
            );
            data.substance_categories.push(`Other: ${data.substance_categories_other}`);
            delete data.substance_categories_other;
        }

        if (data.departure_dest.includes("Left event to go home via:") && data.departure_dest_other) {
            data.departure_dest = `Left event to go home via: ${data.departure_dest_other}`;
            delete data.departure_dest_other;
        }

        if (token) {
            errorMessage = await submitIntakeForm(data, token);
        } else {
            console.warn("Error submiting intake. User token is null.");
        }

        if (!errorMessage) {
            setSubmitAlert({
                type: "success",
                message: "Successfully submitted intake form!",
            });

            setTimeout(() => {
                methods.reset();
                window.scrollTo(0, 0);

                // Clear the success alert after 2 seconds.
                setSubmitAlert(null);
            }, 2000);

        } else {
            setSubmitAlert({
                type: "error",
                message: errorMessage,
            });
        }
    };

    return (
        <>
            <ProtectedNavbar navigationText="New Intake Form" />
            <Container maxWidth="sm">
                <Paper>
                    <FormProvider {...methods}>
                        <FormControl fullWidth>
                            <FormGroup>
                                <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
                                    <Grid item xs={12} style={{ textAlign: "center" }}>
                                        <Typography variant="h5">Sanctuary Intake Form</Typography>
                                    </Grid>
                                    {IntakeFormFields({ control, errors, enableOtherEmotionalState, enableOtherSubstanceCategory, enableDepartureNotes })}
                                    <Grid item xs={12}>
                                        {RenderErrorAlerts(errors)}
                                        {RenderSubmitAlert(submitAlert)}
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            fullWidth={true}
                                            variant="contained"
                                            onClick={handleSubmit(handleIntakeSubmit)}
                                            sx={{ fontWeight: "bold" }}
                                        >
                                            <CheckCircleOutlineIcon />
                                            Submit
                                        </Button>
                                    </Grid>
                                </Grid>
                            </FormGroup>
                        </FormControl>
                    </FormProvider>
                </Paper>
            </Container >
        </>
    );
}

export default ProtectedRoute(SanctuaryIntakeForm);
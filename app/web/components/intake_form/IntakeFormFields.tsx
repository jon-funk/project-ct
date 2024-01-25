import React from "react";
import { Grid } from "@mui/material";
import { IntakeFormFieldsProps } from "../../interfaces/IntakeFormFieldsProps";
import { DepartureNotesField } from "./DepartureNotesField";
import { DepartureDestinationField } from "./DepartureDestinationField";
import { DepartureTimeField } from "./DepartureTimeField";
import { DepartureDateField } from "./DepartureDateField";
import { SubstanceCategoriesOtherField } from "./SubstanceCategoriesOtherField";
import { SubstanceCategoryField } from "./SubstanceCategoryField";
import { EmotionalStateOtherField } from "./EmotionalStateOtherField";
import { GuestEmotionalStateField } from "./GuestEmotionalStateField";
import { GuestConsciousnessLevelField } from "./GuestConsciousnessLevelField";
import { PresentingComplaintField } from "./PresentingComplaintField";
import { IdentifiedGenderField } from "./IdentifiedGenderField";
import { FirstVisitField } from "./FirstVisitField";
import { ArrivalMethodField } from "./ArrivalMethodField";
import { ArrivalTimeField } from "./ArrivalTimeField";
import { ArrivalDateField } from "./ArrivalDateField";
import { GuestRFIDField } from "./GuestRFIDField";


/**
 * The intake form fields for Sanctuary. Contains all fields for the intake form.
 * 
 * @param props IntakeFormFields component props.
 * 
 * @returns IntakeFormFields component.
 */
export const IntakeFormFields: React.FC<IntakeFormFieldsProps> = ({
    control,
    errors,
    enableOtherEmotionalState,
    enableOtherSubstanceCategory,
    enableDepartureNotes
}) => (
    <>
        <Grid item xs={12}>
            {GuestRFIDField({ control, errors })}
        </Grid>
        <Grid item xs={6}>
            {ArrivalDateField({ control, errors })}
        </Grid>
        <Grid item xs={6}>
            {ArrivalTimeField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {ArrivalMethodField({ control, errors })}
        </Grid>
        <Grid item xs={6}>
            {FirstVisitField({ control, errors })}
        </Grid>
        <Grid item xs={6}>
            {IdentifiedGenderField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {PresentingComplaintField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {GuestConsciousnessLevelField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {GuestEmotionalStateField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {EmotionalStateOtherField({ control, errors, enableField: enableOtherEmotionalState })}
        </Grid>
        <Grid item xs={12}>
            {SubstanceCategoryField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {SubstanceCategoriesOtherField({ control, errors, enableField: enableOtherSubstanceCategory })}
        </Grid>
        <Grid item xs={6}>
            {DepartureDateField({ control, errors })}
        </Grid>
        <Grid item xs={6}>
            {DepartureTimeField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {DepartureDestinationField({ control, errors })}
        </Grid>
        <Grid item xs={12}>
            {DepartureNotesField({ control, errors, enableField: enableDepartureNotes })}
        </Grid>
    </>
);

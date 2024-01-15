import React from "react";
import { Grid } from "@mui/material";
import { PatientRFIDField } from "./PatientRFIDField";
import { DocumentNumberField } from "./DocumentNumberField";
import { LocationField } from "./LocationField";
import { ArrivalDateField } from "./ArrivalDateField";
import { ArrivalTimeField } from "./ArrivalTimeField";
import { GenderField } from "./GenderField";
import { AgeField } from "./AgeField";
import { TriageAcuityField } from "./TriageAcuityField";
import { PatientOnShiftWorkerField } from "./PatientOnShiftWorkerField";
import { ChiefComplaintField } from "./ChiefComplaintField";
import { OtherChiefComplaintField } from "./OtherChiefComplaintField";
import { ArrivalMethodField } from "./ArrivalMethodField";
import { HandoverFromField } from "./HandoverFromField";
import { DepartureDestinationField } from "./DepartureDestinationField";
import { DepartureDateField } from "./DepartureDateField";
import { DepartureTimeField } from "./DepartureTimeField";
import { HandoverToField } from "./HandoverToField";
import { CommentsField } from "./CommentsField";
import { PatientEncounterFormFieldsProps } from "../../interfaces/PatientEncounterFormFieldsProps";

/**
 * Renders the fields for the Shambhala Music Festival Patient Encounter form.
 *
 * @param props - The props for the PatientEncounterFormFields component.
 *
 * @returns PatientEncounterFormFields component.
 */
export const PatientEncounterFormFields: React.FC<PatientEncounterFormFieldsProps> = ({
  control,
  errors,
  enableOtherChiefComplaint,
}) => (
  <>
    <Grid item xs={6}>
      {PatientRFIDField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {DocumentNumberField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {LocationField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {ArrivalDateField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {ArrivalTimeField({ control, errors })}
    </Grid>
    <Grid item xs={7}>
      {GenderField({ control, errors })}
    </Grid>
    <Grid item xs={5}>
      {AgeField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {TriageAcuityField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {PatientOnShiftWorkerField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {ChiefComplaintField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {OtherChiefComplaintField({ control, errors, enableField: enableOtherChiefComplaint })}
    </Grid>
    <Grid item xs={12}>
      {ArrivalMethodField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {HandoverFromField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {DepartureDestinationField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {DepartureDateField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {DepartureTimeField({ control, errors })}
    </Grid>
    <Grid item xs={6}>
      {HandoverToField({ control, errors })}
    </Grid>
    <Grid item xs={12}>
      {CommentsField({ control, errors })}
    </Grid>
  </>
);

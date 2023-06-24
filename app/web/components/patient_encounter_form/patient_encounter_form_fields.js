import React from "react";
import { Grid } from "@mui/material";
import { PatientRFIDField } from "./patient_rfid_field";
import { DocumentNumberField } from "./document_number_field";
import { LocationField } from "./location_field";
import { ArrivalDateField } from "./arrival_date_field";
import { ArrivalTimeField } from "./arrival_time_field";
import { GenderField } from "./gender_field";
import { AgeField } from "./age_field";
import { TriageAcuityField } from "./triage_acuity_field";
import { PatientOnShiftWorkerField } from "./patient_on_shift_worker_field";
import { ChiefComplaintField } from "./chief_complaint_field";
import { OtherChiefComplaintField } from "./other_chief_complaint_field";
import { ArrivalMethodField } from "./arrival_method_field";
import { HandoverFromField } from "./handover_from_field";
import { DepartureDestinationField } from "./departure_destination_field";
import { DepartureDateField } from "./departure_date_field";
import { DepartureTimeField } from "./departure_time_field";
import { HandoverToField } from "./handover_to_field";
import { CommentsField } from "./comments_field";

/**
 * Renders the fields for the Shambhala Music Festival Patient Encounter form.
 *
 * @param {object} control - The control object from react-hook-form.
 * @param {object} errors - The form errors object.
 * @param {boolean} enableOtherChiefComplaint - Indicates if the "Other Chief Complaint" field should be enabled.
 *
 * @returns {JSX.Element} - PatientEncounterFormFields component.
 */
export const PatientEncounterFormFields = ({
  control,
  errors,
  enableOtherChiefComplaint,
}) => (
  <>
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
      {OtherChiefComplaintField(control, errors, enableOtherChiefComplaint)}
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
  </>
);

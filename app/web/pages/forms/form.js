import React, { useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  FormGroup,
  Grid,
  InputLabel,
  ListItemText,
  ListItem,
  List,
  MenuItem,
  MenuProps,
  OutlinedInput,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Controller, Form, useForm, useFormContext } from "react-hook-form";

import { ProtectedRoute } from "../../contexts/auth";
import ProtectedNavbar from "../../components/protected_navbar";

import { submitPatientEncounterForm } from "../../utils/api";
import { chiefComplaints, MFPEFormData } from "../../utils/constants";

function MFPEForm() {
  const [hasSuccess, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
    onChange,
  } = useForm({ defaultValues: MFPEFormData });

  const formData = watch();

  // Watch for changes in the chief complaints field
  const complaints = watch("chief_complaints");
  const enableOtherChiefComplaint = complaints?.includes("Other");

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const handleFormChange = (name, value) => {
    setValue(name, value);
  };

  const onSubmit = async (data) => {
    const token = `Bearer ${window.localStorage.getItem("auth-token")}`;

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
      </Container>
    </>
  );
}

function PatientRFIDField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="patient_rfid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Patient RFID"
            placeholder="04:FD:3E:2B:4F:5C:80"
            variant="outlined"
            helperText="Wristband RFID"
          />
        )}
      />
    </FormControl>
  );
}

function DocumentNumberField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="document_num"
        control={control}
        rules={{ required: "Document number is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Document Number"
            variant="outlined"
            placeholder="1234"
            helperText="eg. 1000"
            error={Boolean(errors?.document_num)}
          />
        )}
      />
    </FormControl>
  );
}

function LocationField(control, errors) {
  return (
    <FormControl>
      <FormLabel id="location-select-label">Location</FormLabel>
      <Controller
        name="location"
        control={control}
        rules={{ required: "Location is required" }}
        render={({ field }) => (
          <Select
            {...field}
            labelId="location-select-label"
            label="Location"
            defaultValue="Main Medical"
            disabled
          >
            <MenuItem value="Main Medical" required={true}>
              Main Medical
            </MenuItem>
          </Select>
        )}
      />
    </FormControl>
  );
}

function ArrivalDateField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Date</FormLabel>
        <Controller
          name="arrival_date"
          control={control}
          rules={{ required: "Arrival date is required" }}
          render={({ field: { onChange, value } }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={onChange}
              error={Boolean(errors?.arrival_date)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={true}
                  error={Boolean(errors?.arrival_date)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function ArrivalTimeField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Time</FormLabel>
        <Controller
          name="arrival_time"
          control={control}
          rules={{ required: "Arrival time is required" }}
          render={({ field: { onChange, value } }) => (
            <TimePicker
              ampm={false}
              value={value}
              onChange={onChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  required={true}
                  error={Boolean(errors?.arrival_time)}
                />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function GenderField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset">
        <FormLabel component="legend">Gender</FormLabel>
        <Controller
          name="gender"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="gender"
              row
              value={field.value}
              onChange={field.onChange}
              error={Boolean(errors?.gender)}
            >
              <FormControlLabel value="male" control={<Radio />} label="Male" />
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

function AgeField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <TextField
            type="number"
            label="Age"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            error={Boolean(errors?.age)}
          />
        )}
      />
    </FormControl>
  );
}

function TriageAcuityField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.triage_acuity)}>
      <Box component="fieldset">
        <FormLabel component="legend">Triage Acuity</FormLabel>
        <Controller
          name="triage_acuity"
          control={control}
          rules={{
            required: "Please select triage acuity.",
          }}
          render={({ field }) => (
            <Box>
              <RadioGroup
                aria-labelledby="triage_acuity"
                row
                value={field.value}
                onChange={field.onChange}
              >
                <FormControlLabel
                  value="white"
                  control={<Radio />}
                  label="White"
                />
                <FormControlLabel
                  value="green"
                  control={<Radio />}
                  label="Green"
                />
                <FormControlLabel
                  value="yellow"
                  control={<Radio />}
                  label="Yellow"
                />
                <FormControlLabel value="red" control={<Radio />} label="Red" />
              </RadioGroup>
              {errors.triage_acuity && (
                <FormHelperText>{errors.triage_acuity.message}</FormHelperText>
              )}
            </Box>
          )}
        />
      </Box>
    </FormControl>
  );
}

function PatientOnShiftWorkerField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.on_shift)}>
      <Box component="fieldset">
        <FormLabel component="legend">
          Is the patient a worker who is on shift?
        </FormLabel>
        <Controller
          name="on_shift"
          control={control}
          rules={{ required: "Is patient an on-shift worker is required." }}
          render={({ field }) => (
            <RadioGroup
              aria-labelledby="patient-Occupation"
              row
              {...field}
              error={Boolean(errors?.on_shift)}
            >
              <FormControlLabel
                value="Yes"
                control={<Radio required={true} />}
                label="Yes"
              />
              <FormControlLabel value="No" control={<Radio />} label="No" />
            </RadioGroup>
          )}
        />
        {errors.on_shift && (
          <FormHelperText error>{errors.on_shift.message}</FormHelperText>
        )}
      </Box>
    </FormControl>
  );
}

function ChiefComplaintField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.chief_complaints)}>
      <FormLabel>Chief Complaint</FormLabel>
      <Controller
        name="chief_complaints"
        control={control}
        rules={{
          required: "A chief complaint is required.",
        }}
        render={({ field }) => (
          <Select
            {...field}
            fullWidth={true}
            multiple={true}
            label="Select Complaint(s)"
            input={<OutlinedInput label="Tag" />}
            renderValue={(selected) => selected.join(", ")}
            MenuProps={MenuProps}
          >
            {chiefComplaints.map((complaint) => (
              <MenuItem key={complaint} value={complaint}>
                <Checkbox checked={field.value.indexOf(complaint) > -1} />
                <ListItemText primary={complaint} />
              </MenuItem>
            ))}
          </Select>
        )}
      />
      {errors.chief_complaints && (
        <FormHelperText error>{errors.chief_complaints.message}</FormHelperText>
      )}
    </FormControl>
  );
}

function OtherChiefComplaintField(control, errors, disabled) {
  // TODO: Clear field when Other is not selected
  return (
    <FormControl error={Boolean(errors?.chief_complaint_other)}>
      <FormLabel> </FormLabel>
      <Controller
        name="chief_complaint_other"
        control={control}
        rules={{
          required: !disabled ? false : "Other chief complaint is required.",
        }}
        render={({ field }) => (
          <TextField
            type="text"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
            label="Other chief complaint"
            disabled={!disabled}
            error={Boolean(errors?.chief_complaint_other)}
          />
        )}
      />
      {errors.chief_complaint_other && (
        <FormHelperText error>
          {errors.chief_complaint_other.message}
        </FormHelperText>
      )}
    </FormControl>
  );
}

function ArrivalMethodField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset">
        <FormLabel component="legend">Arrival Method</FormLabel>
        <Controller
          name="arrival_method"
          control={control}
          render={({ field }) => (
            <RadioGroup
              {...field}
              aria-labelledby="arrival-method"
              row
              value={field.value}
              onChange={field.onChange}
            >
              <FormControlLabel
                value="self-presented"
                control={<Radio required={true} />}
                label="Self Presented"
              />
              <FormControlLabel
                value="med-transport"
                control={<Radio />}
                label="Medical Transport"
              />
              <FormControlLabel
                value="security"
                control={<Radio />}
                label="Brought by Security"
              />
              <FormControlLabel
                value="harm-reduction"
                control={<Radio />}
                label="Brought by Harm Reduction"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other (Please explain in the comment section)"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

function HandoverFromField(control, errors) {
  return (
    <FormControl>
      <Controller
        name="handover_from"
        control={control}
        render={({ field }) => (
          <TextField
            label="Handover From"
            helperText="Please specify who the patient was handed over from."
            variant="outlined"
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

function DepartureDestinationField(control, errors) {
  return (
    <FormControl>
      <Box component="fieldset">
        <FormLabel component="legend">Departure Destination</FormLabel>
        <Controller
          name="departure_dest"
          control={control}
          render={({ field }) => (
            <RadioGroup aria-labelledby="departure-destination" row {...field}>
              <FormControlLabel
                value="back-to-festival"
                control={<Radio />}
                label="Back to Festival"
              />
              <FormControlLabel value="lwbs" control={<Radio />} label="LWBS" />
              <FormControlLabel
                value="left-ama"
                control={<Radio />}
                label="Left AMA"
              />
              <FormControlLabel
                value="return-to-event"
                control={<Radio />}
                label="Sanctuary"
              />
              <FormControlLabel
                value="security"
                control={<Radio />}
                label="Security"
              />
              <FormControlLabel
                value="hospital-private"
                control={<Radio />}
                label="Hospital by private car"
              />
              <FormControlLabel
                value="hostpital-ambulance"
                control={<Radio />}
                label="Hospital by ambulance"
              />
              <FormControlLabel
                value="other"
                control={<Radio />}
                label="Other (Please explain in the comment section)"
              />
            </RadioGroup>
          )}
        />
      </Box>
    </FormControl>
  );
}

function DepartureDateField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Date</FormLabel>
        <Controller
          name="departure_date"
          control={control}
          render={({ field }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              {...field}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function DepartureTimeField(control, errors) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Time</FormLabel>
        <Controller
          name="departure_time"
          control={control}
          render={({ field }) => (
            <TimePicker
              ampm={false}
              {...field}
              renderInput={(params) => <TextField {...params} />}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function HandoverToField(control, errors) {
  return (
    <FormControl error={Boolean(errors?.handover_too)}>
      <Controller
        name="handover_too"
        control={control}
        rules={{ required: "Please enter who patient is handed over to." }}
        render={({ field }) => (
          <TextField
            label="Handover To"
            helperText="Patient is going with..."
            variant="outlined"
            {...field}
          />
        )}
      />
      {errors.handover_too && (
        <FormHelperText error>{errors.handover_too.message}</FormHelperText>
      )}
    </FormControl>
  );
}

function CommentsField(control, errors) {
  return (
    <Box>
      <FormControl fullWidth>
        <Controller
          name="comment"
          control={control}
          render={({ field }) => (
            <TextField
              placeholder="Enter additional comments here"
              variant="outlined"
              label="Comments"
              multiline={true}
              rows={3}
              {...field}
            />
          )}
        />
      </FormControl>
    </Box>
  );
}

export default ProtectedRoute(MFPEForm);

import React, { useEffect } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
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
import { Controller, useForm } from "react-hook-form";

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

  const onSubmit = async (data) => {
    setError(false);
    setErrorMessage("");
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
                  {PatientRFIDField(control)}
                </Grid>
                <Grid item xs={6}>
                  {DocumentNumberField(control, errors)}
                </Grid>
                <Grid item xs={12}>
                  {LocationField(control)}
                </Grid>
                <Grid item xs={6}>
                  {ArrivalDateField(control)}
                </Grid>
                <Grid item xs={6}>
                  {ArrivalTimeField(control)}
                </Grid>
                <Grid item xs={7}>
                  {GenderField(control)}
                </Grid>
                <Grid item xs={5}>
                  {AgeField(control)}
                </Grid>
                <Grid item xs={12}>
                  {TriageAcuityField(control, errors)}
                </Grid>
                <Grid item xs={12}>
                  {PatientOnShiftWorkerField(control)}
                </Grid>
                <Grid item xs={12}>
                  {ChiefComplaintField(control)}
                </Grid>
                <Grid item xs={12}>
                  {ArrivalMethodField(control)}
                </Grid>
                <Grid item xs={6}>
                  {HandoverFromField(control)}
                </Grid>
                <Grid item xs={12}>
                  {DepartureDestinationField(control)}
                </Grid>
                <Grid item xs={6}>
                  {DepartureDateField(control)}
                </Grid>
                <Grid item xs={6}>
                  {DepartureTimeField(control)}
                </Grid>
                <Grid item xs={6}>
                  {HandoverToField(control)}
                </Grid>
                <Grid item xs={12}>
                  {CommentsField(control)}
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

export default ProtectedRoute(MFPEForm);

function PatientRFIDField(control) {
  return (
    <FormControl>
      <FormLabel>Patient RFID: </FormLabel>
      <Controller
        name="patient_rfid"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="RFID"
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
      <FormLabel>Document #: </FormLabel>
      <Controller
        name="document_num"
        control={control}
        rules={{ required: "Document number is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            variant="outlined"
            helperText="eg. 1000"
            error={Boolean(errors?.document_num)}
            helperText={errors?.document_num?.message || " "}
          />
        )}
      />
    </FormControl>
  );
}

function LocationField(control) {
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

function ArrivalDateField(control) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Date: </FormLabel>
        <Controller
          name="arrival_date"
          control={control}
          rules={{ required: "Arrival date is required" }}
          render={({ field: { onChange, value } }) => (
            <MobileDatePicker
              inputFormat="MM/dd/yyyy"
              value={value}
              onChange={onChange}
              renderInput={(params) => (
                <TextField {...params} required={true} />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function ArrivalTimeField(control) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Arrival Time: </FormLabel>
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
                <TextField {...params} required={true} />
              )}
            />
          )}
        />
      </FormControl>
    </LocalizationProvider>
  );
}

function GenderField(control) {
  return (
    <FormControl>
      <FormLabel>Gender: </FormLabel>
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
          >
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel
              value="female"
              control={<Radio />}
              label="Female"
            />
            <FormControlLabel value="other" control={<Radio />} label="Other" />
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}

function AgeField(control) {
  return (
    <FormControl>
      <FormLabel>Age: </FormLabel>
      <Controller
        name="age"
        control={control}
        render={({ field }) => (
          <TextField
            type="number"
            label="age"
            variant="outlined"
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </FormControl>
  );
}

function TriageAcuityField(control, errors) {
  return (
    <FormControl>
      <FormLabel>Triage Acuity: </FormLabel>
      <Controller
        name="triage_acuity"
        control={control}
        rules={{
          required: "Please select triage acuity.",
        }}
        render={({ field }) => (
          <Box>
            <RadioGroup
              aria-labelledby="triage-acuity"
              row
              value={field.value}
              onChange={field.onChange}
            >
              <FormControlLabel
                value="white"
                control={<Radio required={true} />}
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
          </Box>
        )}
      />
    </FormControl>
  );
}

function PatientOnShiftWorkerField(control) {
  return (
    <FormControl>
      <FormLabel>Is the patient a worker who is on shift: </FormLabel>
      <Controller
        name="on_shift"
        control={control}
        rules={{ required: "Is patient an on-shift worker is required" }}
        render={({ field }) => (
          <RadioGroup aria-labelledby="patient-Occupation" row {...field}>
            <FormControlLabel
              value="Yes"
              control={<Radio required={true} />}
              label="Yes"
            />
            <FormControlLabel value="No" control={<Radio />} label="No" />
          </RadioGroup>
        )}
      />
    </FormControl>
  );
}

function ChiefComplaintField(control) {
  return (
    <FormControl>
      <FormLabel>Chief Complaint: </FormLabel>
      <Controller
        name="chief_complaints"
        control={control}
        rules={{
          required: "Chief complaint is required",
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
    </FormControl>
  );
}

function ArrivalMethodField(control) {
  return (
    <FormControl>
      <FormLabel>Arrival Method: </FormLabel>
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
    </FormControl>
  );
}

function HandoverFromField(control) {
  return (
    <FormControl>
      <FormLabel>Handover From: </FormLabel>
      <Controller
        name="handover_from"
        control={control}
        render={({ field }) => (
          <TextField
            label="Who brought the patient"
            variant="outlined"
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

function DepartureDestinationField(control) {
  return (
    <FormControl>
      <FormLabel>Departure Destination: </FormLabel>
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
    </FormControl>
  );
}

function DepartureDateField(control) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Date: </FormLabel>
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

function DepartureTimeField(control) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <FormControl>
        <FormLabel>Departure Time: </FormLabel>
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

function HandoverToField(control) {
  return (
    <FormControl>
      <FormLabel>Handover To: </FormLabel>
      <Controller
        name="handover_too"
        control={control}
        rules={{ required: "Please enter who handover to" }}
        render={({ field }) => (
          <TextField
            helperText="Patient is going with..."
            variant="outlined"
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

function CommentsField(control) {
  return (
    <FormControl>
      <FormLabel>Comments: </FormLabel>
      <Controller
        name="comment"
        control={control}
        render={({ field }) => (
          <TextField
            helperText="Enter comments here..."
            variant="outlined"
            fullWidth={true}
            {...field}
          />
        )}
      />
    </FormControl>
  );
}

import React from "react";
import Link from "next/link";
import {
  FormGroup,
  Container,
  Grid,
  ListItemText,
  Checkbox,
  TextField,
  OutlinedInput,
  MenuProps,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputLabel,
  Select,
  MenuItem,
  Button,
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
  const [errorMessage, setErrorMessage] = React.useState("");
  const [hasError, setError] = React.useState(false);
  const [hasSuccess, setSuccess] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    control,
    setValue,
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Grid container spacing={2} style={{ padding: 1 + "rem" }}>
              <Grid item xs={12}>
                <h2>
                  <Link href="/">
                    <a>Music Festival Patient Encounter Form</a>
                  </Link>
                </h2>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Patient RFID: </InputLabel>
                <Controller
                  name="patient_rfid"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Wristband RFID"
                      variant="outlined"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Document #: </InputLabel>
                <Controller
                  name="document_num"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="eg. 1000" variant="outlined" />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel id="location-select-label">Location</InputLabel>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      labelId="location-select-label"
                      label="Location"
                      defaultValue="Main Medical"
                      disabled>
                      <MenuItem value="Main Medical" required={true}>
                        Main Medical
                      </MenuItem>
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <InputLabel>Arrival Date: </InputLabel>
                  <Controller
                    name="arrival_date"
                    control={control}
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
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <InputLabel>Arrival Time: </InputLabel>
                  <Controller
                    name="arrival_time"
                    control={control}
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
                </LocalizationProvider>
              </Grid>
              <Grid item xs={7}>
                <InputLabel>Gender: </InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  defaultValue=""
                  render={({ field }) => (
                    <RadioGroup
                      aria-labelledby="gender"
                      row
                      value={field.value}
                      onChange={field.onChange}>
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
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
              </Grid>
              <Grid item xs={5}>
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
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Triage Acuity: </InputLabel>
                <Controller
                  name="triage_acuity"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-labelledby="triage-acuity"
                      row
                      value={field.value}
                      onChange={field.onChange}>
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
                      <FormControlLabel
                        value="red"
                        control={<Radio />}
                        label="Red"
                      />
                    </RadioGroup>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>
                  Is the patient a worker who is on shift:{" "}
                </InputLabel>
                <Controller
                  name="on_shift"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-labelledby="patient-Occupation"
                      row
                      {...field}>
                      <FormControlLabel
                        value="Yes"
                        control={<Radio required={true} />}
                        label="Yes"
                      />
                      <FormControlLabel
                        value="No"
                        control={<Radio />}
                        label="No"
                      />
                    </RadioGroup>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Chief Complaint: </InputLabel>
                <Controller
                  name="chief_complaints"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      required={true}
                      fullWidth={true}
                      multiple={true}
                      label="Select Complaint(s)"
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}>
                      {chiefComplaints.map((complaint) => (
                        <MenuItem key={complaint} value={complaint}>
                          <Checkbox
                            checked={field.value.indexOf(complaint) > -1}
                          />
                          <ListItemText primary={complaint} />
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Arrival Method: </InputLabel>
                <Controller
                  name="arrival_method"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      {...field}
                      aria-labelledby="arrival-method"
                      row
                      value={field.value}
                      onChange={field.onChange}>
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
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Handover From: </InputLabel>
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
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Departure Destination: </InputLabel>
                <Controller
                  name="departure_dest"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      aria-labelledby="departure-destination"
                      row
                      {...field}>
                      <FormControlLabel
                        value="back-to-festival"
                        control={<Radio />}
                        label="Back to Festival"
                      />
                      <FormControlLabel
                        value="lwbs"
                        control={<Radio />}
                        label="LWBS"
                      />
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
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <InputLabel>Departure Date: </InputLabel>
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
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <InputLabel>Departure Time: </InputLabel>
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
                </LocalizationProvider>
              </Grid>
              <Grid item xs={6}>
                <InputLabel>Handover To: </InputLabel>
                <Controller
                  name="handover_too"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Patient is going with..."
                      variant="outlined"
                      {...field}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <InputLabel>Comments: </InputLabel>
                <Controller
                  name="comment"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Enter comments here..."
                      variant="outlined"
                      fullWidth={true}
                      {...field}
                    />
                  )}
                />
              </Grid>
              {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
              {hasSuccess && <p style={{ color: "green" }}>{successMessage}</p>}
              <Grid item xs={12}>
                <Button type="submit" fullWidth={true} variant="contained">
                  Submit
                </Button>
              </Grid>
            </Grid>
          </FormGroup>
        </form>
      </Container>
    </>
  );
}

export default ProtectedRoute(MFPEForm);

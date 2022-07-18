import React from 'react';
import Link from 'next/link';
import { FormGroup, Container, Grid, Autocomplete, Checkbox, TextField,
        RadioGroup, Radio, FormControlLabel, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useAuth, ProtectedRoute } from '../../contexts/auth';
import ProtectedNavbar from "../../components/protected_navbar";

import { submitPatientEncounterForm } from "../../utils/api";

 const MFPEFormData = {
  patient_rfid: '',
  document_num: '',
  location: "Main Medical",
  handover_from: '',
  date: new Date,
  arrival_time: new Date,
  triage_acuity: '',
  on_shift: '',
  chief_complaints: [],
  arrival_method: '',
  handover_too: '',
  departure_time: new Date,
  departure_dest: '',
  comment: '',
}

function MFPEForm() {
  const [formValues, setFormValues] = React.useState(MFPEFormData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleChiefComplaintsFieldChange = (event, value) => {
    setFormValues({
      ...formValues,
      ["chief_complaints"]: value,
    });
  }

  const handleArrivalTimeChange = (event) => {
    setFormValues({
      ...formValues,
      ["arrival_time"]: event,
    });  };

  const handleDepartureTimeChange = (event) => {
    setFormValues({
      ...formValues,
      ["departure_time"]: event,
    });  };

  const [errorMessage, setErrorMessage]  = React.useState("");
  const [hasError, setError] = React.useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setErrorMessage("");
    const data = formValues;
    const token = `Bearer ${window.localStorage.getItem("auth-token")}`;

    const errorMessage = await submitPatientEncounterForm(data, token);
    if (!errorMessage) {
      window.location.pathname = "/forms/form";
    } else {
      setErrorMessage(errorMessage);
      setError(true);
    }
  }

  return (
    <>
    <ProtectedNavbar/>
    <Container maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Grid container spacing={2} style={{padding: 1 + 'rem'}}>
            <Grid item xs={12}>
              <h2>
                <Link href="/">
                  <a>Music Festival Patient Encounter Form</a>
                </Link>
              </h2>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Patient RFID: </InputLabel>
              <TextField
                name="patient_rfid"
                label="Wristband RFID"
                variant="outlined"
                value={formValues.rfid}
                onChange={handleChange} />
              </Grid>
            <Grid item xs={6}>
              <InputLabel>Document #: </InputLabel>
              <TextField
                name="document_num"
                label="eg. 1000"
                variant="outlined"
                value={formValues.document_num}
                onChange={handleChange} />
            </Grid>
            <Grid item xs={6}>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select
                labelId="location-select-label"
                name="location"
                defaultValue="Main Medical"
                label="Location"
                disabled
                required
                value={formValues.location}
                onChange={handleChange}>
                <MenuItem value="Main Medical">Main Medical</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Handover From: </InputLabel>
              <TextField
                name="handover_from"
                label="Who brought the patient"
                variant="outlined"
                value={formValues.handover_from}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Date: </InputLabel>
                <MobileDatePicker
                  inputFormat="MM/dd/yyyy"
                  required
                  name="date"
                  value={formValues.date}
                  onChange={handleArrivalTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Arrival Time: </InputLabel>
                <TimePicker
                  required
                  ampm={false}
                  name="arrival_time"
                  value={formValues.arrival_time}
                  onChange={handleArrivalTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Triage Acuity: </InputLabel>
              <RadioGroup
                aria-labelledby="triage-acuity"
                name="triage_acuity"
                row
                required
                value={formValues.triage_acuity}
                onChange={handleChange}>
                <FormControlLabel value="white" control={<Radio />} label="White" />
                <FormControlLabel value="green" control={<Radio />} label="Green" />
                <FormControlLabel value="yellow" control={<Radio />} label="Yellow" />
                <FormControlLabel value="red" control={<Radio />} label="Red" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Is the patient a worker who is on shift: </InputLabel>
              <RadioGroup
                aria-labelledby="patient-Occupation"
                name="on_shift"
                row
                required
                value={formValues.on_shift}
                onChange={handleChange}>
                <FormControlLabel value="staff-yes" control={<Radio />} label="Yes" />
                <FormControlLabel value="staff-no" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Chief Complaint: </InputLabel>
              <Autocomplete
                multiple
                required
                options={chiefComplaints}
                disableCloseOnSelect
                getOptionLabel={(option) => option.label}
                renderOption={(props, option, { selected }) => (
                  <li {...props}>
                    <Checkbox
                      checked={selected}
                    />
                    {option.label}
                  </li>
                )}
                renderInput={(params) => <TextField {...params}
                  name="chief_complaints"
                  label="Select Complaint(s)"
                  value={formValues.chief_complaints}/>}
                onChange={handleChiefComplaintsFieldChange}

              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Arrival Method: </InputLabel>
              <RadioGroup
                aria-labelledby="arrival-method"
                name="arrival_method"
                row
                required
                value={formValues.arrival_method}
                onChange={handleChange}>
                <FormControlLabel value="self-presented" control={<Radio />} label="Self Presented" />
                <FormControlLabel value="med-transport" control={<Radio />} label="Medical Transport" />
                <FormControlLabel value="security" control={<Radio />} label="Brought by Security" />
                <FormControlLabel value="harm-reduction" control={<Radio />} label="Brought by Harm Reduction" />
                <FormControlLabel value="other" control={<Radio />} label="Other (Please explain in the comment section)"/>
              </RadioGroup>
            </Grid>
            <Grid item xs={6}>
              <InputLabel>Handover To: </InputLabel>
              <TextField
               name="handover_too"
               label="Patient is going with..."
               variant="outlined"
               value={formValues.handover_too}
               onChange={handleChange} />
            </Grid>
            <br/>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Departure Time: </InputLabel>
                <TimePicker
                  required
                  ampm={false}
                  name="departure_time"
                  value={formValues.departure_time}
                  onChange={handleDepartureTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Departure Destination: </InputLabel>
              <RadioGroup
                required
                aria-labelledby="departure-destination"
                name="departure_dest"
                row
                value={formValues.departure_dest}
                onChange={handleChange}>
                <FormControlLabel value="lwbs" control={<Radio />} label="LWBS" />
                <FormControlLabel value="left-ama" control={<Radio />} label="Left AMA" />
                <FormControlLabel value="return-to-event" control={<Radio />} label="Sanctuary" />
                <FormControlLabel value="security" control={<Radio />} label="Security" />
                <FormControlLabel value="hospital-private" control={<Radio />} label="Hospital by private car" />
                <FormControlLabel value="hostpital-ambulance" control={<Radio />} label="Hospital by ambulance" />
                <FormControlLabel value="other" control={<Radio />} label="Other (Please explain in the comment section)" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Comments: </InputLabel>
              <TextField
                name="comment"
                label="enter comments here..."
                variant="outlined"
                fullWidth={true}
                value={formValues.comment}
                onChange={handleChange}  />
            </Grid>
            {hasError && <p style={{ color: "red" }}>{errorMessage}</p>}
            <Grid item xs={12}>
            <Button type="submit" fullWidth={true} variant="contained">Submit</Button>
            </Grid>
          </Grid>
        </FormGroup>
      </form>
    </Container>
  </>
  );
}

const chiefComplaints = [
  { label: 'Nausea/Vomiting', id: 1 },
  { label: 'Dizziness/Presyncope/Lightheaded', id: 2 },
  { label: 'Loss of Consciousness', id: 3 },
  { label: 'Seizure', id: 4 },
  { label: 'Adverse Drug Effect', id: 5 },
  { label: 'Agitation' , id: 6 },
  { label: 'Bizarre Behaviour' , id: 7 },
  { label: 'Hallucinations' , id: 8 },
  { label: 'Anxiety' , id: 9 },
  { label: 'Abdominal Pain' , id: 10 },
  { label: 'Chest Pain' , id: 11 },
  { label: 'Headache' , id: 12 },
  { label: 'Other Pain' , id: 13 },
  { label: 'Shortness of Breath' , id: 14 },
  { label: 'Allergic Reaction' , id: 15 },
  { label: 'Trauma' , id: 16 },
];

export default ProtectedRoute(MFPEForm);
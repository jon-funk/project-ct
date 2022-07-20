import React from 'react';
import Link from 'next/link';
import { FormGroup, Container, Grid, ListItemText, Checkbox, TextField, OutlinedInput, MenuProps,
        RadioGroup, Radio, FormControlLabel, InputLabel, Select, MenuItem, Button, Stack } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DeleteIcon from '@mui/icons-material/Delete';
import Typography from '@mui/material/Typography';

import { deletePatientEncounterForm, updatePatientEncounterForm } from "../utils/api";
import { chiefComplaints } from "../utils/constants";


function MFPEModifyForm({ formUUID, rowData }) {
  if (typeof rowData.on_shift === "boolean") {
    rowData.on_shift = rowData.on_shift === true ? "Yes" : "No";
  }
  if (typeof rowData.chief_complaints === "string") {
    rowData.chief_complaints = rowData.chief_complaints.split(", ");
  }

  const [formValues, setFormValues] = React.useState(rowData);
  const [uuid, setFormUUID] = React.useState(formUUID);
  const [complaints, setComplaints] = React.useState(Array.isArray(rowData.chief_complaints) ? rowData.chief_complaints: []);
  const [errorMessage, setErrorMessage]  = React.useState("");
  const [hasError, setError] = React.useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };


  const handleChiefComplaintsFieldChange = (event) => {
    setComplaints(
      typeof value === 'string' ? value.split(',') : value,
    );
    setFormValues({
      ...formValues,
      ["chief_complaints"]: value,
    });
  };

  const handleArrivalDateChange = (event) => {
    setFormValues({
      ...formValues,
      ["arrival_date"]: event
    });
  };

  const handleDepartureDateChange = (event) => {
    setFormValues({
      ...formValues,
      ["departure_date"]: event
    });
  };


  const handleArrivalTimeChange = (event) => {
    setFormValues({
      ...formValues,
      ["arrival_time"]: event,
    });  
  };

  const handleDepartureTimeChange = (event) => {
    const {
      target: { value },
    } = event;

    setFormValues({
      ...formValues,
      ["departure_time"]: event,
    });  };


  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    setErrorMessage("");
    const data = formValues;
    const token = `Bearer ${window.localStorage.getItem("auth-token")}`;

    const errorMessage = await updatePatientEncounterForm(uuid, data, token);
    if (!errorMessage) {
      window.location.pathname = "/search/encounters";
    } else {
      setErrorMessage(errorMessage);
      setError(true);
    }
  }

  const handleDelete = async (event) => {
    event.preventDefault()
    setError(false);
    setErrorMessage("");

    const token = `Bearer ${window.localStorage.getItem("auth-token")}`;
    const errorMessage = await deletePatientEncounterForm(uuid, token);
    if (!errorMessage) {
      window.location.pathname = "/search/encounters";
    } else {
      setErrorMessage(errorMessage);
      setError(true);
    }
  }

  return (
    <React.Fragment>
    <Container maxWidth="sm">
      <form onSubmit={handleUpdateSubmit}>
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
                value={formValues.patient_rfid}
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
            <Grid item xs={12}>
              <InputLabel id="location-select-label">Location</InputLabel>
              <Select
                labelId="location-select-label"
                name="location"
                defaultValue="Main Medical"
                label="Location"
                disabled
                value={formValues.location}
                onChange={handleChange}>
                <MenuItem value="Main Medical" required={true}>Main Medical</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Arrival Date: </InputLabel>
                <MobileDatePicker
                  inputFormat="MM/dd/yyyy"
                  name="arrival_date"
                  value={formValues.arrival_date}
                  onChange={handleArrivalDateChange}
                  renderInput={(params) => <TextField {...params} required={true}/>}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Arrival Time: </InputLabel>
                <TimePicker
                  ampm={false}
                  name="arrival_time"
                  value={formValues.arrival_time}
                  onChange={handleArrivalTimeChange}
                  renderInput={(params) => <TextField {...params} required={true}/>}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={7}>
              <InputLabel>Gender: </InputLabel>
              <RadioGroup
                aria-labelledby="gender"
                name="gender"
                row
                value={formValues.gender}
                onChange={handleChange}>
                <FormControlLabel value="male" control={<Radio />} label="Male" />
                <FormControlLabel value="female" control={<Radio />} label="Female" />
                <FormControlLabel value="other" control={<Radio />} label="Other" />
              </RadioGroup>
            </Grid>
            <Grid item xs={5}>
              <TextField
              type="number"
                name="age"
                label="age"
                variant="outlined"
                value={formValues.age}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Triage Acuity: </InputLabel>
              <RadioGroup
                aria-labelledby="triage-acuity"
                name="triage_acuity"
                row
                value={formValues.triage_acuity}
                onChange={handleChange}>
                <FormControlLabel value="white" control={<Radio required={true}/>} label="White" />
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
                value={formValues.on_shift}
                onChange={handleChange}>
                <FormControlLabel value="Yes" control={<Radio required={true}/>} label="Yes" />
                <FormControlLabel value="No" control={<Radio />} label="No" />
              </RadioGroup>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Chief Complaint: </InputLabel>
              <Select
                required={true}
                fullWidth={true}
                multiple={true}
                name="chief_complaints"
                label="Select Complaint(s)"
                value={complaints}
                onChange={handleChiefComplaintsFieldChange}
                input={<OutlinedInput label="Tag" />}
                renderValue={(selected) => {
                  if (Array.isArray(selected)) {
                    return selected.join(', ')
                  } else {
                    return selected;
                  }
                }}                  
                MenuProps={MenuProps}
                >
                {chiefComplaints.map((complaint) => (
                    <MenuItem key={complaint} value={complaint}>
                    <Checkbox checked={complaints.indexOf(complaint) > -1} />
                    <ListItemText primary={complaint} />
                    </MenuItem>
                ))}
              </Select>
            </Grid>
            <Grid item xs={12}>
              <InputLabel>Arrival Method: </InputLabel>
              <RadioGroup
                aria-labelledby="arrival-method"
                name="arrival_method"
                row
                value={formValues.arrival_method}
                onChange={handleChange}>
                <FormControlLabel value="self-presented" control={<Radio required={true}/>} label="Self Presented" />
                <FormControlLabel value="med-transport" control={<Radio />} label="Medical Transport" />
                <FormControlLabel value="security" control={<Radio />} label="Brought by Security" />
                <FormControlLabel value="harm-reduction" control={<Radio />} label="Brought by Harm Reduction" />
                <FormControlLabel value="other" control={<Radio />} label="Other (Please explain in the comment section)"/>
              </RadioGroup>
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
            <Grid item xs={12}>
              <InputLabel>Departure Destination: </InputLabel>
              <RadioGroup
                aria-labelledby="departure-destination"
                name="departure_dest"
                row
                value={formValues.departure_dest}
                onChange={handleChange}>
                <FormControlLabel value="lwbs" control={<Radio required={true}/>} label="LWBS" />
                <FormControlLabel value="left-ama" control={<Radio />} label="Left AMA" />
                <FormControlLabel value="return-to-event" control={<Radio />} label="Sanctuary" />
                <FormControlLabel value="security" control={<Radio />} label="Security" />
                <FormControlLabel value="hospital-private" control={<Radio />} label="Hospital by private car" />
                <FormControlLabel value="hostpital-ambulance" control={<Radio />} label="Hospital by ambulance" />
                <FormControlLabel value="other" control={<Radio />} label="Other (Please explain in the comment section)" />
              </RadioGroup>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Departure Date: </InputLabel>
                <MobileDatePicker
                  inputFormat="MM/dd/yyyy"
                  name="departure_date"
                  value={formValues.departure_date}
                  onChange={handleDepartureDateChange}
                  renderInput={(params) => <TextField {...params} required={true}/>}
                />
              </LocalizationProvider>
            </Grid>
            <Grid item xs={6}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <InputLabel>Departure Time: </InputLabel>
                <TimePicker
                  ampm={false}
                  name="departure_time"
                  value={formValues.departure_time}
                  onChange={handleDepartureTimeChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
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
            <Grid item xs={12}>
              <InputLabel>Comments: </InputLabel>
              <TextField
                name="comment"
                label="Enter comments here..."
                variant="outlined"
                fullWidth={true}
                value={formValues.comment}
                onChange={handleChange}  />
            </Grid>
            { 
              hasError && 
                <Typography variant="p" component="p" sx={{ pt: "1rem", color: "red", margin: "1rem", textAlign: "center" }}>
                  {errorMessage}
                </Typography>
            }
            <Grid item xs={12} alignItems="center" justifyContent="center" display="flex" sx={{ my: "1rem" }}>
              <Button color="error" size="large" onClick={handleDelete} sx={{ mx: "1rem", fontWeight: "bold" }}>
                <DeleteIcon />
                  Delete
              </Button>
              <Button color="success" size="large" type="submit" variant="contained" sx={{ mx: "1rem", fontWeight: "bold" }}>Update</Button>
            </Grid>
          </Grid>
        </FormGroup>
      </form>
    </Container>
  </React.Fragment>
  );
}

export default MFPEModifyForm;
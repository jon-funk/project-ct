import React from 'react';
import Link from 'next/link';
import { FormGroup, Container, Grid, Autocomplete, Checkbox, TextField,
        RadioGroup, Radio, FormControlLabel, InputLabel, Select, MenuItem, Button } from '@mui/material';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import useAuth, { ProtectedRoute } from '../../contexts/auth';

function SMFPEForm() {
  const [value, setValue] = React.useState(new Date());
  const [arrivalTime, setArrivalTime] = React.useState(new Date());
  const [departureTime, setDepartureTime] = React.useState(new Date());
  const { user, loading } = useAuth();

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const handleArrivalTimeChange = (newValue) => {
    setArrivalTime(newValue);
  };

  const handleDepartureTimeChange = (newValue) => {
    setDepartureTime(newValue);
  };

  return (
    <>
    <Container maxWidth="sm">
      <FormGroup action="/send-data-here" method="post">
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
            <TextField id="patient-rfid" label="Wristband RFID" variant="outlined" />
            </Grid>
          <Grid item xs={6}>
            <InputLabel>Document #: </InputLabel>
            <TextField id="document-number" label="eg. 1000" variant="outlined" />
          </Grid>
          <Grid item xs={6}>
            <InputLabel id="location-select-label">Location</InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              defaultValue="Main Medical"
              label="Location"
              disabled
              required
              onChange={handleChange}>
              <MenuItem value="Main Medical">Main Medical</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Handover From: </InputLabel>
            <TextField id="handover-from" label="Who brought the patient" variant="outlined" required />
          </Grid>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel>Date: </InputLabel>
              <MobileDatePicker
                inputFormat="MM/dd/yyyy"
                required
                value={arrivalTime}
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
                value={arrivalTime}
                onChange={handleArrivalTimeChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Triage Acuity: </InputLabel>
            <RadioGroup
              aria-labelledby="triage-acuity"
              name="triage-acuity"
              row
              required>
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
              name="checkbox-group"
              row
              required>
              <FormControlLabel value="staff-yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="staff-no" control={<Radio />} label="No" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Chief Complaint: </InputLabel>
            <Autocomplete
              multiple
              required
              id="chief-complaints"
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
              renderInput={(params) => <TextField {...params} label="Select Complaint(s)" />}
            />
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Arrival Method: </InputLabel>
            <RadioGroup
              aria-labelledby="arrival-method"
              name="radio-buttons-group"
              row
              required>
              <FormControlLabel value="self-presented" control={<Radio />} label="Self Presented" />
              <FormControlLabel value="med-transport" control={<Radio />} label="Medical Transport" />
              <FormControlLabel value="security" control={<Radio />} label="Brought by Security" />
              <FormControlLabel value="harm-reduction" control={<Radio />} label="Brought by Harm Reduction" />
              <FormControlLabel value="other" control={<Radio />} label="Other"/>
            </RadioGroup>
          </Grid>
          <Grid item xs={6}>
            <InputLabel>Handover To: </InputLabel>
            <TextField id="handover-to" label="Patient is going with..." variant="outlined" />
          </Grid>
          <br/>
          <Grid item xs={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <InputLabel>Departure Time: </InputLabel>
              <TimePicker
                required
                ampm={false}
                value={departureTime}
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
              name="radio-buttons-group"
              row>
              <FormControlLabel value="lwbs" control={<Radio />} label="LWBS" />
              <FormControlLabel value="left-ama" control={<Radio />} label="Left AMA" />
              <FormControlLabel value="return-to-event" control={<Radio />} label="Sanctuary" />
              <FormControlLabel value="security" control={<Radio />} label="Security" />
              <FormControlLabel value="hospital-private" control={<Radio />} label="Hospital by private car" />
              <FormControlLabel value="hostpital-ambulance" control={<Radio />} label="Hospital by ambulance" />
              <FormControlLabel value="other" control={<Radio />} label="Other" />
            </RadioGroup>
          </Grid>
          <Grid item xs={12}>
            <InputLabel>Comments: </InputLabel>
            <TextField id="comments" label="enter comments here..." variant="outlined" fullWidth  />
          </Grid>
          <Grid item xs={12}>
            <Button fullWidth="true" variant="contained">Submit</Button>
          </Grid>
        </Grid>
      </FormGroup>
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

export default ProtectedRoute(SMFPEForm);
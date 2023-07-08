// Parse an error object and return a string.
// If an array of errors is returned, only return the first error in the array.
// TODO: Allow for returning multiple error messages
function setErrorMessage(error) {
  if (typeof error?.detail === "string") {
    return error?.detail;
  } else if (Array.isArray(error?.detail)) {
    console.error("Complete list of errors received in server response: ", error);
    return `${error?.detail[0]?.loc[1]}: ${error?.detail[0].msg}`;
  } else {
    console.error("Unable to parse error: ", error);
    return "Received unknown server error. Consult console, or contact development team if problem persists."
  }
}

// Output the server error to the console and return a generic 5xx error text message.
function setServerErrorMessage(error) {
  console.error("Error while trying to execute request to the API: ", error);
  return "Internal Server error, please try again later, or contact support.";
}

// Try and get a refresh token to verify a user token is valid. If the server verifies that it's
// valid, return true. Otherwise return false.
export async function HasRefreshedAuthToken(token) {
    try {
        // Get a refresh token, otherwise redirect to login page.
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/refresh-token`, {
          method: "GET",
          headers: {
            Authorization: token
          },
          mode: 'cors',
          credentials: 'include'

        });
        const response_data = await response.json();
        if (response.ok) {
          window.localStorage.setItem("auth-token", response_data['access_token']);
          return true;
        } else {
          console.error("Failed to refresh user token. Received response: ", response_data);
          window.localStorage.removeItem("auth-token");
        }
      } catch (error) {
        console.error("Error while trying to request refresh token: ", error);
      }

      return false;
}


// Login a user and return empty string if login was successful, error message otherwise/
export async function login(email, password) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/login`, {
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          method: "POST",
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            email: email,
            password: password
          })
        })

        const response_data = await response.json();
        if (response.ok) {
          if (response_data.hasOwnProperty("access_token")) {
            window.localStorage.setItem("auth-token", response_data['access_token']);
            return "";
          } else {
            console.error("Malformed response from server: ", response_data);
            return "";
          }
        } else {
          return setErrorMessage(response_data);
        }
      } catch (error) {
        return setServerErrorMessage(error);
      }
}

// Get all patient encounter forms
export async function getAllPatientEncounters(token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/patient-encounters`, {
      headers: {
        "Accept": "application/json",
        "Authorization": token
      },
      method: "GET",
      mode: "cors",
      credentials: "include"
    });

    const response_data = await response.json();

    for (let index = 0; index < response_data.length; ++index) {
      const encounter = response_data[index];
      encounter.arrival_date = new Date(`${encounter.arrival_date}Z`);
      encounter.arrival_time = new Date(`${encounter.arrival_time}Z`);
      if (encounter.departure_date !== null) {
        encounter.departure_date = new Date(`${encounter.departure_date}Z`);
      }
      if (encounter.departure_time !== null) {
        encounter.departure_time = new Date(`${encounter.departure_time}Z`);
      }
      response_data[index] = encounter;
    }

    if (response.ok) {
      return response_data;
    } else {
      console.error("Unable to retrieve data from API. Received error: ", response_data);
      return "";
    }
  } catch (error) {
    console.error("Error while trying to retrieve patient encounter forms: ", error);
    return "";
  }
}

// Submit a new patient Encounter form
export async function submitPatientEncounterForm(formData, token) {
  try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/create-patient-encounter`, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": token
        },
        method: "POST",
        mode: 'cors',
        credentials: 'include',
        body: JSON.stringify({
          patient_rfid: formData.patient_rfid,
          document_num: formData.document_num,
          location: formData.location,
          handover_from: formData.handover_from,
          arrival_date: formData.arrival_date,
          arrival_time: formData.arrival_time,
          triage_acuity: formData.triage_acuity,
          // Hack to convert on_shift to a boolean
          on_shift: formData.on_shift === "Yes" ? true : false,
          chief_complaints: formData.chief_complaints.join(", "),
          arrival_method: formData.arrival_method,
          handover_too: formData.handover_too,
          departure_time: formData.departure_time,
          departure_date: formData.departure_date,
          departure_dest: formData.departure_dest,
          comment: formData.comment,
          age: formData.age,
          gender: formData.gender,
        })
      })

      const response_data = await response.json();
      if (response.ok) {
        // Response currently returns the full object. But we have no use for it on this page.
        return "";
      } else {
        return setErrorMessage(response_data);
      }
    } catch (error) {
      return setServerErrorMessage(error);
    }
}

// Delete Patient Encounter Form
export async function deletePatientEncounterForm(uuid, token) {
  try {
    const url = `${process.env.NEXT_PUBLIC_HOSTNAME}/patient-encounter?uuid=` + encodeURIComponent(uuid);
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": token
      },
      method: "DELETE",
      mode: "cors",
      credentials: "include"
    });

    if (response.ok) {
      // Delete response doesn't have any content
      return "";
    } else {
      const error_data = await response.json();
      return setErrorMessage(error_data);
    }
  } catch(error) {
    return setServerErrorMessage(error);
  }
}

// Update patient encounter form
export async function updatePatientEncounterForm(uuid, formData, token) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/patient-encounter`, {
      headers: {
        "Accept": "application/json",
        "Authorization": token,
        "Content-Type": "application/json"
      },
      method: "PUT",
      mode: "cors",
      credentials: "include",
      body: JSON.stringify({
        patient_rfid: formData.patient_rfid,
        document_num: formData.document_num,
        location: formData.location,
        handover_from: formData.handover_from,
        arrival_date: formData.arrival_date,
        arrival_time: formData.arrival_time,
        triage_acuity: formData.triage_acuity,
        // Hack to convert on_shift to a boolean
        on_shift: formData.on_shift === "Yes" ? true : false,
        chief_complaints: formData.chief_complaints.join(", "),
        arrival_method: formData.arrival_method,
        handover_too: formData.handover_too,
        departure_date: formData.departure_date,
        departure_time: formData.departure_time,
        departure_dest: formData.departure_dest,
        comment: formData.comment,
        age: formData.age,
        gender: formData.gender,
        // The only addition to the original submission form as of yet..
        patient_encounter_uuid: uuid
      })
    });
    
    const response_data = await response.json();
    if (response.ok) {
      return "";
    } else {
      return setErrorMessage(response_data)
    }
  } catch (error) {
    return setServerErrorMessage(error);
  }
}
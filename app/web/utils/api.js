// Try and get a refresh token to verify a user token is valid. If the server verifies that it's

import { responsiveFontSizes } from "@mui/material";

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
            console.error("Malformed request from server: ", response_data);
            return "Malformed request from server, please try again and contact support if issue persists.";
          }
        } else {
          console.error("Complete error received from server: ", response_data);
          if (typeof response_data?.detail === "string") {
            return response_data?.detail;
          } else {
            return response_data?.detail[0].msg;
          }
        }
      } catch (error) {
        console.log("Error occurred while making API request", error);
        return "Internal Server error, please try again later, or contact support.";
      }
}


// Get 
export async function getAllPatientEncounters() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/patient-encounters`, {
      headers: {
        "Accept": "application/json"
      },
      method: "GET",
      mode: "cors",
      credentials: "include"
    });

    const response_data = await response.json();
    if (response.ok) {
      return response_data;
    } else {
      console.error("Unable to retrieve data from API. Received error: ", response_data);
      return response_data;
    }
  } catch(error) {
    console.error("Request to retrieve patient encounters list failed. Received error: ", response_data);
    return "";
  }
}
import Cookies from 'js-cookie'


// Try and get a refresh token to verify a user token is valid. If the server verifies that it's
// valid, return true. Otherwise return false.
export async function HasRefreshedAuthToken(token) {
    try {
        // Get a refresh token, otherwise redirect to login page.
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/refresh-token`, {
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          method: "GET",
        });
        const response_data = await response.json();
        if (response.ok) {
            Cookies.set("auth-token", response_data['access_token'], { expires: 1, httpOnly: true });
            return true;
        } else {
            console.error("Failed to refresh user token. Received response: ", response_data);
            Cookies.remove("auth-token");
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
          body: JSON.stringify({
            email: email,
            password: password
          })
        })
        const response_data = await response.json()
        
        if (response.ok) {
          if (response_data.hasOwnProperty("access_token")) {
            Cookies.set("auth-token", response_data['access_token'], { expires: 1, httpOnly: true })
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
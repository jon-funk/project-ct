import { setCookie, getCookie, deleteCookie, hasCookie } from 'cookies-next';


export function SetAuthToken(token) {
    setCookie("access-token", token)
}

export function RemoveAuthCookie() {
    deleteCookie("access-token")
}

export function GetAuthHeader() {
    return `Bearer ${getCookie("access-token")}`;
}

export async function HasRefreshedAuthToken() {
    // Returns true if user is authenticated and we are able to refresh the token,
    // otherwise returns false.
    console.log("Checking for cookie: ", getCookie("access-token"));
    if (!hasCookie("access-token")) {
        return false
    }

    // Refresh the auth token
    try {
        // Get a refresh token, otherwise redirect to login page.
        console.log("Token format for header: ", GetAuthHeader());
        const response = await fetch(`${process.env.NEXT_PUBLIC_HOSTNAME}/refresh-token`, {
          headers: {
            "Authorization": GetAuthHeader(),
          },
          method: "GET",
        });
        const response_data = await response.json();
        if (response.ok) {
            SetAuthToken(response_data['access_token']);
            return true;
        } else {
            console.error("Failed to refresh user token. Received response: ", response_data);
            RemoveAuthCookie();
        }

      } catch (error) {
        console.error("Error while trying to request refresh token: ", error);
      }

      return false;
}

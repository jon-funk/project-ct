/**
 * Loads the auth token from local storage
 */
export function loadAuthToken() {
  return localStorage.getItem("auth-token");
}

/**
 * Saves the auth token to local storage
 *
 * @param token The token to save
 */
export function saveAuthToken(token: string) {
  localStorage.setItem("auth-token", token);
}

/**
 * Builds the header for a Bearer token
 *
 * @returns The header for a Bearer token
 */
export function buildBearerTokenHeader() {
  const authToken = loadAuthToken();
  return {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  };
}

import { UserGroupKey } from "../constants/routes";
import { LocalStorageKeys } from "../constants/keys";

/**
 * Loads the auth token from local storage
 */
export function loadAuthToken() {
  return localStorage.getItem(LocalStorageKeys.AuthToken);
}

/**
 * Saves the auth token to local storage
 *
 * @param token The token to save
 */
export function saveAuthToken(token: string) {
  localStorage.setItem(LocalStorageKeys.AuthToken, token);
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

/**
 * Saves the user's group to local storage. Checks if being called client-side.
 *
 * @param userGroup The user's group.
 *
 */
export function saveUserGroup(userGroup: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(LocalStorageKeys.UserGroup, userGroup);
  }
}

/**
 * Loads the user's group from local storage. Checks if being called client-side.
 *
 * @returns The user's group or null if it does not exist.
 */
export function loadUserGroup(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem(LocalStorageKeys.UserGroup);
  } else {
    return null;
  }
}

/**
 * Removes the auth token from local storage. Checks if being called client-side.
 *
 */
export function removeUserGroup() {
  if (typeof window !== "undefined") {
    localStorage.removeItem(LocalStorageKeys.UserGroup);
  }
}

/**
 * Gets the user group key from local storage.
 *
 * @returns The user group key or null if it does not exist.
 */
export function getUserGroupKey(): UserGroupKey | null {
  const group = loadUserGroup();
  if (group === null) {
    return null;
  }
  return group as UserGroupKey;
}

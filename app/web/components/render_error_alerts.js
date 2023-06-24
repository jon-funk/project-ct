import React from "react";
import { Alert } from "@mui/material";

/**
 * Renders error alerts for the given errors object.
 *
 * @param {object} errors - Errors object containing error messages.
 *
 * @returns {JSX.Element|null} - JSX element representing the error alerts, or null if no errors are present.
 */
export function renderErrorAlerts(errors) {
  if (errors) {
    return Object.values(errors).map((error, index) => (
      <Alert
        severity="error"
        key={index}
        sx={{ mt: 1 }}
        variant="filled"
        fullWidth={true}
      >
        {error.message}
      </Alert>
    ));
  }
  return null;
}

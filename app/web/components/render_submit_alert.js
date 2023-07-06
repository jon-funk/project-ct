import React from "react";
import { Alert } from "@mui/material";

/**
 * Renders a submit alert based on the provided alert object.
 *
 * @param {object} alert - Alert object containing the type and message of the alert.
 *
 * @returns {JSX.Element|null} - JSX element representing the submit alert, or null if no alert is provided.
 */

export function renderSubmitAlert(alert) {
  if (alert) {
    return (
      <Alert severity={alert.type} sx={{ mt: 2 }} variant="filled">
        {alert.message}
      </Alert>
    );
  }
  return null;
}

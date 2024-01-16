import React from "react";
import { Alert } from "@mui/material";
import { AlertObject } from "../interfaces/AlertObject";

/**
 * Renders a submit alert based on the provided alert object.
 *
 * @param alert - Alert object containing the type and message of the alert.
 *
 * @returns JSX element representing the submit alert, or null if no alert is provided.
 */

export function RenderSubmitAlert(
  alert: AlertObject | null
): JSX.Element | null {

  if (alert) {
    return (
      <Alert severity={alert.type} sx={{ mt: 2 }} variant="filled">
        {alert.message}
      </Alert>
    );
  }
  return null;
}

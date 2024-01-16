import React from "react";
import { Alert } from "@mui/material";
import { FieldErrors } from "react-hook-form";

/**
 * RenderErrorAlerts renders a list of errors as MUI Alert components.
 * 
 * @param errors A list of errors to render.
 * 
 * @returns A list of MUI Alert components.
 */
export function RenderErrorAlerts(errors: FieldErrors) {
  return (
    <>
      {Object.values(errors).map((error, index) => {
        if (error && typeof error.message === "string") {
          return (
            <Alert
              severity="error"
              key={index}
              sx={{ mt: 1 }}
              variant="filled"
            >
              {error.message}
            </Alert>
          );
        }
        return null;
      })}
    </>
  );
}

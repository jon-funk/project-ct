import React from "react";
import { Alert } from "@mui/material";
import { FieldErrors, FieldError } from "react-hook-form";

export function RenderErrorAlerts(errors: FieldErrors<any>) {
  return (
    <>
      {Object.entries(errors).map(([fieldName, error], index) => {
        if (error && (error as FieldError).message) {
          return (
            <Alert
              severity="error"
              key={index}
              sx={{ mt: 1 }}
              variant="filled"
            >
              {error.message as React.ReactNode}
            </Alert>
          );
        }
        return null;
      })}
    </>
  );
}

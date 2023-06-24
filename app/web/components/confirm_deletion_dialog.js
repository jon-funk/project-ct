import React from "react";
import {
  Button,
  Typography,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";

/**
 * Renders a confirmation dialog for deleting an encounter form.
 *
 * @param {boolean} open - Whether the dialog is open or not.
 * @param {function} onClose - Function to handle dialog close event.
 * @param {function} onConfirmDelete - Function to handle delete confirmation.
 *
 * @returns {JSX.Element} - ConfirmDeletionDialog component.
 */
export const ConfirmDeletionDialog = ({ open, onClose, onConfirmDelete }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
      <DialogContent>
        <Typography>
          Are you sure you want to delete this encounter form?
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>
          <CancelIcon />
          Cancel
        </Button>
        <Button onClick={onConfirmDelete} color="error" autoFocus>
          <DeleteIcon />
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

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
import { ConfirmDeletionDialogProps } from "../interfaces/ConfirmDeletionDialogProps";

/**
 * Renders a confirmation dialog for deleting an encounter form.
 *
 * @param props - The props of the component.
 *
 * @returns ConfirmDeletionDialog component.
 */
export const ConfirmDeletionDialog: React.FC<ConfirmDeletionDialogProps> = ({ open, onClose, onConfirmDelete }) => {
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

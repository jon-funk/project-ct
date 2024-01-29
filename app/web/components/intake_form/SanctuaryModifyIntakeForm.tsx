import React from "react";
import { Typography } from "@mui/material";
import { IntakeFormDataInterface } from "../../interfaces/IntakeFormDataInterface";

/**
 * TODO: Implement this component when API is ready.
 * 
 * @param props formUUID: string, rowData: SanctuaryIntakeRow
 */
export const SanctuaryModifyIntakeForm = (
    props: { formUUID: string, rowData: IntakeFormDataInterface }
) => {
    const { formUUID, rowData } = props;

    console.log("TODO: remove this when API is ready: ", formUUID, rowData);

    return (<Typography variant="h1">TODO: Implement Sanctuary Intake Modify Form</Typography>);
};
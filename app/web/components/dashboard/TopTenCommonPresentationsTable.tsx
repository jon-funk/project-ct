import React from "react";
import { TopTenCommonPresentationsTableProps } from "../../interfaces/TopTenCommonPresentationsTableProps";
import { CommonPresentationsTable } from "./CommonPresentationsTable";
import { Grid } from "@mui/material";


/**
 * Represents the tables for the top ten common presentations and transports.
 * 
 * @param props The props for the component
 * 
 * @returns The CommonPresentationsAndTransportsTables component
 */
export const CommonPresentationsAndTransportsTables = (props: TopTenCommonPresentationsTableProps) => {
    const { commonPresentationsDataRed, transportsDataRed, commonPresentationsDataYellow, transportsDataYellow } = props;

    return (
        <>
            <Grid item xs={12} md={8} lg={8} xl={2}>
                <CommonPresentationsTable commonPresentationsData={commonPresentationsDataRed} />
                <CommonPresentationsTable commonPresentationsData={transportsDataRed} />
            </Grid>
            <Grid item xs={12} md={8} lg={8} xl={2}>
                <CommonPresentationsTable commonPresentationsData={commonPresentationsDataYellow} />
                <CommonPresentationsTable commonPresentationsData={transportsDataYellow} />
            </Grid>
        </>
    );
};
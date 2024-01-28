import React from "react";
import { TopTenCommonPresentationsTableProps } from "../../interfaces/TopTenCommonPresentationsTableProps";
import { CommonPresentationsTable } from "./CommonPresentationsTable";


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
            <CommonPresentationsTable commonPresentationsData={commonPresentationsDataRed} />
            <CommonPresentationsTable commonPresentationsData={transportsDataRed} />
            <CommonPresentationsTable commonPresentationsData={commonPresentationsDataYellow} />
            <CommonPresentationsTable commonPresentationsData={transportsDataYellow} />
        </>
    );
};
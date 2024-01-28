export interface ChiefComplaintCountsTableRowData {
    id: number;
    chief_complaint: string;
    total_count: number;
    prec_of_patient_encounters: number;
    exclusive_cc_count: number;
    co_occuring_cc_count: number;
};

export interface ChiefComplaintCountsTableProps {
    rows: ChiefComplaintCountsTableRowData[];
};

export interface ComplaintData {
    complaint: string;
    count: number;
};

export interface TotalOutOfData {
    totalCount: number;
    outOf: number;
};

export interface PresentationGroup {
    rows: ComplaintData[];
    totals: TotalOutOfData;
    headerName: string;
    backgroundColor: string;
    textColor: string;
};
import { chiefComplaints } from "./constants";

/**
 * Generates a random number between the min and max values (inclusive)
 * 
 * @param min The minimum value
 * @param max The maximum value
 * 
 * @returns A random number between the min and max values (inclusive)
 */
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;


/**
 * Creates mock data for the Chief Complaint Counts table
 * 
 * @returns {ChiefComplaintCountsTableRowData[]} An array of mock data for the Chief Complaint Counts table
 */
export const createMockChiefComplainCountTableData = () => {
    return chiefComplaints.map((complaint, index) => ({
        id: index,
        chief_complaint: complaint,
        total_count: getRandomNumber(1, 100),
        prec_of_patient_encounters: getRandomNumber(1, 100),
        exclusive_cc_count: getRandomNumber(1, 50),
        co_occuring_cc_count: getRandomNumber(1, 50),
    }));
};
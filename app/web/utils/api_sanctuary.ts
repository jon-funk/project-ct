import { IntakeFormDataInterface } from "../interfaces/IntakeFormDataInterface";
// TODO: Refactor API calls to dynamically determine user group. Ticket: https://mediform.atlassian.net/browse/MEDI-42

/**
 * Fetches all intakes for sanctuary by making a GET request to the API.
 *
 * @param token - JWT token for authentication
 * @param setSanctuaryIntakes - React state hook to set the list of intakes
 * @param setIsErrorMessage - React state hook to set whether an error message should be displayed
 * @param setErrorMessage - React state hook to set the error message
 */
export async function fetchSanctuaryIntakes(
  token: string,
  setSanctuaryIntakes: React.Dispatch<
    React.SetStateAction<IntakeFormDataInterface[]>
  >,
  setIsErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/sanctuary/intakes`,
      {
        method: "GET",
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Check if response is ok
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: ${
          response.statusText
        } - ${await response.text()}`
      );
    }

    // Check if content is JSON
    const contentType = response.headers.get("Content-Type");
    if (contentType === null || !contentType.includes("application/json")) {
      throw new Error(
        `Error ${response.status}: ${
          response.statusText
        } - ${await response.text()}`
      );
    }

    const data = await response.json();
    setSanctuaryIntakes(data);
  } catch (error) {
    setIsErrorMessage(true);

    // Check if error is 404 and set error message accordingly to avoid HTML spam
    if ((error as Error).message.includes("404")) {
      setErrorMessage("404 - API route not found");
      return;
    }

    setErrorMessage((error as Error).message);
  }
}

/**
 * TODO: Remove this function once API is ready
 * Returns mock data for the Sanctuary Intakes table
 */
export async function fetchFakeSanctuaryIntakes(
  token: string,
  setSanctuaryIntakes: React.Dispatch<
    React.SetStateAction<IntakeFormDataInterface[]>
  >,
  setIsErrorMessage: React.Dispatch<React.SetStateAction<boolean>>,
  setErrorMessage: React.Dispatch<React.SetStateAction<string>>
) {
  console.log(
    "fetchFakeSanctuaryIntakes:",
    token,
    setIsErrorMessage,
    setErrorMessage
  );

  const mockSanctuaryIntakes = [
    {
      intake_uuid: "uuid-123",
      guest_rfid: "rfid-001",
      arrival_date: new Date("2024-01-01"),
      arrival_time: new Date("2024-01-01T08:00:00"),
      arrival_method: "Self",
      identified_gender: "Male",
      first_visit: true,
      presenting_complaint: "Headache",
      guest_consciousness_level: "Alert/Awake",
      guest_emotional_state: ["Cooperative", "Happy"],
      substance_categories: ["Alcohol", "Cannabis"],
      time_since_last_dose: 5,
      departure_time: new Date("2024-01-02T09:00:00"),
      departure_date: new Date("2024-01-02"),
      departure_dest: "Returned to event on their own (cleared)",
      departure_dest_other: "",
    },
    {
      intake_uuid: "uuid-456",
      guest_rfid: "rfid-002",
      arrival_date: new Date("2024-01-05"),
      arrival_time: new Date("2024-01-05T10:30:00"),
      arrival_method: "Friends",
      identified_gender: "Female",
      first_visit: false,
      presenting_complaint: "Dizziness",
      guest_consciousness_level: "Drowsy but responds to verbal commands",
      guest_emotional_state: ["Confused"],
      guest_emotional_state_other: "Overwhelmed",
      substance_categories: ["MDMA (Molly)"],
      substance_categories_other: "Prescription meds",
      time_since_last_dose: 12,
      departure_time: new Date("2024-01-06T11:00:00"),
      departure_date: new Date("2024-01-06"),
      departure_dest: "Transferred to Main Medical",
      departure_dest_other: "",
    },
    {
      intake_uuid: "uuid-789",
      guest_rfid: "rfid-003",
      arrival_date: new Date("2024-01-10"),
      arrival_time: new Date("2024-01-10T16:45:00"),
      arrival_method: "Transfer from Medical",
      identified_gender: "Non-binary",
      first_visit: true,
      presenting_complaint: "Abdominal pain",
      guest_consciousness_level: "Unconscious",
      guest_emotional_state: ["Agitated", "Scared"],
      substance_categories: ["Ketamine", "Cocaine"],
      time_since_last_dose: 3,
      departure_time: new Date("2024-01-11T17:30:00"),
      departure_date: new Date("2024-01-11"),
      departure_dest: "Left event to go home via: Please describe below",
      departure_dest_other: "Taxi",
    },
  ];

  setSanctuaryIntakes(mockSanctuaryIntakes);
}

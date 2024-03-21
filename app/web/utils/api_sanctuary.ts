import {
  IntakeFormDataInterface,
  APIIntakeFormData,
} from "../interfaces/IntakeFormDataInterface";
import { UserGroupKeys } from "../constants/keys";
import { setErrorMessage, setServerErrorMessage } from "./api";
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
      `${process.env.NEXT_PUBLIC_HOSTNAME}/${UserGroupKeys.Sanctuary}/forms`,
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

    let data = await response.json();

    data = data.map((item: APIIntakeFormData) => ({
      ...item,
      departure_date: item.discharge_date,
      departure_time: item.discharge_time,
      departure_dest: item.discharge_method,
    }));

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
 * Deletes an intake form for sanctuary by making a DELETE request to the API.
 *
 * @param uuid - UUID of the form to delete
 * @param token - JWT token for authentication
 * @returns Error message if there is an error, otherwise an empty string if request is successful.
 */
export async function deleteSanctuaryIntakeForm(uuid: string, token: string) {
  try {
    const url =
      `${process.env.NEXT_PUBLIC_HOSTNAME}/${UserGroupKeys.Sanctuary}/form?uuid=` +
      encodeURIComponent(uuid);
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        Authorization: token,
      },
      method: "DELETE",
      mode: "cors",
      credentials: "include",
    });

    if (response.ok) {
      // Delete response doesn't have any content
      return "";
    } else {
      const error_data = await response.json();
      return setErrorMessage(error_data);
    }
  } catch (error) {
    return setServerErrorMessage(error);
  }
}

export async function updateSanctuaryIntakeForm(
  formUUID: string,
  formData: IntakeFormDataInterface,
  token: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/${UserGroupKeys.Sanctuary}/form`,
      {
        method: "PUT",
        mode: "cors",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          intake_uuid: formData.intake_uuid,
          guest_rfid: formData.guest_rfid,
          document_num: formData.document_num,
          arrival_date: formData.arrival_date,
          arrival_time: formData.arrival_time,
          arrival_method: formData.arrival_method,
          identified_gender: formData.identified_gender,
          first_visit: formData.first_visit,
          presenting_complaint: formData.presenting_complaint,
          guest_consciousness_level: formData.guest_consciousness_level,
          guest_emotional_state: formData.guest_emotional_state.join(", "),
          substance_categories: formData.substance_categories.join(", "),
          time_since_last_dose: formData.time_since_last_dose,
          discharge_time: formData.departure_time,
          discharge_date: formData.departure_date,
          discharge_method: formData.departure_dest,
          comment: formData.comment,
        }),
      }
    );

    if (response.ok) {
      return "";
    } else {
      const error_data = await response.json();
      return setErrorMessage(error_data);
    }
  } catch (error) {
    return setServerErrorMessage(error);
  }
}

/**
 * Submit a single intake form to the API.
 *
 * @param formData Form data to be submitted.
 * @param token The auth token of the user.
 *
 * @returns An empty string if the submission was successful, or an error message to be displayed to the user.
 */

export async function submitIntakeForm(
  formData: IntakeFormDataInterface,
  token: string
): Promise<string> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_HOSTNAME}/${UserGroupKeys.Sanctuary}/form`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: token,
        },
        method: "POST",
        mode: "cors",
        credentials: "include",
        body: JSON.stringify({
          intake_uuid: formData.intake_uuid,
          guest_rfid: formData.guest_rfid,
          document_num: formData.document_num,
          arrival_date: formData.arrival_date,
          arrival_time: formData.arrival_time,
          arrival_method: formData.arrival_method,
          identified_gender: formData.identified_gender,
          first_visit: formData.first_visit,
          presenting_complaint: formData.presenting_complaint,
          guest_consciousness_level: formData.guest_consciousness_level,
          guest_emotional_state: formData.guest_emotional_state.join(", "),
          substance_categories: formData.substance_categories.join(", "),
          time_since_last_dose: formData.time_since_last_dose,
          discharge_time: formData.departure_time,
          discharge_date: formData.departure_date,
          discharge_method: formData.departure_dest,
          comment: formData.comment,
        }),
      }
    );

    const response_data = await response.json();
    if (response.ok) {
      return "";
    } else {
      return setErrorMessage(response_data);
    }
  } catch (error) {
    return setServerErrorMessage(error);
  }
}

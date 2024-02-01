import pytest
from urllib.parse import urlencode

from fastapi.testclient import TestClient

SAMPLE_DATA = {
    "patient_rfid": "string",
    "document_num": "string",
    "location": "string",
    "handover_from": "string",
    "arrival_method": "string",
    "arrival_date": "2022-07-18T21:03:34.436Z",
    "arrival_time": "2022-07-18T21:03:34.436Z",
    "triage_acuity": "string",
    "on_shift": False,
    "chief_complaints": "string",
    "handover_too": "string",
    "departure_date": "2022-07-18T21:03:34.436Z",
    "departure_time": "2022-07-18T21:03:34.436Z",
    "departure_dest": "string",
    "comment": "string",
    "document_num": "1",
    "qr_code": "",
}


@pytest.mark.needs(postgres=True)
def test_valid_submit_patient_encounter(client: TestClient, auth_header: str) -> None:
    """
    Test that we are able to submit a valid patient encounter form with a signed in user.
    """
    response = client.post(
        "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
    )

    resp_data = response.json()

    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_get_multiple_entries(client: TestClient, auth_header: str) -> None:
    """
    Test that we can submit and retrieve multiple entries.
    """
    for i in range(4):
        SAMPLE_DATA.update({"document_num": str(i)})
        response = client.post(
            "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid patient encounter form. Received error: " + str(
            resp_data
        )

    response = client.get("/api/patient-encounters", headers=auth_header)
    resp_data = response.json()
    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    # Can only run the below line when we are actually dropping all data from the database after each run
    assert len(resp_data) >= 4, (
        "Did not retrieve all entries from the database. Received: ",
        resp_data,
    )


@pytest.mark.needs(postgres=True)
def test_get_multiple_entries_with_arrival_date(
    client: TestClient, auth_header: str
) -> None:
    """
    Test what we submit and retrieve multiple entries with a date range, minimum date, and maximum date.
    """

    # Test that we can get entries within a date range (start and end date)
    for i in range(4):
        SAMPLE_DATA.update({"document_num": str(i)})
        SAMPLE_DATA.update({"arrival_date": "2020-12-14T21:03:34.436Z"})
        response = client.post(
            "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid patient encounter form. Received error: " + str(
            resp_data
        )

    response = client.get(
        "/api/patient-encounters?arrival_date_min=2020-07-18&arrival_date_max=2021-07-19",
        headers=auth_header,
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 4, (
        "Did not retrieve entries within date range from the database. Received: ",
        resp_data,
    )

    # Test that we can get entries with a minimum date (start date)
    for i in range(2):
        SAMPLE_DATA.update({"document_num": str(i)})
        SAMPLE_DATA.update({"arrival_date": "2025-01-02T21:03:34.436Z"})
        response = client.post(
            "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid patient encounter form. Received error: " + str(
            resp_data
        )

    response = client.get(
        "/api/patient-encounters?arrival_date_min=2025-01-01", headers=auth_header
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 2, (
        "Did not retrieve entries within min date range from the database. Received: ",
        resp_data,
    )

    # Test that we can get entries with a maximum date (end date)
    for i in range(2):
        SAMPLE_DATA.update({"document_num": str(i)})
        SAMPLE_DATA.update({"arrival_date": "1950-01-02T21:03:34.436Z"})
        response = client.post(
            "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid patient encounter form. Received error: " + str(
            resp_data
        )

    response = client.get(
        "/api/patient-encounters?arrival_date_max=1950-01-03", headers=auth_header
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 2, (
        "Did not retrieve entries within max date range from the database. Received: ",
        resp_data,
    )

    # Check date range where no entries exist
    response = client.get(
        "/api/patient-encounters?arrival_date_min=1800-01-01&arrival_date_max=1899-01-02",
        headers=auth_header,
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 0, (
        "Did not retrieve entries within date range from the database. Received: ",
        resp_data,
    )


@pytest.mark.needs(postgres=True)
def test_update_entry(client: TestClient, auth_header: str) -> None:
    """
    Test that we can create and then update a patient encounter
    """
    response = client.post(
        "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
    )
    update_req_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        update_req_data
    )

    # Perform update
    update_req_data.update({"document_num": "6.5"})
    response = client.put(
        "/api/patient-encounter", headers=auth_header, json=update_req_data
    )
    resp_data = response.json()
    assert response.status_code == 200, (
        "Unable to update patient encounter form. Received error: "
        + str(resp_data)
        + "\n\nSent: "
        + str(update_req_data)
    )
    assert (
        "patient_encounter_uuid" in resp_data
    ), "UUID not found in response data after update. Received: " + str(resp_data)

    # Get updated entry
    doc_uuid = resp_data["patient_encounter_uuid"]
    get_url = "/api/patient-encounter?" + urlencode({"uuid": doc_uuid})
    response = client.get(get_url, headers=auth_header)
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to retrieve updated entry. Received: " + str(resp_data)

    # Ensure that returned data matches and that one original field value is the same.
    assert (
        "document_num" in resp_data and resp_data["document_num"] == "6.5"
    ), "Updated value doesn't match. Received: " + str(resp_data)
    assert (
        "location" in resp_data and resp_data["location"] == "string"
    ), "Original value doesn't match. Received: " + str(resp_data)

    assert isinstance(
        resp_data["arrival_time"], str
    ), "Sanity check to ensure pydantic is returning strings, not Python objects to client."


@pytest.mark.needs(postgres=True)
def test_soft_delete(client: TestClient, auth_header: str) -> None:
    """
    Test that we are able to delete an entry and that we are no longer able to retrieve
    it using an API get request afterwards.
    """
    response = client.post(
        "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
    )
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        resp_data
    )
    assert (
        "patient_encounter_uuid" in resp_data
    ), "Did not receive UUID for patient encounter entry. Received: " + str(
        resp_data.keys()
    )
    doc_uuid = resp_data["patient_encounter_uuid"]
    doc_url = "/api/patient-encounter?" + urlencode({"uuid": doc_uuid})

    response = client.delete(doc_url, headers=auth_header, json=SAMPLE_DATA)
    assert response.status_code == 204, "Should have deleted entry."

    response = client.get(doc_url, headers=auth_header, json=SAMPLE_DATA)
    resp_data = response.json()
    assert (
        response.status_code == 404
    ), "Should not have been able to find entry... Returned: " + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_get_latest_patient_encounter_by_rfid(
    client: TestClient, auth_header: str
) -> None:
    """
    Test that we are able to get the latest patient encounter by RFID
    """
    valid_rfid = "valid"
    invalid_rfid = "invalid"

    doc_valid_rfid = urlencode({"patient_rfid": valid_rfid})
    doc_invalid_rfid = urlencode({"patient_rfid": invalid_rfid})

    # Create a valid patient encounter 1
    SAMPLE_DATA.update({"patient_rfid": valid_rfid})
    response = client.post(
        "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
    )
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        resp_data
    )

    # Create a valid patient encounter 2
    SAMPLE_DATA.update({"document_num": "1234"})
    response = client.post(
        "/api/create-patient-encounter", headers=auth_header, json=SAMPLE_DATA
    )
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        resp_data
    )

    # Test valid get RFID
    doc_url = "/api/latest-patient-encounter-rfid?" + doc_valid_rfid
    response = client.get(doc_url, headers=auth_header)
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Should have found entry. Received error: " + str(resp_data)

    # Test patient encounter is the latest one
    assert (
        resp_data["document_num"] == "1234"
    ), "Not the latest patient encounter: " + str(resp_data)

    # Test invalid get RFID
    doc_url = "/api/latest-patient-encounter-rfid?" + doc_invalid_rfid
    response = client.get(doc_url, headers=auth_header)
    resp_data = response.json()
    assert (
        response.status_code == 404
    ), "Should not have found entry. Received error: " + str(resp_data)

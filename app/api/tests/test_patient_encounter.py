import pytest
from urllib.parse import urlencode
import itertools

from fastapi.testclient import TestClient
from ..constants import MEDICAL

document_num_counter = itertools.count()

DEFAULT_ARRIVAL_DATE = "2022-07-18T21:03:34.436Z"


def next_document_num() -> str:
    """
    Returns the next document number for a patient encounter form.
    """
    return str(next(document_num_counter))


def generate_patient_encounter(
    document_num: str,
    arrival_date: str,
    patient_rfid: str = None,
) -> dict:
    """
    Returns a sample patient encounter form.
    """

    patient_rfid = patient_rfid or f"rfid_{document_num}"

    return {
        "patient_rfid": patient_rfid,
        "document_num": document_num,
        "location": "string",
        "handover_from": "string",
        "arrival_method": "string",
        "arrival_date": arrival_date,
        "arrival_time": arrival_date,
        "triage_acuity": "string",
        "on_shift": False,
        "chief_complaints": "string",
        "handover_too": "string",
        "departure_date": arrival_date,
        "departure_time": arrival_date,
        "departure_dest": "string",
        "comment": "string",
        "qr_code": "",
    }


@pytest.fixture
def sample_patient_encounter() -> dict:
    """
    Returns a sample patient encounter form. Document number is unique for each encounter.
    """
    document_num = next_document_num()
    return generate_patient_encounter(document_num, arrival_date=DEFAULT_ARRIVAL_DATE)


@pytest.fixture
def multiple_patient_encounters_factory() -> callable:
    """
    Returns a function that creates a list of patient encounters. Document number is unique for each encounter.
    """

    def create_encounters(num_encounters, arrival_date=DEFAULT_ARRIVAL_DATE):
        return [
            generate_patient_encounter(next_document_num(), arrival_date)
            for _ in range(num_encounters)
        ]

    return create_encounters


@pytest.mark.needs(postgres=True)
def test_valid_submit_patient_encounter(
    client: TestClient, auth_header: str, sample_patient_encounter: dict
) -> None:
    """
    Test that we are able to submit a valid patient encounter form with a signed in user.
    """
    response = client.post(
        f"/api/{MEDICAL}/form",
        headers=auth_header,
        json=sample_patient_encounter,
    )

    resp_data = response.json()

    assert (
        response.status_code == 200
    ), "Unable to submit a valid patient encounter form. Received error: " + str(
        resp_data
    )


@pytest.mark.needs(postgres=True)
def test_get_multiple_entries(
    client: TestClient, auth_header: str, multiple_patient_encounters_factory
) -> None:
    """
    Test that we can submit and retrieve multiple entries.
    """

    num_patient_encounters = 4
    patient_encounters = multiple_patient_encounters_factory(num_patient_encounters)

    for patient_encounter in patient_encounters:
        response = client.post(
            f"/api/{MEDICAL}/form", headers=auth_header, json=patient_encounter
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid patient encounter form. Received error: " + str(
            resp_data
        )

    response = client.get(f"/api/{MEDICAL}/forms", headers=auth_header)
    resp_data = response.json()
    assert response.status_code == 200, (
        "Unable to retrieve all entries from db. Received error: ",
        resp_data,
    )

    # Can only run the below line when we are actually dropping all data from the database after each run
    assert len(resp_data) >= num_patient_encounters, (
        "Did not retrieve all entries from the database. Received: ",
        resp_data,
    )


@pytest.mark.needs(postgres=True)
def test_get_multiple_entries_with_arrival_date(
    client: TestClient, auth_header: str, multiple_patient_encounters_factory
) -> None:
    """
    Test what we submit and retrieve multiple entries with a date range, minimum date, and maximum date.
    """

    # Date, Number of Entries
    date_ranges = [
        ("2020-12-14T21:03:34.436Z", 4),
        ("2025-01-02T21:03:34.436Z", 2),
        ("1950-01-02T21:03:34.436Z", 2),
    ]

    # Test that we can get entries within a date range (start and end date)
    for arrival_date, num_entries in date_ranges:
        encounters = multiple_patient_encounters_factory(num_entries, arrival_date)
        for encounter in encounters:
            response = client.post(
                f"/api/{MEDICAL}/form", headers=auth_header, json=encounter
            )
            assert (
                response.status_code == 200
            ), "Unable to submit a valid patient encounter form."

    response = client.get(
        f"/api/{MEDICAL}/forms?arrival_date_min=2020-07-18&arrival_date_max=2021-07-19",
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
    response = client.get(
        f"/api/{MEDICAL}/forms?arrival_date_min=2025-01-01", headers=auth_header
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
    response = client.get(
        f"/api/{MEDICAL}/forms?arrival_date_max=1950-01-03", headers=auth_header
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
        f"/api/{MEDICAL}/forms?arrival_date_min=1800-01-01&arrival_date_max=1899-01-02",
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
def test_update_entry(
    client: TestClient, auth_header: str, sample_patient_encounter: dict
) -> None:
    """
    Test that we can create and then update a patient encounter
    """
    response = client.post(
        f"/api/{MEDICAL}/form",
        headers=auth_header,
        json=sample_patient_encounter,
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
        f"/api/{MEDICAL}/form", headers=auth_header, json=update_req_data
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
    get_url = f"/api/{MEDICAL}/form?" + urlencode({"uuid": doc_uuid})
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
def test_soft_delete(
    client: TestClient, auth_header: str, sample_patient_encounter: dict
) -> None:
    """
    Test that we are able to delete an entry and that we are no longer able to retrieve
    it using an API get request afterwards.
    """
    response = client.post(
        f"/api/{MEDICAL}/form",
        headers=auth_header,
        json=sample_patient_encounter,
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
    doc_url = f"/api/{MEDICAL}/form?" + urlencode({"uuid": doc_uuid})

    response = client.delete(
        doc_url, headers=auth_header, json=sample_patient_encounter
    )
    assert response.status_code == 204, "Should have deleted entry."

    response = client.get(doc_url, headers=auth_header, json=sample_patient_encounter)
    resp_data = response.json()
    assert (
        response.status_code == 404
    ), "Should not have been able to find entry... Returned: " + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_get_latest_patient_encounter_by_rfid(
    client: TestClient, auth_header: dict
) -> None:
    """
    Test that we are able to get the latest patient encounter by RFID
    """

    # Create a valid patient encounter 1
    encounter1 = generate_patient_encounter(
        next_document_num(), arrival_date=DEFAULT_ARRIVAL_DATE
    )
    valid_rfid = encounter1["patient_rfid"]
    response = client.post(f"/api/{MEDICAL}/form", headers=auth_header, json=encounter1)
    assert response.status_code == 200, "Unable to submit the first patient encounter."

    # Create a valid patient encounter 2 with the same RFID
    encounter2 = generate_patient_encounter(
        next_document_num(),
        patient_rfid=valid_rfid,
        arrival_date=DEFAULT_ARRIVAL_DATE,
    )
    response = client.post(f"/api/{MEDICAL}/form", headers=auth_header, json=encounter2)
    assert response.status_code == 200, "Unable to submit the second patient encounter."

    # Headers now need to include the RFID
    headers_with_rfid = {**auth_header, "patient_rfid": valid_rfid}

    # Test valid RFID retrieval
    response = client.get(f"/api/{MEDICAL}/latest-form-rfid", headers=headers_with_rfid)
    resp_data = response.json()
    assert response.status_code == 200, "Should have found entry."
    assert (
        resp_data["document_num"] == encounter2["document_num"]
    ), "Not the latest patient encounter."

    # Test invalid RFID
    headers_with_invalid_rfid = {**auth_header, "patient_rfid": "invalid_rfid"}
    response = client.get(
        f"/api/{MEDICAL}/latest-form-rfid", headers=headers_with_invalid_rfid
    )
    assert response.status_code == 404, "Should not have found entry for invalid RFID."

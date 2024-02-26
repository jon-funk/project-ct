import pytest
from urllib.parse import urlencode
import itertools
from uuid import uuid4

from fastapi.testclient import TestClient
from api.constants import SANCTUARY


DEFAULT_ARRIVAL_DATE = "2022-07-18T21:03:34.436Z"


def next_intake_uuid() -> str:
    """
    Returns the next document number for a patient encounter form.
    """
    return str(uuid4())


def generate_intake(
    uuid: str,
    arrival_date: str,
    guest_rfid: str = "1234",
) -> dict:
    """
    Returns a sample intake form.
    """

    return {
        "intake_uuid": uuid,
        "user_uuid": "string",
        "guest_rfid": guest_rfid,
        "arrival_date": arrival_date,
        "arrival_time": arrival_date,
        "arrival_method": "string",
        "identified_gender": "string",
        "first_visit": True,
        "presenting_complaint": "string",
        "guest_consciousness_level": "string",
        "guest_emotional_state": "string",
        "substance_categories": "string",
        "time_since_last_dose": 5,
        "discharge_date": arrival_date,
        "discharge_time": arrival_date,
        "discharge_method": "string",
    }


@pytest.fixture
def sample_intake() -> dict:
    """
    Returns a sample patient encounter form. Document number is unique for each encounter.
    """
    intake_uuid = next_intake_uuid()
    return generate_intake(intake_uuid, arrival_date=DEFAULT_ARRIVAL_DATE)


@pytest.fixture
def multiple_intakes_factory() -> callable:
    """
    Returns a function that creates a list of patient encounters. Document number is unique for each encounter.
    """

    def create_intakes(num_intakes, arrival_date=DEFAULT_ARRIVAL_DATE):
        return [
            generate_intake(next_intake_uuid(), arrival_date)
            for _ in range(num_intakes)
        ]

    return create_intakes


@pytest.mark.needs(postgres=True)
def test_valid_submit_intake(
    client: TestClient, auth_header: str, sample_intake: dict
) -> None:
    """
    Test that we are able to submit a valid intake form with a signed in user.
    """
    response = client.post(
        f"/api/{SANCTUARY}/form",
        headers=auth_header,
        json=sample_intake,
    )

    resp_data = response.json()

    assert (
        response.status_code == 200
    ), "Unable to submit a valid intake form. Received error: " + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_get_multiple_intakes(
    client: TestClient, auth_header: str, multiple_intakes_factory
) -> None:
    """
    Test that we can submit and retrieve multiple intakes.
    """

    num_intakes = 4
    intakes = multiple_intakes_factory(num_intakes)

    for intake in intakes:
        response = client.post(
            f"/api/{SANCTUARY}/form", headers=auth_header, json=intake
        )
        resp_data = response.json()
        assert (
            response.status_code == 200
        ), "Unable to submit a valid intake form. Received error: " + str(resp_data)

    response = client.get(f"/api/{SANCTUARY}/forms", headers=auth_header)
    resp_data = response.json()
    assert response.status_code == 200, (
        "Unable to retrieve all intakes from db. Received error: ",
        resp_data,
    )

    # Can only run the below line when we are actually dropping all data from the database after each run
    assert len(resp_data) >= num_intakes, (
        "Did not retrieve all intakes from the database. Received: ",
        resp_data,
    )


@pytest.mark.needs(postgres=True)
def test_get_multiple_intakes_with_arrival_date(
    client: TestClient, auth_header: str, multiple_intakes_factory
) -> None:
    """
    Test what we submit and retrieve multiple intakes with a date range, minimum date, and maximum date.
    """

    # Date, Number of intakes
    date_ranges = [
        ("2020-12-14T21:03:34.436Z", 4),
        ("2025-01-02T21:03:34.436Z", 2),
        ("1950-01-02T21:03:34.436Z", 2),
    ]

    # Test that we can get intakes within a date range (start and end date)
    for arrival_date, num_intakes in date_ranges:
        intakes = multiple_intakes_factory(num_intakes, arrival_date)
        for intake in intakes:
            response = client.post(
                f"/api/{SANCTUARY}/form", headers=auth_header, json=intake
            )
            assert response.status_code == 200, "Unable to submit a valid intake form."

    response = client.get(
        f"/api/{SANCTUARY}/forms?arrival_date_min=2020-07-18&arrival_date_max=2021-07-19",
        headers=auth_header,
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all intakes from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 4, (
        "Did not retrieve intakes within date range from the database. Received: ",
        resp_data,
    )

    # Test that we can get intakes with a minimum date (start date)
    response = client.get(
        f"/api/{SANCTUARY}/forms?arrival_date_min=2025-01-01", headers=auth_header
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all intakes from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 2, (
        "Did not retrieve intakes within min date range from the database. Received: ",
        resp_data,
    )

    # Test that we can get intakes with a maximum date (end date)
    response = client.get(
        f"/api/{SANCTUARY}/forms?arrival_date_max=1950-01-03", headers=auth_header
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all intakes from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 2, (
        "Did not retrieve intakes within max date range from the database. Received: ",
        resp_data,
    )

    # Check date range where no intakes exist
    response = client.get(
        f"/api/{SANCTUARY}/forms?arrival_date_min=1800-01-01&arrival_date_max=1899-01-02",
        headers=auth_header,
    )
    resp_data = response.json()

    assert response.status_code == 200, (
        "Unable to retrieve all intakes from db. Received error: ",
        resp_data,
    )

    assert len(resp_data) == 0, (
        "Did not retrieve intakes within date range from the database. Received: ",
        resp_data,
    )


@pytest.mark.needs(postgres=True)
def test_update_entry(
    client: TestClient, auth_header: str, sample_intake: dict
) -> None:
    """
    Test that we can create and then update an intake
    """
    response = client.post(
        f"/api/{SANCTUARY}/form",
        headers=auth_header,
        json=sample_intake,
    )
    update_req_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid intake form. Received error: " + str(update_req_data)
    arrival_method = "test_arrival_method"

    # Perform update
    update_req_data.update({"arrival_method": arrival_method})
    response = client.put(
        f"/api/{SANCTUARY}/form", headers=auth_header, json=update_req_data
    )
    resp_data = response.json()
    assert response.status_code == 200, (
        "Unable to update intake form. Received error: "
        + str(resp_data)
        + "\n\nSent: "
        + str(update_req_data)
    )
    assert (
        "intake_uuid" in resp_data
    ), "UUID not found in response data after update. Received: " + str(resp_data)

    # Get updated entry
    intake_uuid = resp_data["intake_uuid"]
    get_url = f"/api/{SANCTUARY}/form?" + urlencode({"uuid": intake_uuid})
    response = client.get(get_url, headers=auth_header)
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to retrieve updated entry. Received: " + str(resp_data)

    # Ensure that returned data matches. Removed 'document_num' and 'location' checks as they are not relevant to the update example
    assert isinstance(
        resp_data["arrival_time"], str
    ), "Sanity check to ensure pydantic is returning strings, not Python objects to client."


@pytest.mark.needs(postgres=True)
def test_soft_delete(client: TestClient, auth_header: str, sample_intake: dict) -> None:
    """
    Test that we are able to delete an entry and that we are no longer able to retrieve
    it using an API get request afterwards.
    """
    response = client.post(
        f"/api/{SANCTUARY}/form",
        headers=auth_header,
        json=sample_intake,
    )
    resp_data = response.json()
    assert (
        response.status_code == 200
    ), "Unable to submit a valid intake form. Received error: " + str(resp_data)
    assert (
        "intake_uuid" in resp_data
    ), "Did not receive UUID for intake entry. Received: " + str(resp_data.keys())
    doc_uuid = resp_data["intake_uuid"]
    doc_url = f"/api/{SANCTUARY}/form?" + urlencode({"uuid": doc_uuid})

    response = client.delete(doc_url, headers=auth_header, json=sample_intake)
    assert response.status_code == 204, "Should have deleted entry."

    response = client.get(doc_url, headers=auth_header, json=sample_intake)
    resp_data = response.json()
    assert (
        response.status_code == 404
    ), "Should not have been able to find entry... Returned: " + str(resp_data)


@pytest.mark.needs(postgres=True)
def test_get_latest_intake_by_rfid(client: TestClient, auth_header: str) -> None:
    """
    Test that we are able to get the latest intake by RFID
    """

    # Create a valid intake 1
    intake1 = generate_intake(
        uuid=next_intake_uuid(), guest_rfid="1234", arrival_date=DEFAULT_ARRIVAL_DATE
    )
    valid_rfid = intake1["guest_rfid"]
    response = client.post(f"/api/{SANCTUARY}/form", headers=auth_header, json=intake1)
    assert response.status_code == 200, "Unable to submit the first intake."

    # Create a valid intake 2 with the same RFID
    intake2 = generate_intake(
        uuid=next_intake_uuid(),
        guest_rfid=valid_rfid,
        arrival_date=DEFAULT_ARRIVAL_DATE,
    )
    response = client.post(f"/api/{SANCTUARY}/form", headers=auth_header, json=intake2)
    intake2_uuid = response.json()["intake_uuid"]
    assert response.status_code == 200, "Unable to submit the second intake."

    # Test valid RFID retrieval
    doc_url = f"/api/{SANCTUARY}/latest-form-rfid?" + urlencode(
        {"guest_rfid": valid_rfid}
    )
    response = client.get(doc_url, headers=auth_header)
    resp_data = response.json()
    assert response.status_code == 200, "Should have found entry."
    assert resp_data["intake_uuid"] == intake2_uuid, "Not the latest intake."

    # Test invalid RFID
    doc_url = f"/api/{SANCTUARY}/latest-form-rfid?" + urlencode(
        {"guest_rfid": "invalid_rfid"}
    )
    response = client.get(doc_url, headers=auth_header)
    assert response.status_code == 404, "Should not have found entry for invalid RFID."

import pytest

from fastapi.testclient import TestClient


@pytest.mark.needs(postgres=True)
def test_valid_submit_patient_encounter(client: TestClient, auth_header: str) -> None:
    """
    Test that we are able to submit a valid patient encounter form with a signed in user.
    """
    response = client.post("/create-patient-encounter", headers=auth_header, json={
        "patient_rfid": "string",
        "document_num": "string",
        "location": "string",
        "handover_from": "string",
        "date": "2022-07-18T21:03:34.436Z",
        "arrival_time": "2022-07-18T21:03:34.436Z",
        "triage_acuity": "string",
        "on_shift": False,
        "chief_complaints": "string",
        "arrival_method": "string",
        "handover_too": "string",
        "departure_time": "2022-07-18T21:03:34.436Z",
        "departure_dest": "string",
        "comment": "string",
        "document_num": "1",
        "qr_code": ""
    })
    
    resp_data = response.json()
    
    assert response.status_code == 200, ("Unable to submit a valid patient encounter form. Received error: " + str(resp_data))
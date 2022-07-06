from fastapi.testclient import TestClient

# from api import example_api

# client = TestClient(example_api)

# test_id = 9001
# data = {"id": test_id, "name": "example_name"}


# def test_insert_example():
#     response = client.post("/example/", json=data)
#     assert response.status_code == 200 or response.status_code == 400


# def test_get_example():
#     response = client.get(f"/example/{test_id}", json=data)
#     assert response.status_code == 200
#     assert response.json() == data
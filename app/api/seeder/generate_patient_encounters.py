from typing import List
import faker
from datetime import datetime, timedelta
from passlib.hash import argon2
import random
import uuid

from api.seeder.seeds.patient_encounter_constants import (
    CHIEF_COMPLAINTS,
    GENDER,
    LOCATIONS,
    ARRIVAL_METHODS,
    TRIAGE_ACUITY,
    DEPARTURE_DESTINATIONS,
)

fake = faker.Faker()


def generate_number_of_chief_complaints() -> int:
    """Generate a random number of chief complaints

    Returns:
        int: Number of chief complaints
    """

    num_chief_complaints = random.choices([1, 2, 3], weights=[60, 30, 10], k=1)[0]

    if num_chief_complaints == 3:
        num_chief_complaints = random.randint(3, 5)

    return num_chief_complaints


def get_rand_chief_complaints(chief_complaints: List[str], num: int) -> str:
    selected_complaints = random.sample(
        chief_complaints, min(num, len(chief_complaints))
    )
    """Get a random number of chief complaints from the list of chief complaints

    Args:
        chief_complaints (List[str]): List of chief complaints
        num (int): Number of chief complaints to select

    Returns:
        str: Comma-separated string of chief complaints
    """

    # Check if "Other" is in selected complaints
    if "Other" in selected_complaints:
        other_text = "Other: " + fake.sentence()
        selected_complaints[selected_complaints.index("Other")] = other_text

    return ", ".join(selected_complaints)


def generate_optional_rfid() -> str:
    """Generate an optional RFID that may be hashed or plaintext

    Returns:
        str: RFID in the format "##:##:##:##:##:##" or hashed RFID
    """

    if random.random() < 0.3:
        return ""
    else:
        plaintext_rfid = (
            ":".join(f"{random.randint(0, 255):02x}" for _ in range(6))
        ).upper()

        if random.random() < 0.8:
            hashed_password = argon2.hash(plaintext_rfid)
            return hashed_password

        return plaintext_rfid


def generate_location() -> str:
    """Generate a random location

    Returns:
        str: Location
    """

    return LOCATIONS[0]  # Using only "Main Medical" for dashboard development


def generate_arrival_method(arrival_methods: List[str]) -> str:
    """Generate a random arrival method

    Args:
        arrival_methods (List[str]): List of arrival methods

    Returns:
        str: Arrival method
    """

    return random.choices(arrival_methods, weights=[0.7, 0.1, 0.1, 0.05, 0.05], k=1)[0]


def generate_comments(always_generate: bool) -> str:
    """Generate a random comment

    Args:
        always_generate (bool): Whether to always generate a comment

    Returns:
        str: Mock comment
    """

    if always_generate or random.random() < 0.3:
        return fake.sentence()
    else:
        return ""


def generate_triage_acuity(index: int = -1) -> str:
    """Generate a random triage acuity

    Args:
        index (int, optional): Index of triage acuity to generate. Defaults to -1.

    Returns:
        str: Triage acuity
    """

    if index >= 0 and index < len(TRIAGE_ACUITY):
        return TRIAGE_ACUITY[index]
    else:
        return random.choices(TRIAGE_ACUITY, weights=[0.35, 0.35, 0.2, 0.1], k=1)[0]


def generate_gender() -> str:
    """Generate a random gender

    Returns:
        str: Gender
    """
    return random.choices(GENDER, weights=[0.46, 0.45, 0.1], k=1)[0]


def generate_departure_destination(departure_destinations: List[str]) -> str:
    """Generate a random departure destination

    Args:
        departure_destinations (List[str]): List of departure destinations

    Returns:
        str: Departure destination
    """
    return random.choices(
        departure_destinations, weights=[0.7, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05], k=1
    )[0]


def generate_handover_from(arrival_method: str) -> str:
    """Generate a random handover from

    Args:
        arrival_method (str): Arrival method

    Returns:
        str: Handover from
    """

    if arrival_method == "security" or arrival_method == "med-transport":
        return fake.name()
    else:
        return ""


def generate_handover_to(departure_destination: str) -> str:
    """Generate a random handover to

    Args:
        departure_destination (str): Departure destination

    Returns:
        str: Handover to
    """

    if departure_destination == "security" or "hospital" in departure_destination:
        return fake.name()
    else:
        return ""


def generate_dates_and_times(
    start_date: datetime, end_date: datetime, triage_acuity: str
) -> dict[str, str]:
    """Generate random arrival and departure dates and times

    Args:
        start_date (datetime): Start date of range
        end_date (datetime): End date of range
        triage_acuity (str): Triage acuity

    Returns:
        dict[str, str]: Arrival and departure dates and times
    """

    # Generate a random arrival datetime within the given range
    arrival_date_time = fake.date_time_between(start_date=start_date, end_date=end_date)

    # 5% chance no departure date and time
    if random.random() < 0.05:
        return {
            "arrival_date": arrival_date_time.date(),
            "arrival_time": arrival_date_time.time(),
            "departure_date": None,
            "departure_time": None,
        }

    # Define length of stay based on triage_acuity
    if triage_acuity == "white":
        length_of_stay = timedelta(minutes=10)
    elif triage_acuity == "green":
        length_of_stay = timedelta(minutes=15)
    elif triage_acuity == "yellow":
        length_of_stay = timedelta(hours=random.randint(1, 15))
    elif triage_acuity == "red":
        length_of_stay = timedelta(hours=random.randint(3, 20))
    else:
        length_of_stay = timedelta(hours=random.randint(1, 4))

    # Calculate departure datetime
    departure_date_time = arrival_date_time + length_of_stay

    return {
        "arrival_date": arrival_date_time.date(),
        "arrival_time": arrival_date_time.time(),
        "departure_date": departure_date_time.date(),
        "departure_time": departure_date_time.time(),
    }


def get_random_user_uuid(user_uuids: List[str]) -> str:
    """Get a random user uuid from the list of user uuids

    Args:
        user_uuids (List[str]): List of user uuids

    Returns:
        str: User uuid
    """
    return random.choice(user_uuids)


def generate_patient_encounter_data(
    start_date: datetime,
    end_date: datetime,
    user_uuids: List[str],
    num_encounters: int = 100,
) -> List[dict[str, str]]:  # noqa: E501
    """Generate mock patient encounter data

    Args:
        start_date (datetime): Start date of range
        end_date (datetime): End date of range
        user_uuids (List[str]): List of user uuids
        num_encounters (int, optional): Number of encounters to generate. Defaults to 100.

    Returns:
        List[dict[str, str]]: List of patient encounters
    """

    encounters = []
    for _ in range(num_encounters):
        # Generate random chief complaints
        num_complaints = generate_number_of_chief_complaints()

        # 0.10 chance of 3-5 or more chief complaints
        if num_complaints == 3:
            num_complaints = random.randint(3, 5)

        chief_complaints = get_rand_chief_complaints(CHIEF_COMPLAINTS, num_complaints)
        arrival_method = generate_arrival_method(ARRIVAL_METHODS)
        departure_destination = generate_departure_destination(DEPARTURE_DESTINATIONS)

        triage_acuity = ""

        if "hospital" in departure_destination:
            triage_acuity = generate_triage_acuity(random.randint(2, 3))
        else:
            triage_acuity = generate_triage_acuity()

        always_generate_comments = (
            arrival_method == "other" or departure_destination == "other"
        )

        dates_and_times = generate_dates_and_times(start_date, end_date, triage_acuity)

        encounter = {
            "patient_encounter_uuid": str(uuid.uuid4()),
            "user_uuid": get_random_user_uuid(user_uuids),
            "document_num": fake.bothify(text="???-#######"),
            "patient_rfid": generate_optional_rfid(),
            "location": generate_location(),
            "qr_code": fake.bothify(text="##-####"),
            "arrival_date": dates_and_times["arrival_date"],
            "arrival_method": arrival_method,
            "arrival_time": dates_and_times["arrival_time"],
            "on_shift": fake.boolean(),
            "triage_acuity": triage_acuity,
            "chief_complaints": chief_complaints,
            "departure_date": dates_and_times["departure_date"],
            "departure_time": dates_and_times["departure_time"],
            "departure_dest": departure_destination,
            "handover_from": generate_handover_from(arrival_method),
            "handover_too": generate_handover_to(departure_destination),
            "comment": generate_comments(always_generate_comments),
            "age": random.randint(0, 100),
            "gender": generate_gender(),
        }
        encounters.append(encounter)
    return encounters

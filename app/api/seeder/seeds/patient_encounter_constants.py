"""
Constants for patient encounters.
"""

CHIEF_COMPLAINTS = [
    "Abdominal Pain",
    "Adverse Drug Effect",
    "Agitation",
    "Allergic Reaction",
    "Anxiety",
    "Bizarre Behaviour",
    "Chest Pain",
    "Dizziness/Presyncope/Lightheaded",
    "Hallucinations",
    "Headache",
    "Loss of Consciousness",
    "Nausea/Vomiting",
    "Other",
    "Other Pain",
    "Seizure",
    "Shortness of Breath",
    "Trauma",
]

GENDER = [
    "Female",
    "Male",
    "Other",
]

LOCATIONS = [
    "Main Medical",
    "Harm Reduction",
]

ARRIVAL_METHODS = [
    "self-presented",
    "med-transport",
    "security",
    "harm-reduction",
    "other",
]

TRIAGE_ACUITY = ["white", "green", "yellow", "red"]

DEPARTURE_DESTINATIONS = [
    "back-to-festival",
    "left-ama",
    "sanctuary",
    "security",
    "hospital-private",
    "hospital-ambulance",
    "other",
]

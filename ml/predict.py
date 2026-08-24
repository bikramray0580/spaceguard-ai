import joblib
import pandas as pd

FEATURES = [
    "minimum_distance",
    "relative_velocity",
    "time_to_closest_approach",
    "altitude",
    "inclination_difference",
    "eccentricity"
]

model = joblib.load("models/risk_model.pkl")


def predict_risk(encounter):
    data = pd.DataFrame([encounter])[FEATURES]

    probability = model.predict_proba(data)[0][1]

    risk_score = round(probability * 100)

    if risk_score >= 70:
        category = "HIGH"
    elif risk_score >= 40:
        category = "MEDIUM"
    else:
        category = "LOW"

    return {
        "risk_probability": round(float(probability), 4),
        "risk_score": risk_score,
        "risk_category": category
    }


if __name__ == "__main__":

    encounter = {
        "minimum_distance": 35,
        "relative_velocity": 9.5,
        "time_to_closest_approach": 12,
        "altitude": 400,
        "inclination_difference": 0.4,
        "eccentricity": 0.08
    }

    result = predict_risk(encounter)

    print(result)
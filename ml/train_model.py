import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, accuracy_score

FEATURES = [
    "minimum_distance",
    "relative_velocity",
    "time_to_closest_approach",
    "altitude",
    "inclination_difference",
    "eccentricity"
]

from pathlib import Path
import pandas as pd

BASE_DIR = Path(__file__).resolve().parent
df = pd.read_csv(BASE_DIR / "data" / "training_data.csv")

X = df[FEATURES]
y = df["risk"]

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)

model = RandomForestClassifier(
    n_estimators=200,
    random_state=42,
    class_weight="balanced"
)

model.fit(X_train, y_train)

predictions = model.predict(X_test)

print("Accuracy:", accuracy_score(y_test, predictions))
print("\nClassification Report:")
print(classification_report(y_test, predictions))

joblib.dump(model, "models/risk_model.pkl")

print("\nModel saved to models/risk_model.pkl")
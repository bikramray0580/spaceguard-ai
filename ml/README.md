# SpaceGuard-AI — Machine Learning

## Overview

The ML part of **SpaceGuard-AI** is used to predict the collision risk between two space objects based on their orbital and close-approach information.

The model takes different parameters related to the objects and gives a risk probability. This is then converted into a score out of 100 and classified as **Low, Medium, or High risk**.

## How It Works

The overall process is:

```text
Input Data
    ↓
Data Preprocessing
    ↓
Feature Selection
    ↓
Train-Test Split
    ↓
Random Forest Model
    ↓
Model Evaluation
    ↓
Risk Prediction
```

The model mainly uses the following features:

* `minimum_distance` — minimum distance between the two objects
* `relative_velocity` — relative velocity between the objects
* `time_to_closest_approach` — time until the objects reach their closest point
* `altitude` — orbital altitude
* `inclination_difference` — difference in orbital inclination
* `eccentricity` — orbital eccentricity

The target variable is `risk`, where:

```text
0 → SAFE
1 → RISK
```

## Model Used

For the classification task, I used a **Random Forest Classifier**.

Random Forest was chosen because it works well with multiple numerical features and can capture non-linear relationships between the input parameters. It also gives good performance without requiring the dataset to be extremely large.

The trained model is saved as:

```text
models/risk_model.pkl
```

## Dataset

The current model uses a synthetic dataset containing **1,000 records**.

Each record represents a possible encounter between space objects and contains the orbital and collision-related parameters required by the model.

The dataset is mainly being used for developing and testing the ML pipeline. One of the next steps would be replacing or combining it with real orbital data.

## Model Performance

The current model gives approximately:

| Metric           | Score |
| ---------------- | ----: |
| Accuracy         | 96.5% |
| Precision (Risk) |   82% |
| Recall (Risk)    |  100% |
| F1-Score (Risk)  |   90% |

The recall for the risk class is especially important here. In a collision-risk prediction system, detecting possible risky cases is more important than simply maximizing overall accuracy.

## Project Structure

```text
ml/
├── data/
│   └── training_data.csv
├── models/
│   └── risk_model.pkl
├── train_model.py
├── predict.py
├── evaluate_model.py
├── requirements.txt
└── README.md
```

### `train_model.py`

Used to train the Random Forest model using the training dataset. The trained model is then saved so it can be used later without retraining every time.

### `predict.py`

Loads the saved model and uses it to predict the risk for new input data.

The output includes the risk probability, risk score, and risk level.

### `evaluate_model.py`

Used to check how well the trained model performs using metrics such as accuracy, precision, recall, and F1-score.

### `training_data.csv`

The dataset used for training and testing the model.

### `risk_model.pkl`

The saved trained Random Forest model.

## Running the ML Model

First, create a virtual environment:

```bash
python -m venv tfenv
```

Activate it on Windows:

```bash
tfenv\Scripts\activate
```

Then install the required libraries:

```bash
pip install -r requirements.txt
```

To train the model:

```bash
python train_model.py
```

To evaluate it:

```bash
python evaluate_model.py
```

To make a prediction:

```bash
python predict.py
```

## Risk Score

The model produces a probability for the `RISK` class. This probability is converted into a score between 0 and 100.

```text
Risk Score = Risk Probability × 100
```

The score is then grouped into three levels:

| Score  | Risk Level |
| ------ | ---------- |
| 0–33   | LOW        |
| 34–66  | MEDIUM     |
| 67–100 | HIGH       |

This makes the model's output easier to understand instead of showing only a probability value.

## Technologies Used

* Python
* Pandas
* NumPy
* Scikit-learn
* Random Forest
* Pickle

## Future Improvements

There are several things that can be added to improve the ML part of the project:

* Use real satellite and orbital datasets instead of only synthetic data
* Increase the size of the training dataset
* Try other ML algorithms and compare their performance
* Tune the Random Forest hyperparameters
* Add cross-validation
* Improve feature engineering
* Use real-time orbital data for predictions
* Add explainability so users can understand why a particular encounter was classified as risky

## Note

This ML model is currently a prototype developed for the **SpaceGuard-AI** project. The predictions are meant for project and demonstration purposes and should not be treated as actual collision-avoidance decisions for spacecraft.

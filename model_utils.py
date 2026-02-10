import joblib
import pandas as pd

# Load model and features
model = joblib.load("credit_risk_model.pk1")
model_features = joblib.load("model_features.pk1")

numeric_cols = [
    "person_age",
    "person_income",
    "person_emp_length",
    "loan_amnt",
    "loan_int_rate",
    "loan_percent_income",
    "cb_person_cred_hist_length"
]

def fill_missing_numeric(df: pd.DataFrame):
    for col in numeric_cols:
        if col in df.columns:
            df[col] = df[col].fillna(df[col].median())
    return df

def predict(input_data: dict):
    """Returns both prediction and probability"""
    try:
        input_df = pd.DataFrame([input_data])
        input_df = fill_missing_numeric(input_df)

        for col in model_features:
            if col not in input_df.columns:
                input_df[col] = 0  # default for missing features

        input_df = input_df[model_features]

        pred_class = int(model.predict(input_df)[0])

        # Probability for class 1 (High Risk)
        if hasattr(model, "predict_proba"):
            prob = float(model.predict_proba(input_df)[0][1])
        else:
            prob = None

        return {"prediction": pred_class, "probability": prob}

    except Exception as e:
        # Always return a valid structure
        return {"prediction": None, "probability": 0, "error": str(e)}


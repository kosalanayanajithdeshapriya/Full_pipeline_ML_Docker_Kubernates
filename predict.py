import joblib
import pandas as pd

# Load trained model
model = joblib.load("model.pkl")

# Example input data
sample = pd.DataFrame([{
    "N": 90,
    "P": 42,
    "K": 43,
    "temperature": 20.87974371,
    "humidity": 82.00274423,
    "ph": 6.502985292,
    "rainfall": 202.9355362
}])

# Predict
prediction = model.predict(sample)

print("Predicted crop:", prediction[0])
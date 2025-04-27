#!/usr/bin/env python3
"""
Test script to debug the ML model prediction issues.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd

# Get the directory of the current script
script_dir = os.path.dirname(os.path.abspath(__file__))

# Path to the model file
model_path = os.path.join(os.path.dirname(script_dir), 'xgboost_amount_model.joblib')

try:
    # Load the model
    print(f"Loading model from: {model_path}")
    model = joblib.load(model_path)
    print(f"Model type: {type(model)}")
    
    # Inspect model properties
    if hasattr(model, 'n_features_'):
        print(f"Number of features expected: {model.n_features_}")
    if hasattr(model, 'n_features_in_'):
        print(f"Number of features expected: {model.n_features_in_}")
    if hasattr(model, 'feature_names_in_'):
        print(f"Feature names: {model.feature_names_in_}")
        
    # Create a sparse feature vector with the correct number of features
    print("\nTrying to create a sparse feature vector")
    # Create an array of zeros with the expected feature count
    num_features = 772  # As reported in the error message
    
    # Create a sparse vector where most values are 0
    sparse_vector = np.zeros((1, num_features))
    
    # Set a few features to non-zero values
    # Assuming source is encoded in the first few features
    # and destination in the next few, etc.
    # This is a guess - we'd need to know the actual encoding
    
    # Set source feature (e.g., KYN = feature 0)
    sparse_vector[0, 0] = 1
    
    # Set destination feature (e.g., DHI = feature 50)
    sparse_vector[0, 50] = 1
    
    # Set numerical values (assuming these are the last 2 features)
    sparse_vector[0, 770] = 21412  # Distance
    sparse_vector[0, 771] = 4124   # Weight
    
    try:
        print("Attempting prediction with sparse vector...")
        pred = model.predict(sparse_vector)
        print(f"Prediction: {pred}")
    except Exception as e:
        print(f"Error with sparse vector: {str(e)}")

    # Alternative: try a more careful approach with pandas DataFrame
    print("\nTrying DataFrame approach with feature names")
    dummy_features = {f'f{i}': 0 for i in range(num_features)}
    
    # Set specific features 
    # (based on the importance values we saw in the previous run)
    dummy_features['f0'] = 1      # Assuming source encoding
    dummy_features['f1'] = 1      # Assuming destination encoding
    dummy_features['f2'] = 21412  # Distance
    dummy_features['f3'] = 4124   # Weight
    
    df = pd.DataFrame([dummy_features])
    
    try:
        print("Attempting prediction with DataFrame...")
        pred = model.predict(df)
        print(f"Prediction: {pred}")
    except Exception as e:
        print(f"Error with DataFrame: {str(e)}")

except Exception as e:
    print(f"Overall error: {str(e)}") 
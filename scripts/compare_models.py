#!/usr/bin/env python3
"""
Script to compare both XGBoost models and determine which one works better for our use case.
"""

import os
import joblib
import numpy as np

def main():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_dir = os.path.dirname(script_dir)
    
    # Paths to both model files
    original_model_path = os.path.join(project_dir, 'xgboost_model.joblib')
    amount_model_path = os.path.join(project_dir, 'xgboost_amount_model.joblib')
    
    print("Loading both models...")
    
    try:
        original_model = joblib.load(original_model_path)
        print(f"Original model type: {type(original_model)}")
    except Exception as e:
        print(f"Failed to load original model: {str(e)}")
        original_model = None
    
    try:
        amount_model = joblib.load(amount_model_path)
        print(f"Amount model type: {type(amount_model)}")
    except Exception as e:
        print(f"Failed to load amount model: {str(e)}")
        amount_model = None
    
    # Test cases
    test_cases = [
        {"source": "KYN", "destination": "DHI", "distance": 1000, "weight": 100, "demand": 13.0},
        {"source": "KYN", "destination": "DHI", "distance": 5000, "weight": 500, "demand": 13.0},
        {"source": "KYN", "destination": "DHI", "distance": 10000, "weight": 1000, "demand": 13.0},
        {"source": "KYN", "destination": "DHI", "distance": 21412, "weight": 4124, "demand": 13.0}
    ]
    
    # Test original model
    if original_model:
        print("\n=== Testing Original Model (xgboost_model.joblib) ===")
        for i, test in enumerate(test_cases):
            try:
                # Original model expects [distance, weight, demand]
                features = np.array([[test["distance"], test["weight"], test["demand"]]])
                prediction = original_model.predict(features)[0]
                
                print(f"Test {i+1}: Distance={test['distance']}, Weight={test['weight']}, Demand={test['demand']}")
                print(f"  Prediction: {prediction}")
                print(f"  In Crores: {prediction / 10000000:.4f} cr")
            except Exception as e:
                print(f"Error with original model on test {i+1}: {str(e)}")
    
    # Test amount model
    if amount_model:
        print("\n=== Testing Amount Model (xgboost_amount_model.joblib) ===")
        
        # Create different feature formats to try with the amount model
        feature_formats = [
            # Standard 3-feature approach
            lambda t: np.array([[t["distance"], t["weight"], t["demand"]]]),
            
            # Try one-hot encoding for categorical features (simplified)
            lambda t: create_sparse_features(t, 772),
            
            # Try with the format discovered in our debug script
            lambda t: create_features_with_important_positions(t)
        ]
        
        for format_idx, feature_creator in enumerate(feature_formats):
            print(f"\nFeature Format #{format_idx + 1}:")
            
            for i, test in enumerate(test_cases):
                try:
                    features = feature_creator(test)
                    prediction = amount_model.predict(features)[0]
                    
                    print(f"Test {i+1}: Distance={test['distance']}, Weight={test['weight']}, Demand={test['demand']}")
                    print(f"  Prediction: {prediction}")
                    print(f"  Note: This appears to be already in Crores")
                except Exception as e:
                    print(f"Error with amount model on test {i+1}: {str(e)}")

def create_sparse_features(test, num_features=772):
    """Create a sparse feature vector for the amount model"""
    features = np.zeros((1, num_features))
    
    # Set source feature (position 0)
    features[0, 0] = 1
    
    # Set destination feature (position 1)
    features[0, 1] = 1
    
    # Set numeric features (positions 2 and 3)
    features[0, 2] = test["distance"]
    features[0, 3] = test["weight"]
    
    return features

def create_features_with_important_positions(test):
    """Create features with positions that showed importance in our tests"""
    features = np.zeros((1, 772))
    
    # From our debug_model_features.py, we found f0, f1, f96 were important
    features[0, 0] = 1  # Source
    features[0, 1] = 1  # Destination
    features[0, 96] = test["distance"]  # Distance in an important position
    features[0, 191] = test["weight"]   # Weight in another important position
    
    return features

if __name__ == "__main__":
    main() 
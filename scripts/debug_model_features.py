#!/usr/bin/env python3
"""
Detailed debugging script to understand the XGBoost model's feature structure.
This will help us implement the model correctly in our application.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
import xgboost as xgb

def debug_model():
    # Get the directory of the current script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the model file
    model_path = os.path.join(os.path.dirname(script_dir), 'xgboost_amount_model.joblib')
    
    print(f"Loading model from: {model_path}")
    model = joblib.load(model_path)
    print(f"Model type: {type(model)}")
    
    # Get the XGBoost booster from the model
    booster = model.get_booster()
    
    # Get feature importance scores
    importance = booster.get_score(importance_type='weight')
    print(f"\nNumber of features with importance scores: {len(importance)}")
    print("Top 10 most important features:")
    sorted_importance = sorted(importance.items(), key=lambda x: x[1], reverse=True)
    for feature, score in sorted_importance[:10]:
        print(f"  {feature}: {score}")
    
    # Try to extract feature names safely
    feature_names = getattr(booster, 'feature_names', None)
    if feature_names:
        print(f"\nFeature names from booster: {feature_names[:10]}...")
    else:
        print("\nNo feature names available from booster")
    
    # Dump the model to understand its structure
    model_dump = booster.get_dump(with_stats=True)
    print(f"\nNumber of trees in the model: {len(model_dump)}")
    
    # Analyze the first few trees to understand feature usage
    print("\nAnalyzing the first tree to understand feature usage:")
    
    # Simple parsing of the first tree dump to extract feature IDs
    first_tree = model_dump[0]
    feature_ids = []
    for line in first_tree.split('\n'):
        if '[f' in line:
            try:
                feature_id = line.split('[f')[1].split('<')[0]
                if feature_id not in feature_ids:
                    feature_ids.append(feature_id)
            except IndexError:
                pass
    
    print(f"Features used in the first tree: {feature_ids}")
    
    # Test the model with various input formats
    test_predictions(model, importance)

def test_predictions(model, importance):
    print("\n=== Testing different prediction approaches ===")
    
    # Important features from the model
    important_features = [int(f.replace('f', '')) for f in importance.keys()]
    print(f"Number of important features: {len(important_features)}")
    print(f"Top 5 important feature indices: {important_features[:5]}")
    
    # Test 1: Systematic testing of feature combinations
    print("\nTest 1: Testing various feature combinations")
    
    # Creating structured tests based on important features
    num_features = 772  # As reported from previous tests
    
    # Use real values from the screenshot
    real_distance = 21412
    real_weight = 4124
    
    results = []
    
    # Test placing distance and weight at different positions
    # Focus on the most important feature positions
    distance_positions = [2, 3] + important_features[:3]
    weight_positions = [2, 3] + important_features[3:6]
    
    for src_pos in [0, 1]:
        for dst_pos in [0, 1, 50, 51]:
            if src_pos == dst_pos:
                continue
                
            for dist_pos in distance_positions:
                for weight_pos in weight_positions:
                    if dist_pos == weight_pos:
                        continue
                        
                    features = np.zeros((1, num_features))
                    
                    # Set source and destination
                    features[0, src_pos] = 1
                    features[0, dst_pos] = 1
                    
                    # Set distance and weight
                    features[0, dist_pos] = real_distance
                    features[0, weight_pos] = real_weight
                    
                    # Make prediction
                    pred = model.predict(features)[0]
                    
                    # Store only if prediction is meaningful (not close to zero)
                    if pred > 0.1:
                        results.append((src_pos, dst_pos, dist_pos, weight_pos, pred))
    
    # Sort by prediction values
    results.sort(key=lambda x: x[4], reverse=True)
    
    # Print best predictions
    print("\nTop predictions:")
    for i, (src, dst, dist, weight, pred) in enumerate(results[:10]):
        print(f"  {i+1}. Source:{src}, Dest:{dst}, Distance:{dist}, Weight:{weight}, Prediction: {pred}")
    
    # If good predictions found, test with varying distances and weights
    if results:
        print("\nTest 2: Testing distance and weight sensitivity")
        best = results[0]  # Get the configuration with the highest prediction
        src_pos, dst_pos, dist_pos, weight_pos = best[0], best[1], best[2], best[3]
        
        distances = [500, 1000, 5000, 10000, 20000, 30000]
        weights = [100, 500, 1000, 2000, 5000]
        
        print(f"Using positions: Source:{src_pos}, Dest:{dst_pos}, Distance:{dist_pos}, Weight:{weight_pos}")
        
        for distance in distances:
            for weight in weights:
                features = np.zeros((1, num_features))
                features[0, src_pos] = 1
                features[0, dst_pos] = 1
                features[0, dist_pos] = distance
                features[0, weight_pos] = weight
                
                pred = model.predict(features)[0]
                print(f"  Distance: {distance}, Weight: {weight}, Prediction: {pred}")
    
    if results:
        # Export the best configuration for use in the real prediction script
        best_config = results[0]
        src_pos, dst_pos, dist_pos, weight_pos = best_config[0], best_config[1], best_config[2], best_config[3]
        
        with open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'model_config.py'), 'w') as f:
            f.write(f"""# Feature positions for the XGBoost model
SOURCE_POSITION = {src_pos}
DESTINATION_POSITION = {dst_pos}
DISTANCE_POSITION = {dist_pos}
WEIGHT_POSITION = {weight_pos}
""")
        
        print("\nSaved best configuration to model_config.py")

if __name__ == "__main__":
    debug_model() 
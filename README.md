# Transport Price Calculator with ML Model

A React application that calculates transportation costs using an XGBoost ML model. This project combines a frontend built with React, TypeScript, and Tailwind CSS with a backend Express server that interfaces with a Python script for ML model inference.

## Features

- Calculate transport prices based on distance, weight, and location data
- Uses a pre-trained ML model for accurate price predictions
- Beautiful responsive UI with Tailwind CSS
- Backend API using Express
- Python integration for ML model inference

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Python 3.6 or higher
- Required Python packages:
  - joblib
  - numpy
  - scikit-learn
  - xgboost

## Installation

1. Clone the repository
2. Install JavaScript dependencies:

```
npm install
```

3. Install Python dependencies:

```
pip install joblib numpy scikit-learn xgboost
```

## Running the Application

To start the development server:

```
npm run dev
```

This will start:
- The React frontend at http://localhost:5173
- The Express API server at http://localhost:3001

## How It Works

1. The frontend collects information about:
   - Start and destination locations
   - Distance (km)
   - Weight (tonnes)

2. When calculating the price:
   - The frontend sends a request to the Express server
   - The server calls a Python script with the required parameters
   - The Python script loads the ML model and makes a prediction
   - The result is sent back to the frontend

3. The ML model takes three parameters:
   - Distance (km)
   - Weight (tonnes)
   - Demand (calculated from location factors)

## ML Model

The application uses an XGBoost model (`xgboost_model.joblib`) trained on historical transportation data. The model generates price predictions based on distance, weight, and demand factors.

## Project Structure

- `src/` - Frontend React code
  - `components/` - React components
  - `utils/` - Utility functions including ML calculator
  - `data/` - Location data
- `scripts/` - Python scripts for ML inference
- `server.cjs` - Express server for the backend API
- `xgboost_model.joblib` - The ML model file

## Building for Production

To build the application for production:

```
npm run build
npm start
```

This will build the React app and start the Express server which serves both the static frontend files and the API endpoints.

## Notes

- The demand parameter is derived from location factors
- If the ML prediction fails, the application falls back to a formula-based calculation
- The ML model expects positive values for all parameters

Made with ❤️ by Sanchit 
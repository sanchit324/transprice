const express = require('express');
const { join } = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const { spawn } = require('child_process');
const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS and JSON parsing
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the dist directory when built
app.use(express.static(join(__dirname, 'dist')));

// API endpoint for ML model inference
app.post('/api/predict-price', (req, res) => {
  const { source, destination, distance, weight, sourceFactor, destFactor } = req.body;
  
  if (!source || !destination || typeof distance !== 'number' || typeof weight !== 'number') {
    return res.status(400).json({ 
      error: 'Invalid input data. Source and destination must be provided, and distance and weight must be numbers.' 
    });
  }
  
  // Use provided location factors or default values
  const sourceFactorValue = sourceFactor || 1.2;
  const destFactorValue = destFactor || 1.2;
  
  // Run Python script for inference (assumes you have Python installed)
  const pythonProcess = spawn('python', [
    join(__dirname, 'scripts', 'predict.py'),
    source,
    destination,
    distance.toString(),
    weight.toString(),
    sourceFactorValue.toString(),
    destFactorValue.toString()
  ]);
  
  let result = '';
  let errorOutput = '';
  
  // Collect data from script
  pythonProcess.stdout.on('data', (data) => {
    result += data.toString();
  });
  
  pythonProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  });
  
  // Send back the result when the script finishes
  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      console.error(`Python process exited with code ${code}`);
      console.error(errorOutput);
      return res.status(500).json({ error: 'Failed to predict price' });
    }
    
    try {
      const price = parseFloat(result.trim());
      return res.json({ price });
    } catch (err) {
      console.error('Error parsing Python output:', err);
      return res.status(500).json({ error: 'Invalid output from prediction model' });
    }
  });
});

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
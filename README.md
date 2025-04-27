# Transport Price Calculator

A React application that calculates transportation costs based on source, destination, distance, and weight, using machine learning for price prediction.

## Features

- Interactive price calculator form
- Machine learning-based price prediction
- Responsive design with animations
- Serverless API integration
- Light/dark theme support

## Deployment

The application is deployed using Vercel, which provides:
- Automatic deployment from GitHub
- Serverless functions for the ML price prediction
- Global CDN distribution
- Zero configuration required

### Deployment URLs

- Production: [Your Vercel URL]

## Local Development

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser.

### Project Structure

- `/src` - React application source code
- `/api` - Vercel serverless functions
- `/scripts` - ML model scripts
- `/public` - Static assets

## Serverless API

The application uses Vercel Serverless Functions to handle the machine learning price prediction. The serverless function in `api/predict-price.js` implements the same logic as the Python script in `scripts/predict.py`.

### API Endpoints

- `POST /api/predict-price`: Predicts the price based on source, destination, distance, and weight.

  Request body:
  ```json
  {
    "source": "KYN",
    "destination": "DHI",
    "distance": 1000,
    "weight": 500,
    "sourceFactor": 1.2,
    "destFactor": 1.2
  }
  ```

  Response:
  ```json
  {
    "price": 0.12345
  }
  ```

## Deployment to Vercel

1. Push changes to GitHub
2. Connect your GitHub repository to Vercel
3. Vercel automatically deploys changes on push to the main branch

## License

[Your License Here] 
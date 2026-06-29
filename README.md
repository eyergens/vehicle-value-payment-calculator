# Vehicle Value & Payment Calculator
A Vite + React + TypeScript application built as part of a React learning build challenge.
The app allows users to search a vehicle by make, model, and year, view an estimated vehicle value, and calculate estimated monthly payments based on financing inputs.

## Live Demo
Deployed on Netlify:
* https://vehicle-value-payment-calculator.netlify.app/

## Tech Stack
* React
* TypeScript
* Vite (fast dev & optimized build)
* Netlify (deployment & hosting)
* Material UI
* Redux
* Jest

## Getting Started
### Prerequisites
* Node.js (v18+ recommended)
* npm or yarn

### Installation
```
git clone https://github.com/eyergens/vehicle-value-payment-calculator.git
cd vehicle-value-payment-calculator
npm install
```

### Development
`netlify dev`

## Environment Variables
This app uses an external vehicle pricing API (https://carapi.dev/) that requires an API key.

### Local Development
Create a `.env` file in the project root:
```env
CAR_API_KEY=your_api_key_here
```

## License
This project was built for educational and portfolio purposes.
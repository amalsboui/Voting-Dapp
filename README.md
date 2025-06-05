# Voting DApp

This project is a decentralized voting application built with a blockchain backend and a React frontend.

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or higher)
- [Docker](https://www.docker.com/) (optional, for containerized deployment)
- [Python](https://www.python.org/) (v3.10 or higher)

## Project Structure

- **backend/**: Contains the Flask backend a
- **frontend/**: Contains the React frontend.
- **contracts/**: Contains the Solidity smart contract.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-repo/voting-dapp.git
cd voting-dapp
```

### 2. Install Backend Dependencies

Navigate to the `backend` directory and install Python dependencies:

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
```

### 3. Install Frontend Dependencies

Navigate to the `frontend` directory and install Node.js dependencies:

```bash
cd ../frontend
npm install
```

### 4. Compile Smart Contracts

Navigate to the `contracts` directory and compile the Solidity smart contract:

```bash
cd ../contracts
npx hardhat compile
```

### 5. Run the Backend

Start the Flask backend:

```bash
cd ../backend
.venv\Scripts\activate
python run.py
```

The backend will be available at `http://127.0.0.1:5000`.

### 6. Run the Frontend

Start the React frontend:

```bash
cd ../frontend
npm start
```

The frontend will be available at `http://localhost:3000`.

## Docker Deployment

To deploy the application using Docker:
NB:you should start docker desktop if you are using windows

1. Build the Docker images:

   ```bash
   docker-compose build
   ```

2. Start the containers:

   ```bash
   docker-compose up
   ```

The application will be available at `http://localhost:3000`.

## Testing

### Backend Tests

Run the backend tests:

```bash
cd backend
pytest
```

### Frontend Tests

Run the frontend tests:

```bash
cd frontend
npm test
```

## GitHub Actions

This project uses GitHub Actions for continuous integration and deployment. The workflows are located in the `.github/workflows/` directory and include:

- **Backend Tests**: Runs `pytest` to ensure the Flask backend is functioning correctly.
- **Frontend Tests**: Runs `npm test` to validate the React frontend.
- **Smart Contract Compilation**: Uses Hardhat to compile Solidity contracts.

### How to Trigger Workflows

Workflows are triggered automatically on:

- **Push Events**: When code is pushed to the repository.
- **Pull Requests**: When a pull request is opened or updated.

### Viewing Workflow Status

You can view the status of workflows in the "Actions" tab of the GitHub repository.


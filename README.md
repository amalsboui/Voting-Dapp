# ![Voting DApp](https://raw.githubusercontent.com/amalsboui/voting-dapp/main/docs/logo.png) Voting DApp

[![Frontend CI](https://github.com/amalsboui/voting-dapp/actions/workflows/frontend.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/frontend.yml)  
[![Backend CI](https://github.com/amalsboui/voting-dapp/actions/workflows/backend.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/backend.yml)  
[![CD to AKS](https://github.com/amalsboui/voting-dapp/actions/workflows/cd-aks.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/cd-aks.yml)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## Project Overview

Voting DApp is a modern decentralized application built with a full-stack architecture and blockchain integration, enabling secure and transparent voting:

- **React frontend:** Dynamic UI built with React.js for seamless user interaction.
- **Flask backend:** Python-based REST API managing user authentication, business logic, and database interaction.
- **PostgreSQL database:** Stores user data securely, handles authentication details.
- **Smart contracts:** Developed in **Solidity** within the **Hardhat** environment, governing voting logic on blockchain.
- **Contract deployment:** Deployed to the **Sepolia testnet** using **Hardhat Ignition** for seamless blockchain deployment automation.
- **Wallet integration:** MetaMask browser extension enables users to interact with blockchain.
- **Blockchain interaction:** Uses **Ethers.js** to bridge React frontend and Ethereum blockchain.
- **Decentralized storage:** Candidate images are stored on **IPFS** via **Pinata**, eliminating the need to manage image storage infrastructure.

---

## Development & Testing

Our development process is robust and tested across all layers to ensure quality and reliability:

### Frontend

- Unit testing focuses on critical components such as the Candidates page.
- Tests simulate different candidate data scenarios, verifying correct rendering and behavior.
- Uses Jest and React Testing Library for component-level testing.

### Backend

- Backend unit tests verify API endpoints, authentication, and core business logic.
- Tests use pytest for Python, including setting up temporary in-memory databases to isolate test runs.
- Validates integration with PostgreSQL and JWT-based auth.

### Smart Contracts

- Written in Solidity, tested using Hardhat framework.
- Includes unit and integration tests to verify correct voting behaviors, edge cases, and security.
- Automated deployment scripts facilitate contract deployment to Sepolia.

---

## DevOps & Deployment

The project follows modern DevOps best practices to automate building, testing, and deployment:

- **Containerization:** Each service (frontend, backend, database) has dedicated Dockerfiles, allowing isolated, reproducible environments.
- **Continuous Integration (CI):**  
  - Backend CI installs dependencies, builds the Flask app, runs unit tests with temporary test DB.  
  - Frontend CI installs npm dependencies, builds React app, and runs unit tests on UI components.
- **Continuous Deployment (CD):**  
  - Builds Docker images from the Dockerfiles.  
  - Pushes images to **Azure Container Registry (ACR)**.  
  - Deploys the application to **Azure Kubernetes Service (AKS)** using Kubernetes manifests.
- **GitHub Actions:** Pipelines automate the entire process, triggered on pushes and pull requests, ensuring only validated code gets deployed.
- **Secrets Management:** Securely manages Azure credentials and environment variables using GitHub Secrets.
- **Infrastructure as Code:**  
  - Utilizes **Terraform Cloud** to define and manage Azure infrastructure, including AKS cluster, ACR, virtual network, and role assignments.  
  - Ensures repeatable, auditable infrastructure provisioning and management.

---

## Infrastructure & Cloud Stack

- **Terraform Cloud:** Our source of truth for infrastructure state, enabling collaboration and remote state management.
- **Azure Kubernetes Service (AKS):** Managed Kubernetes cluster hosting all app services, providing scaling and orchestration.
- **Azure Container Registry (ACR):** Private Docker image repository tightly integrated with AKS for secure image pulls.
- **Azure Virtual Network (VNet):** Segments cloud network into subnets for security and resource isolation.
- **Role Assignments:** AKS cluster identity granted **AcrPull** role to access ACR securely without credentials.
- **Kubernetes manifests:** Declarative YAML files managing deployments, services, and StatefulSets for the PostgreSQL database.

## Project Structure

```plaintext
/backend           # Flask API and business logic
/frontend          # React app source code
/k8s               # Kubernetes manifests (deployments, services, statefulsets)
/terraform         # Terraform infrastructure as code files
/.github/workflows # GitHub Actions CI/CD pipelines

Thanks for checking out the Voting DApp! 🚀

---




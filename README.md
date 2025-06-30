# ![Voting DApp](https://raw.githubusercontent.com/yourusername/voting-dapp/main/docs/logo.png) Voting DApp

[![Frontend CI](https://github.com/amalsboui/voting-dapp/actions/workflows/frontend.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/frontend.yml)  
[![Backend CI](https://github.com/amalsboui/voting-dapp/actions/workflows/backend.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/backend.yml)  
[![CD to AKS](https://github.com/amalsboui/voting-dapp/actions/workflows/cd-aks.yml/badge.svg)](https://github.com/amalsboui/voting-dapp/actions/workflows/cd-aks.yml)  
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A decentralized voting application built with modern blockchain technologies, featuring a React frontend, Flask backend, and PostgreSQL database, all containerized and deployed with DevOps best practices on Azure Kubernetes Service (AKS).

---

## Project Overview

This project implements a secure and scalable voting system using blockchain technology and cloud-native infrastructure.

### Technologies Used

- **Frontend:** React.js  
- **Backend:** Flask (Python)  
- **Database:** PostgreSQL (for user authentication)  
- **Smart Contract:** Solidity, developed and tested with [Hardhat](https://hardhat.org/) environment  
- **Blockchain Network:** Ethereum Sepolia testnet  
- **Blockchain Deployment:** Hardhat Ignition  
- **Wallet Integration:** MetaMask browser extension  
- **Blockchain Interaction:** [ethers.js](https://docs.ethers.io/v5/) connecting frontend to smart contract  
- **Decentralized Storage:** IPFS for storing candidate images (via [Pinata](https://pinata.cloud/))  
- **Blockchain Node Provider:** [Alchemy](https://www.alchemy.com/)  

---

## Features

- **User Authentication:** Secure login using PostgreSQL database  
- **Voting:** Blockchain-based voting with smart contracts on Ethereum testnet  
- **Wallet Support:** Users connect their MetaMask wallet for identity and signing  
- **IPFS Storage:** Candidate images are stored off-chain on IPFS using Pinata for reliable pinning and infrastructure-free hosting  
- **Unit Testing:**  
  - Frontend: Component tests for candidates page using mocked data  
  - Backend: API and business logic tests to ensure correctness  

---

## DevOps and Deployment

This project leverages modern DevOps practices to enable scalable, reliable, and maintainable deployment.

### Containerization

- Each application component (React frontend, Flask backend, PostgreSQL DB) is containerized using **Docker**.
- Separate Dockerfiles are maintained for each component ensuring clean builds and environment consistency.

### Continuous Integration (CI)

- Implemented using **GitHub Actions** workflows:
  - **Backend CI**:  
    - Sets up Python environment  
    - Installs dependencies  
    - Runs the Flask app with a temporary test database  
    - Executes backend unit tests  
  - **Frontend CI**:  
    - Sets up Node.js environment  
    - Installs dependencies  
    - Builds the React app  
    - Runs unit tests focused on the candidates page component  
- Each CI pipeline runs automatically on pushes and pull requests, ensuring code quality and functionality before merging.

### Continuous Deployment (CD)

- CD pipeline triggers after both frontend and backend CI pipelines complete successfully.
- Steps include:  
  - Docker image builds for frontend, backend, and PostgreSQL (if applicable).  
  - Docker images are pushed to **Azure Container Registry (ACR)**, a private Docker registry in Azure.  
  - Kubernetes manifests (deployments, services, statefulsets) are applied to the **Azure Kubernetes Service (AKS)** cluster, updating the running app.
- This automated pipeline allows zero-touch deployments, reducing manual errors and speeding up releases.

### Infrastructure Provisioning

- The entire cloud infrastructure is provisioned and managed with **Terraform**, enabling Infrastructure as Code (IaC).
- Terraform uses a **remote backend** hosted in Terraform Cloud (`ppp_cc/voting-dapp`) to securely store state and collaborate.
- Resources provisioned include:
  - Azure Resource Group  
  - Virtual Network and Subnet  
  - AKS cluster (2 nodes, system-assigned managed identity)  
  - Azure Container Registry (ACR)  
  - Role Assignments to allow AKS to pull images from ACR  

### Azure Role Assignments and Security

- AKS nodes run with a **managed identity**, which is assigned the **AcrPull** role on ACR.
- This ensures secure, least-privilege access for Kubernetes pods to fetch container images.
- Role assignments are automated but sometimes require manual intervention via the Azure Portal to grant necessary permissions.

### Benefits of this DevOps Setup

- **Scalability:** AKS allows easy scaling of pods and nodes for load handling.  
- **Reliability:** Kubernetes self-healing ensures minimal downtime.  
- **Repeatability:** Terraform automates and version-controls infrastructure provisioning.  
- **Speed:** CI/CD pipelines enable fast feedback and rapid deployments.  
- **Security:** Managed identities and least-privilege role assignments limit attack surface.  

---

## Project Structure

```plaintext
/backend           # Flask API and business logic
/frontend          # React app source code
/kubernetes             # Kubernetes manifests (deployments, services, statefulsets)
/Terraform         # Terraform infrastructure as code files
/.github/workflows # GitHub Actions CI/CD pipelines



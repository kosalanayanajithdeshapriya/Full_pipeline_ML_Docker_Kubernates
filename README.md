# Crop Recommender Platform 🌾🤖

An end-to-end, production-ready Machine Learning application featuring an intelligent FastAPI prediction engine, a modern React dashboard UI, Nginx reverse proxy, and a fully automated CI/CD pipeline deploying to AWS EC2 with Docker.

---

## 🚀 Features

- **Machine Learning API Engine:** High-performance FastAPI backend serving crop recommendation predictions via a `/predict` endpoint.
- **Modern UI Dashboard:** Responsive React single-page application for user-friendly data input and results visualization.
- **Containerized Microservices:** Backend and frontend each run in their own Docker containers for clean separation of concerns and portability.
- **Reverse Proxy & Static Serving:** Nginx serves the React build and proxies API traffic to the FastAPI backend.
- **Automated CI/CD:** GitHub Actions pipeline builds images, pushes to Docker Hub, and deploys updates to an AWS EC2 instance via Docker Compose and SSH.
- **Production-Oriented Setup:** Configured for reproducible builds, safe zero-downtime restarts, and disk-space-aware housekeeping on the EC2 host.

---

## 🛠️ System Architecture

The high-level architecture of the crop recommendation platform:

- **Development & ML:** Python, Pandas, and Scikit-learn are used to process CSV crop data, engineer features, and train a RandomForest model, which is serialized using `joblib`.
- **Source Control & CI/CD:** Code and model artifacts are tracked in a GitHub repository. GitHub Actions runs tests, builds Docker images, and deploys to AWS EC2 on each push to `main`.
- **Cloud Runtime (AWS EC2):** An EC2 instance runs Docker and Docker Compose to orchestrate two core containers:
  - **Frontend Container:** React SPA served by Nginx.
  - **Backend API Container:** FastAPI + Uvicorn exposing the crop recommendation API.
- **Networking:** Nginx serves the UI on port 80 and the API on port 8000 (or proxied path), with internal container networking handled by Docker.

### ASCII Architecture Sketch

```text
[ Client Browser ]
        │
        ▼
  HTTP (port 80)
        │
        ▼
[ Nginx + React Frontend Container ]
        │
  Internal Docker Network
        │
        ▼
[ FastAPI + Uvicorn Backend Container ]
        │
        ▼
   ML Model (joblib-serialized RandomForest)
```

---

## 📦 Container Images

Pre-built production images are published to Docker Hub:

- **Backend Engine:** `kosala2002/crop-backend:latest`
- **Frontend UI:** `kosala2002/crop-frontend:latest`

These images are built and updated automatically by the GitHub Actions workflow.

---

## 🧱 Repository Structure (Core Files)

At the root of this repo you will find (names may vary slightly):

- `app.py` – FastAPI application exposing the crop recommendation API.
- `model.pkl` – Serialized machine learning model (RandomForest) saved via `joblib`.
- `requirements.txt` – Python dependencies for the backend.
- `frontend/` – React application source, Dockerfile, and Nginx config.
- `docker-compose.yml` – Orchestration of the frontend and backend containers on EC2.
- `.github/workflows/deploy.yml` – GitHub Actions workflow for CI/CD to AWS EC2.

---

## 🛠️ Getting Started (Local / EC2 via Docker Compose)

You can bring up the full stack using Docker and Docker Compose, either on your local machine (for a production-like test) or on your EC2 instance.

### 1. Prerequisites

Make sure you have:

- **Docker** v20.10+  
- **Docker Compose** v2.0+  
- Optional for local testing: **Python 3.11+** (if you want to run backend code outside of Docker)

### 2. Clone the Repository

```bash
git clone https://github.com/kosalanayanajithdeshapriya/Full_pipeline_ML_Docker_Kubernates.git
cd Full_pipeline_ML_Docker_Kubernates
```

(If your repo name is `crop-platform`, adjust the URL and folder name accordingly.)

### 3. Configure Docker Compose (if needed)

Open `docker-compose.yml` and verify:

- The **frontend** service builds from `./frontend` and exposes port `80:80`.
- The **api** service exposes port `8000:8000`.
- Both services are on the same Docker network.

If you later integrate HTTPS/SSL and a domain, you can extend the Nginx configuration and add environment variables for your domain.

### 4. Run with Docker Compose

From the project root:

```bash
docker-compose up -d --build
```

This will:

- Build the backend (FastAPI) image.
- Build the frontend (React + Nginx) image.
- Create a Docker network and start both containers in detached mode.

### 5. Access the Application

Once containers are running:

- Frontend UI:  
  `http://<HOST-IP>/`  
  - On EC2: use the public IPv4 address of the instance.
  - Locally: `http://localhost/`

- Backend API docs (Swagger UI):  
  `http://<HOST-IP>:8000/docs`

---

## ☁️ AWS EC2 Deployment (Production)

In production, an Ubuntu-based EC2 instance runs this stack using Docker and Docker Compose. The GitHub Actions workflow connects to this EC2 host via SSH and performs zero-touch deployments.

### EC2 Requirements

On the EC2 instance you should have:

- Ubuntu 22.04 (or similar).
- Docker and Docker Compose installed.
- The repository cloned to a directory such as `/home/ubuntu/crop-platform`.
- Security Group rules allowing inbound:
  - **HTTP** (port 80) from the internet (0.0.0.0/0, ::/0).
  - Optional: **port 8000** if you want direct access to FastAPI docs.

### Manual Restart (if needed)

If you ever want to restart containers manually on EC2:

```bash
ssh -i <your-key.pem> ubuntu@<EC2-IP>

cd ~/crop-platform
docker-compose down || true
docker-compose up -d --build
```

---

## 🔄 Automated CI/CD with GitHub Actions

This repository uses GitHub Actions to perform continuous integration and delivery whenever you push to the `main` branch.

### Secrets Required

In your GitHub repo settings under **Settings → Secrets and variables → Actions**, define:

- `DOCKERHUB_USERNAME` – Your Docker Hub username.
- `DOCKERHUB_TOKEN` – A Docker Hub access token or password.
- `EC2_HOST` – Public IP or DNS of your EC2 instance.
- `EC2_USER` – Typically `ubuntu`.
- `EC2_SSH_KEY` – Contents of your EC2 `.pem` key (as a single secret string).

### CI/CD Workflow Overview

The GitHub Actions workflow (e.g., `.github/workflows/deploy.yml`) performs:

1. **Checkout & Smoke Tests**
   - Checks out the repository.
   - Sets up Python.
   - Installs backend dependencies from `requirements.txt`.
   - Performs a basic import/health check on the FastAPI app.

2. **Build & Push Docker Images**
   - Logs into Docker Hub using `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
   - Builds the backend and frontend Docker images (using memory-bounded Node options for the frontend where needed).
   - Tags and pushes the images to Docker Hub (e.g., `kosala2002/crop-backend:latest` and `kosala2002/crop-frontend:latest`).

3. **Remote Deployment on EC2**
   - Uses `appleboy/ssh-action` to SSH into the EC2 host using `EC2_HOST`, `EC2_USER`, and `EC2_SSH_KEY`.
   - Runs commands on EC2:
     - `cd /home/ubuntu/crop-platform`
     - `git pull origin main`
     - `docker-compose down || true`
     - `docker-compose up -d --build`
   - Optionally prunes dangling Docker images via `docker image prune -f` to manage disk space.

Each successful push to `main` results in a fresh build and rollout of the updated backend and frontend containers.

---

## 🧪 Model & ML Details (High Level)

- **Data Source:** Crop recommendation CSV dataset containing soil and environmental features (e.g., N, P, K, temperature, humidity, pH, rainfall).
- **Preprocessing:** Handled in Python using Pandas (cleaning, feature selection, basic transformations).
- **Model:** Scikit-learn `RandomForestClassifier` (or similar) trained to predict optimal crops given feature vectors.
- **Serialization:** Trained model saved as `model.pkl` using `joblib.dump`, loaded at API startup for predictions.

---

## 🌐 Future Enhancements

Some potential future improvements aligned with your current architecture:

- **Kubernetes / Minikube:**  
  Migrate from single EC2 + Docker Compose to a Minikube or full Kubernetes cluster using `deployment.yaml` and `service.yaml` manifests for scaling and resilience.
- **Monitoring & Logging:**  
  Integrate with AWS CloudWatch or Prometheus + Grafana for metrics, logs, and alerting.
- **Model Versioning:**  
  Use a dedicated model registry (e.g., MLflow) and CI/CD steps for automated retraining and promotion of new models.

---

## 📝 License

This project is open-source software licensed under the **MIT License**.  
See the `LICENSE` file for full details.

---

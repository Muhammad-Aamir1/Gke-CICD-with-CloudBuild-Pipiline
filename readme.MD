GKE Autopilot CI/CD with Google Cloud Build and GitHub
This repository contains all the necessary files to create a complete, automated CI/CD pipeline. The pipeline automatically builds a container image for a Node.js application, pushes it to Google Artifact Registry, and deploys it to a Google Kubernetes Engine (GKE) Autopilot cluster.

The entire process is managed by Google Cloud Build and is triggered by a simple git push to the main branch of this GitHub repository.

🚀 Features
Application: A simple "Hello, GKE Autopilot!" web server using Node.js and Express (index.js).

Containerization: A Dockerfile to package the app for production.

CI/CD Pipeline: A cloudbuild.yaml file that defines the entire build-and-deploy process.

Registry: Pushes the container image to Google Artifact Registry.

Deployment: Deploys to GKE Autopilot using Kubernetes manifests (deployment.yaml, service.yaml).

Zero-Downtime Deploys: Uses kubectl set image to trigger a rolling update on the GKE deployment with the new container image.

CI/CD Pipeline Flow
A developer pushes a commit to the main branch of this GitHub repository.

A Cloud Build Trigger (which you will set up) detects the push.

The Cloud Build Pipeline (defined in cloudbuild.yaml) starts:

Build: Builds the Docker image from the Dockerfile, tagging it with the short commit SHA.

Push: Pushes the newly built image to Google Artifact Registry.

Deploy: Authenticates to the GKE cluster and runs a kubectl set image command. This tells the existing Kubernetes Deployment to use the new image, triggering a secure, zero-downtime rolling update.

(Note: This flow is more robust than editing the YAML file, as it uses Kubernetes' native update mechanism.)

🛠️ Prerequisites
Before you can run this pipeline, you must set up the following resources in your Google Cloud project.

Google Cloud Project: A GCP project with billing enabled.

Enabled APIs:

Cloud Build API

Artifact Registry API

Kubernetes Engine API

GKE Autopilot Cluster:

You need a running GKE Autopilot cluster. If you don't have one, create it:

gcloud container clusters create-auto <YOUR_CLUSTER_NAME> \
  --region <YOUR_REGION>

(Example: gcloud container clusters create-auto my-autopilot-cluster --region us-central1)

Artifact Registry Repository:

You need a Docker repository to store your images.

gcloud artifacts repositories create <YOUR_REPO_NAME> \
  --repository-format=docker \
  --location=<YOUR_REGION>

(Example: gcloud artifacts repositories create my-app-repo --repository-format=docker --location=us-central1)

IAM Permissions for Cloud Build:

The Cloud Build service account needs permission to deploy to GKE and push to Artifact Registry.

Go to IAM & Admin > IAM in your GCP console.

Find the service account ending in @cloudbuild.gserviceaccount.com.

Grant it the following two roles:

Kubernetes Engine Developer (roles/container.developer)

Artifact Registry Writer (roles/artifactregistry.writer)

🚀 How to Use This Project
1. (One-Time) Initial Deployment
The CI/CD pipeline updates an existing deployment. You must first deploy the application one time manually so the pipeline has something to update.

Clone This Repository:

git clone [https://github.com/Muhammad-Aamir1/Gke-CICD-with-CloudBuild-Pipiline.git](https://github.com/Muhammad-Aamir1/Gke-CICD-with-CloudBuild-Pipiline.git)
cd Gke-CICD-with-CloudBuild-Pipiline

Connect to your GKE Cluster:

gcloud container clusters get-credentials <YOUR_CLUSTER_NAME> --region <YOUR_REGION>

Apply the Kubernetes Manifests:

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

This will create the hello-gke-deployment and hello-gke-service in your cluster. It will use a placeholder image for now, which is fine.

2. Configure Your Cloud Build Trigger
Go to the Cloud Build service in your GCP console.

Navigate to the Triggers tab and click Create trigger.

Name: deploy-to-gke-autopilot

Region: global (or your preferred region)

Event: Push to a branch

Source:

Click Connect repository.

Select GitHub (Cloud Build GitHub App) as the source.

Follow the authentication prompts to connect your GitHub account and select the Gke-CICD-with-CloudBuild-Pipiline repository.

Click Connect.

Repository event configuration:

Branch: ^main$ (This triggers the build only for pushes to the main branch).

Configuration:

Type: Cloud Build configuration file (yaml or json)

Location: /cloudbuild.yaml (This points to the file in your repo).

Advanced: Substitution variables:

Click Add variable. You must add variables here to match the resources you created in the "Prerequisites" step.

_AR_HOST: The host for your Artifact Registry (e.g., us-central1-docker.pkg.dev).

_AR_REPO: The name of your Artifact Registry repository (e.g., my-app-repo).

_GKE_CLUSTER_NAME: The name of your GKE Autopilot cluster (e.g., my-autopilot-cluster).

_GKE_REGION: The region where your cluster is located (e.g., us-central1).

Click Create.

3. Push to Deploy!
You're all set! To trigger your first automated deployment, make a small change to any file (like adding a comment to your Node.js app file), then commit and push it to the main branch.

# Make a small change, e.g., edit index.js
git add .
git commit -m "Test deploy trigger"
git push origin main

Go to the Cloud Build History tab in the GCP console. You should see your new build running. It will build, push, and then run kubectl set image to update your live deployment.

4. Verify the Deployment
Wait for the pipeline to finish.

In your terminal, get the external IP address of your service.

kubectl get service hello-gke-service

Once the EXTERNAL-IP is assigned, open that IP address in your browser:
http://<YOUR_EXTERNAL_IP>

You should see your Node.js application's response.

🧹 Cleanup
To avoid incurring charges, delete the resources you created:

Delete the Kubernetes Resources:

kubectl delete service hello-gke-service
kubectl delete deployment hello-gke-deployment

Delete the GKE Cluster:

gcloud container clusters delete <YOUR_CLUSTER_NAME> --region <YOUR_REGION>

Delete the Artifact Registry Repository:

gcloud artifacts repositories delete <YOUR_REPO_NAME> --location <YOUR_REGION>

Delete the Cloud Build Trigger.

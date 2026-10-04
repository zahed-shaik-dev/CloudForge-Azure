# ☁️ CloudForge

**CloudForge** is a Node.js cloud engineering application deployed on **Microsoft Azure** using a secure automated **GitHub Actions CI/CD pipeline**.

The project demonstrates practical DevOps workflows including application validation, Azure deployment, OIDC authentication, and Azure App Service hosting.

## 🚀 Tech Stack

* Node.js 22
* Express.js
* Azure App Service
* GitHub Actions
* Microsoft Entra ID
* GitHub OIDC
* Azure RBAC
* Docker

## 🔄 CI/CD Pipeline

```text
GitHub
   ↓
GitHub Actions
   ↓
npm install → Lint → Test
   ↓
OIDC Authentication
   ↓
Azure App Service
   ↓
CloudForge
```

Every push to the `master` branch automatically validates and deploys the application to Azure.

## 🔐 Security

CloudForge uses **GitHub OIDC + Microsoft Entra ID** instead of storing Azure passwords or publish profiles in GitHub.

Deployment access is controlled using **Azure RBAC** and scoped to the CloudForge App Service.

## ☁️ Azure

* Azure App Service for application hosting
* Microsoft Entra ID for workload identity
* Federated credentials for GitHub Actions
* Azure RBAC for deployment permissions

## 📡 API

Health endpoint:

```text
GET /api/health
```

Task API:

```text
GET    /api/tasks
POST   /api/tasks
PATCH  /api/tasks/:id
DELETE /api/tasks/:id
```

## 🐳 Docker

CloudForge includes a production-oriented Dockerfile using **Node.js Alpine** and a non-root container user.

## 🎯 Project Goal

The project is being developed as a practical **Azure DevOps learning and portfolio project**, with future expansion into:

* Application Insights
* Azure Monitor
* Terraform / Bicep
* Azure Container Registry
* Managed Identity
* Monitoring and alerts

---

**Built by Zahed Hussain Shaik — Aspiring DevOps / Cloud Engineer**

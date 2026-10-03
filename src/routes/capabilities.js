const express = require("express");

const router = express.Router();

const capabilities = [
  {
    id: "deployments",
    title: "Azure Deployments",
    icon: "🚀",
    summary:
      "Cloud deployment workflows using Azure App Service, containers, AKS and CI/CD automation.",

    technologies: [
      "Azure App Service",
      "Azure Kubernetes Service",
      "Docker",
      "Azure Container Registry",
      "GitHub Actions"
    ],

    sections: [
      {
        title: "Azure App Service",
        description:
          "Host and run the Node.js application using Azure App Service.",
        items: [
          "Node.js application hosting",
          "Production environment configuration",
          "Application health endpoint",
          "Environment variables",
          "Application logs"
        ]
      },

      {
        title: "Azure Kubernetes Service",
        description:
          "Containerized application deployment using managed Kubernetes on Azure.",
        items: [
          "Docker container deployment",
          "Kubernetes Deployment",
          "Kubernetes Service",
          "Rolling updates",
          "Liveness probes",
          "Readiness probes",
          "Horizontal scaling"
        ]
      },

      {
        title: "CI/CD Pipeline",
        description:
          "Automated application delivery from source control to Azure.",
        items: [
          "GitHub source control",
          "Automated testing",
          "Docker image build",
          "Azure Container Registry",
          "Deployment automation",
          "Post-deployment health verification"
        ]
      }
    ]
  },

  {
    id: "health",
    title: "Health Checks",
    icon: "❤️",
    summary:
      "Application health monitoring and service availability checks.",

    technologies: [
      "Node.js",
      "Express.js",
      "Azure Monitor",
      "Application Insights",
      "Kubernetes Probes"
    ],

    sections: [
      {
        title: "API Health Endpoint",
        description:
          "The application exposes a health endpoint for service verification.",
        items: [
          "GET /api/health",
          "HTTP status verification",
          "Application status",
          "Environment information",
          "Timestamp reporting"
        ]
      },

      {
        title: "Kubernetes Health",
        description:
          "Kubernetes probes can determine whether containers are ready and healthy.",
        items: [
          "Liveness probes",
          "Readiness probes",
          "Container restart detection",
          "Service availability"
        ]
      },

      {
        title: "Azure Monitoring",
        description:
          "Cloud monitoring can track application availability and operational health.",
        items: [
          "Application availability",
          "Response time",
          "Failed requests",
          "Application logs",
          "Monitoring alerts"
        ]
      }
    ]
  },

  {
    id: "api",
    title: "API Layer",
    icon: "🔐",
    summary:
      "REST API architecture connecting the frontend with the Node.js backend.",

    technologies: [
      "Node.js",
      "Express.js",
      "REST API",
      "JSON",
      "HTTP"
    ],

    sections: [
      {
        title: "Task API",
        description:
          "REST endpoints provide the application's task management functionality.",
        items: [
          "GET /api/tasks",
          "POST /api/tasks",
          "PATCH /api/tasks/:id",
          "DELETE /api/tasks/:id"
        ]
      },

      {
        title: "Request Processing",
        description:
          "The Express backend processes frontend requests and returns JSON responses.",
        items: [
          "HTTP request handling",
          "JSON request bodies",
          "Input validation",
          "HTTP status codes",
          "JSON responses"
        ]
      },

      {
        title: "Backend Architecture",
        description:
          "The API layer separates application functionality into maintainable routes.",
        items: [
          "Express routing",
          "Route separation",
          "API error handling",
          "Frontend/backend communication"
        ]
      }
    ]
  },

  {
    id: "ui",
    title: "Fast UI",
    icon: "⚡",
    summary:
      "Lightweight responsive frontend built for fast interaction across devices.",

    technologies: [
      "HTML5",
      "CSS3",
      "Vanilla JavaScript",
      "Responsive Design",
      "REST APIs"
    ],

    sections: [
      {
        title: "Interactive Frontend",
        description:
          "The interface communicates directly with the backend API using asynchronous requests.",
        items: [
          "Dynamic task rendering",
          "Task filtering",
          "Create task interaction",
          "Complete task interaction",
          "Delete task interaction"
        ]
      },

      {
        title: "Responsive Design",
        description:
          "The interface adapts to desktop, tablet and mobile screen sizes.",
        items: [
          "Responsive navigation",
          "Flexible layouts",
          "Mobile task controls",
          "Responsive cards",
          "Adaptive pipeline layout"
        ]
      },

      {
        title: "User Experience",
        description:
          "Frontend interactions provide immediate visual feedback.",
        items: [
          "Dark/light mode",
          "Hover interactions",
          "Animated components",
          "API status feedback",
          "Smooth navigation"
        ]
      }
    ]
  },

  {
    id: "observability",
    title: "Observability",
    icon: "📊",
    summary:
      "Application monitoring and operational visibility for cloud environments.",

    technologies: [
      "Azure Monitor",
      "Application Insights",
      "Application Logs",
      "Prometheus",
      "Grafana"
    ],

    sections: [
      {
        title: "Application Monitoring",
        description:
          "Monitor application behavior and operational performance.",
        items: [
          "Request monitoring",
          "Response times",
          "Error tracking",
          "Availability monitoring"
        ]
      },

      {
        title: "Infrastructure Monitoring",
        description:
          "Monitor cloud infrastructure and containerized workloads.",
        items: [
          "CPU utilization",
          "Memory utilization",
          "Container health",
          "Pod status",
          "Service availability"
        ]
      },

      {
        title: "Alerts",
        description:
          "Operational alerts can notify engineers when defined thresholds are exceeded.",
        items: [
          "Application failures",
          "High resource utilization",
          "Availability issues",
          "Health check failures"
        ]
      }
    ]
  }
];

router.get("/", (_req, res) => {
  res.json(capabilities);
});

router.get("/:id", (req, res) => {
  const capability = capabilities.find(
    item => item.id === req.params.id
  );

  if (!capability) {
    return res.status(404).json({
      error: "Capability not found"
    });
  }

  res.json(capability);
});

module.exports = router;
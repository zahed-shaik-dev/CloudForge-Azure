

/* ============================================================
   CLOUDFORGE APPLICATION
   ============================================================ */

const $ = selector =>
  document.querySelector(selector);

const $$ = selector =>
  Array.from(document.querySelectorAll(selector));

/* ============================================================
   HELPERS
   ============================================================ */

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function apiRequest(
  url,
  options = {}
) {
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message =
      `Request failed with status ${response.status}`;

    try {
      const data = await response.json();

      if (data?.error) {
        message = data.error;
      }
    } catch {
      // Ignore invalid JSON error response.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

/* ============================================================
   THEME SYSTEM
   ============================================================ */

const themeToggle =
  $("#themeToggle");

const themeIcon =
  themeToggle?.querySelector(
    ".cf-theme-icon"
  );

function applyTheme(theme) {
  const selectedTheme =
    theme === "light"
      ? "light"
      : "dark";

  document.documentElement.setAttribute(
    "data-theme",
    selectedTheme
  );

  localStorage.setItem(
    "cloudforge-theme",
    selectedTheme
  );

  if (themeIcon) {
    themeIcon.textContent =
      selectedTheme === "light"
        ? "☀"
        : "☾";
  }

  if (themeToggle) {
    const nextTheme =
      selectedTheme === "light"
        ? "dark"
        : "light";

    themeToggle.setAttribute(
      "aria-label",
      `Switch to ${nextTheme} mode`
    );

    themeToggle.setAttribute(
      "title",
      `Switch to ${nextTheme} mode`
    );
  }
}

function initializeTheme() {
  const savedTheme =
    localStorage.getItem(
      "cloudforge-theme"
    );

  if (
    savedTheme === "light" ||
    savedTheme === "dark"
  ) {
    applyTheme(savedTheme);
    return;
  }

  const prefersLight =
    window.matchMedia &&
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;

  applyTheme(
    prefersLight
      ? "light"
      : "dark"
  );
}

themeToggle?.addEventListener(
  "click",
  () => {
    const currentTheme =
      document.documentElement.getAttribute(
        "data-theme"
      ) || "dark";

    applyTheme(
      currentTheme === "dark"
        ? "light"
        : "dark"
    );
  }
);

/* ============================================================
   MOBILE NAVIGATION
   ============================================================ */

const mobileNavToggle =
  $("#mobileNavToggle");

const mobileNavMenu =
  $("#mobileNavMenu");

function closeMobileNavigation() {
  if (!mobileNavMenu) {
    return;
  }

  mobileNavMenu.hidden = true;

  mobileNavToggle?.classList.remove(
    "open"
  );

  mobileNavToggle?.setAttribute(
    "aria-expanded",
    "false"
  );

  mobileNavToggle?.setAttribute(
    "aria-label",
    "Open navigation"
  );
}

function toggleMobileNavigation() {
  if (!mobileNavMenu) {
    return;
  }

  const willOpen =
    mobileNavMenu.hidden;

  mobileNavMenu.hidden =
    !willOpen;

  mobileNavToggle?.classList.toggle(
    "open",
    willOpen
  );

  mobileNavToggle?.setAttribute(
    "aria-expanded",
    String(willOpen)
  );

  mobileNavToggle?.setAttribute(
    "aria-label",
    willOpen
      ? "Close navigation"
      : "Open navigation"
  );
}

mobileNavToggle?.addEventListener(
  "click",
  toggleMobileNavigation
);

$$(".cf-mobile-link")
  .forEach(link => {
    link.addEventListener(
      "click",
      closeMobileNavigation
    );
  });

window.addEventListener(
  "resize",
  () => {
    if (window.innerWidth > 1100) {
      closeMobileNavigation();
    }
  }
);

/* ============================================================
   NAVIGATION ACTIVE SECTION
   ============================================================ */

const navigationLinks =
  $$(".cf-nav-link");

const mobileNavigationLinks =
  $$(".cf-mobile-link");

const sections =
  $$("#home, #services, #pipeline, #tasks, #contact");

function setActiveSection(sectionId) {
  navigationLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.section === sectionId
    );
  });

  mobileNavigationLinks.forEach(link => {
    link.classList.toggle(
      "active",
      link.dataset.section === sectionId
    );
  });
}

if (
  "IntersectionObserver" in window
) {
  const sectionObserver =
    new IntersectionObserver(
      entries => {
        const visibleSections =
          entries
            .filter(
              entry =>
                entry.isIntersecting
            )
            .sort(
              (a, b) =>
                b.intersectionRatio -
                a.intersectionRatio
            );

        if (
          visibleSections.length
        ) {
          setActiveSection(
            visibleSections[0]
              .target
              .id
          );
        }
      },
      {
        rootMargin:
          "-25% 0px -55% 0px",
        threshold: [
          0,
          0.15,
          0.35,
          0.6
        ]
      }
    );

  sections.forEach(section => {
    sectionObserver.observe(section);
  });
}

/* ============================================================
   CAPABILITIES
   ============================================================ */

const serviceItems =
  $$(".cf-service-item");

const capabilityDetail =
  $("#capabilityDetail");

const serviceDetailTitle =
  $("#serviceDetailTitle");

const serviceDetailSummary =
  $("#serviceDetailSummary");

const serviceTechnologies =
  $("#serviceTechnologies");

const serviceEngineering =
  $("#serviceEngineering");

const openCapabilityDetail =
  $("#openCapabilityDetail");

let activeCapability = null;

async function loadCapability(
  capabilityId
) {
  if (!capabilityDetail) {
    return;
  }

  try {
    capabilityDetail.classList.add(
      "is-loading"
    );

    const capability =
      await apiRequest(
        `/api/capabilities/${encodeURIComponent(
          capabilityId
        )}`
      );

    activeCapability =
      capability;

    renderCapability(
      capability
    );
  } catch (error) {
    console.error(
      "Capability loading failed:",
      error
    );

    showCapabilityError();
  } finally {
    capabilityDetail.classList.remove(
      "is-loading"
    );
  }
}

function renderCapability(
  capability
) {
  if (serviceDetailTitle) {
    serviceDetailTitle.textContent =
      capability.title ||
      "Capability";
  }

  if (serviceDetailSummary) {
    serviceDetailSummary.textContent =
      capability.summary ||
      "CloudForge capability.";
  }

  if (serviceTechnologies) {
    serviceTechnologies.innerHTML =
      (
        capability.technologies ||
        []
      )
        .map(
          technology =>
            `<span>${escapeHtml(
              technology
            )}</span>`
        )
        .join("");
  }

  if (serviceEngineering) {
    const sections =
      capability.sections ||
      [];

    const selectedSection =
      sections.find(
        section =>
          Array.isArray(
            section.items
          ) &&
          section.items.length
      );

    const items =
      selectedSection?.items ||
      [];

    serviceEngineering.innerHTML =
      items.length
        ? items
            .map(
              item =>
                `<li>${escapeHtml(
                  item
                )}</li>`
            )
            .join("")
        : `
          <li>
            Capability configured and ready for operation.
          </li>
        `;
  }

  if (openCapabilityDetail) {
    openCapabilityDetail.innerHTML = `
      Explore capability
      <span>↗</span>
    `;
  }

  const existingExpansion =
    capabilityDetail?.querySelector(
      ".cf-expanded-capabilities"
    );

  existingExpansion?.remove();
}

function showCapabilityError() {
  activeCapability = null;

  if (serviceDetailTitle) {
    serviceDetailTitle.textContent =
      "Unable to load capability";
  }

  if (serviceDetailSummary) {
    serviceDetailSummary.textContent =
      "The capability service could not be reached. Please try again.";
  }

  if (serviceTechnologies) {
    serviceTechnologies.innerHTML = `
      <span>API unavailable</span>
    `;
  }

  if (serviceEngineering) {
    serviceEngineering.innerHTML = `
      <li>Check the application API.</li>
      <li>Refresh the page and try again.</li>
    `;
  }
}

serviceItems.forEach(item => {
  item.addEventListener(
    "click",
    () => {
      const capabilityId =
        item.dataset.capability;

      if (!capabilityId) {
        return;
      }

      serviceItems.forEach(
        service =>
          service.classList.remove(
            "active"
          )
      );

      item.classList.add("active");

      loadCapability(
        capabilityId
      );
    }
  );
});

openCapabilityDetail?.addEventListener(
  "click",
  () => {
    if (!activeCapability) {
      return;
    }

    const sections =
      activeCapability.sections ||
      [];

    if (!sections.length) {
      return;
    }

    const existing =
      capabilityDetail?.querySelector(
        ".cf-expanded-capabilities"
      );

    if (existing) {
      existing.remove();

      openCapabilityDetail.innerHTML = `
        Explore capability
        <span>↗</span>
      `;

      return;
    }

    const wrapper =
      document.createElement(
        "div"
      );

    wrapper.className =
      "cf-expanded-capabilities";

    wrapper.innerHTML =
      sections
        .map(
          section => `
            <div class="cf-expanded-capability">
              <span class="cf-detail-block-label">
                ${escapeHtml(
                  section.title ||
                    ""
                ).toUpperCase()}
              </span>

              <p>
                ${escapeHtml(
                  section.description ||
                    ""
                )}
              </p>

              ${
                Array.isArray(
                  section.items
                ) &&
                section.items.length
                  ? `
                    <ul>
                      ${section.items
                        .map(
                          item =>
                            `<li>${escapeHtml(
                              item
                            )}</li>`
                        )
                        .join("")}
                    </ul>
                  `
                  : ""
              }
            </div>
          `
        )
        .join("");

    capabilityDetail.insertBefore(
      wrapper,
      openCapabilityDetail
    );

    openCapabilityDetail.innerHTML = `
      Collapse capability
      <span>↑</span>
    `;
  }
);

/* ============================================================
   PIPELINE
   ============================================================ */

const pipelineCards =
  $$(".cf-pipeline-interactive");

const pipelineInformation = {
  source: {
    title: "Code Commit",
    stage: "SOURCE",
    description:
      "Source code is committed to Git and pushed to GitHub, triggering the delivery workflow.",
    technologies: [
      "Git",
      "GitHub",
      "Git Push",
      "Version Control"
    ]
  },

  build: {
    title: "Application Build",
    stage: "BUILD",
    description:
      "The Node.js application dependencies are installed and the application is validated before deployment.",
    technologies: [
      "Node.js 22",
      "npm",
      "Dependencies",
      "Build Validation"
    ]
  },

  verify: {
    title: "Quality Checks",
    stage: "VERIFY",
    description:
      "Automated validation confirms that the application is healthy and ready for production delivery.",
    technologies: [
      "npm test",
      "Lint",
      "Health Check",
      "Validation"
    ]
  },

  deploy: {
    title: "Azure Production",
    stage: "DEPLOY",
    description:
      "The validated application is deployed to Azure App Service through an automated CI/CD workflow.",
    technologies: [
      "Azure",
      "App Service",
      "GitHub Actions",
      "Production"
    ]
  }
};

function showPipelineDetails(pipelineId) {
  const data = pipelineInformation[pipelineId];

  if (!data) return;

  pipelineCards.forEach(card => {
    card.classList.remove("pipeline-selected");
  });

  const selectedCard = document.querySelector(
    `.cf-pipeline-interactive[data-pipeline="${pipelineId}"]`
  );

  if (!selectedCard) return;

  const existingDetails =
    selectedCard.querySelector(".cf-pipeline-details");

     /* -----------------------------------------
     Clicking the active card closes it
     ----------------------------------------- */

  if (existingDetails) {
    existingDetails.style.opacity = "0";
    existingDetails.style.transform = "translateY(-8px)";

    setTimeout(() => {
      existingDetails.remove();
    }, 220);

    selectedCard.classList.remove("pipeline-selected");

    return;
  }

  selectedCard.classList.add("pipeline-selected");

  const details = document.createElement("div");
  
  details.className =
    "cf-pipeline-details";

  details.innerHTML = `
    <div class="cf-pipeline-details-inner">
      <span class="cf-pipeline-details-label">
        ${escapeHtml(
          data.stage
        )}
      </span>

      <strong>
        ${escapeHtml(
          data.title
        )}
      </strong>

      <p>
        ${escapeHtml(
          data.description
        )}
      </p>

      <div class="cf-pipeline-details-tech">
        ${data.technologies
          .map(
            technology =>
              `
                <span>
                  ${escapeHtml(
                    technology
                  )}
                </span>
              `
          )
          .join("")}
      </div>
    </div>
  `;

  selectedCard.appendChild(
    details
  );
}

pipelineCards.forEach(card => {
  card.setAttribute(
    "aria-pressed",
    "false"
  );

  card.addEventListener(
    "click",
    () => {
      const pipelineId =
        card.dataset.pipeline;

      if (!pipelineId) {
        return;
      }

      showPipelineDetails(
        pipelineId
      );

      card.setAttribute(
        "aria-pressed",
        String(
          card.classList.contains(
            "pipeline-selected"
          )
        )
      );
    }
  );

  card.addEventListener(
    "keydown",
    event => {
      if (
        event.key !== "Enter" &&
        event.key !== " "
      ) {
        return;
      }

      event.preventDefault();

      card.click();
    }
  );
});

/* ============================================================
   TASK MANAGEMENT
   ============================================================ */

const taskList =
  $("#taskList");

const taskForm =
  $("#taskForm");

const taskTitle =
  $("#taskTitle");

const taskPriority =
  $("#taskPriority");

const taskEmptyState =
  $("#taskEmptyState");

const taskRefresh =
  $("#taskRefresh");

const taskFilters =
  $$(".cf-task-filter");

const taskCountLabel =
  $("#taskCountLabel");

const taskSystemStatus =
  $("#taskSystemStatus");

const totalTaskCount =
  $("#totalTaskCount");

const activeTaskCount =
  $("#activeTaskCount");

const completedTaskCount =
  $("#completedTaskCount");

const taskCompletionRate =
  $("#taskCompletionRate");

let tasks = [];
let activeTaskFilter = "all";

function getFilteredTasks() {
  switch (
    activeTaskFilter
  ) {
    case "active":
      return tasks.filter(
        task =>
          !Boolean(task.completed)
      );

    case "completed":
      return tasks.filter(
        task =>
          Boolean(task.completed)
      );

    default:
      return tasks;
  }
}

function renderTask(task) {
  const completed =
    Boolean(task.completed);

  const priority =
    [
      "normal",
      "high",
      "critical"
    ].includes(task.priority)
      ? task.priority
      : "normal";

  return `
    <div
      class="cf-operation-task ${
        completed
          ? "completed"
          : ""
      }"
      data-task-id="${escapeHtml(
        task.id
      )}"
    >
      <input
        class="cf-task-check"
        type="checkbox"
        aria-label="Mark task as ${
          completed
            ? "active"
            : "completed"
        }"
        ${
          completed
            ? "checked"
            : ""
        }
      />

      <div class="cf-operation-task-content">
        <span class="cf-operation-task-title">
          ${escapeHtml(
            task.title
          )}
        </span>

        <div class="cf-operation-task-meta">
          <span class="cf-task-id">
            TASK-${escapeHtml(
              task.id
            )}
          </span>

          <span class="cf-task-state">
            <i></i>
            ${
              completed
                ? "COMPLETED"
                : "ACTIVE"
            }
          </span>
        </div>
      </div>

      <div class="cf-task-actions">
        <span class="cf-task-priority ${escapeHtml(
          priority
        )}">
          ${escapeHtml(
            priority.toUpperCase()
          )}
        </span>

        <button
          type="button"
          class="cf-task-delete"
          data-action="delete"
          aria-label="Delete task"
          title="Delete task"
        >
          ×
        </button>
      </div>
    </div>
  `;
}

function renderTasks() {
  if (!taskList) {
    return;
  }

  const filteredTasks =
    getFilteredTasks();

  taskList.innerHTML =
    filteredTasks
      .map(renderTask)
      .join("");

  if (taskEmptyState) {
    taskEmptyState.hidden =
      filteredTasks.length !== 0;
  }

  updateTaskMetrics();
}

function updateTaskMetrics() {
  const total =
    tasks.length;

  const completed =
    tasks.filter(
      task =>
        Boolean(task.completed)
    ).length;

  const active =
    total - completed;

  const completionRate =
    total > 0
      ? Math.round(
          (completed / total) *
            100
        )
      : 0;

  if (totalTaskCount) {
    totalTaskCount.textContent =
      total;
  }

  if (activeTaskCount) {
    activeTaskCount.textContent =
      active;
  }

  if (completedTaskCount) {
    completedTaskCount.textContent =
      completed;
  }

  if (taskCompletionRate) {
    taskCompletionRate.textContent =
      `${completionRate}%`;
  }

  if (taskCountLabel) {
    taskCountLabel.textContent =
      `${total} ${
        total === 1
          ? "TASK"
          : "TASKS"
      }`;
  }
}

async function loadTasks() {
  if (!taskList) {
    return;
  }

  try {
    if (taskSystemStatus) {
      taskSystemStatus.textContent =
        "LOADING API";
    }

    const response =
      await apiRequest(
        "/api/tasks"
      );

    tasks =
      Array.isArray(response)
        ? response
        : [];

    renderTasks();

    if (taskSystemStatus) {
      taskSystemStatus.textContent =
        "API CONNECTED";
    }
  } catch (error) {
    console.error(
      "Task loading failed:",
      error
    );

    tasks = [];

    renderTasks();

    if (taskSystemStatus) {
      taskSystemStatus.textContent =
        "API ERROR";
    }

    if (taskList) {
      taskList.innerHTML = `
        <div class="cf-task-empty">
          <div class="cf-empty-icon">
            !
          </div>

          <strong>
            Unable to load tasks
          </strong>

          <span>
            The CloudForge task API could not be reached.
          </span>
        </div>
      `;
    }
  }
}

async function createTask(
  event
) {
  event.preventDefault();

  if (
    !taskTitle ||
    !taskPriority
  ) {
    return;
  }

  const title =
    taskTitle.value.trim();

  const priority =
    taskPriority.value;

  if (!title) {
    taskTitle.focus();
    return;
  }

  const submitButton =
    taskForm.querySelector(
      'button[type="submit"]'
    );

  const originalText =
    submitButton?.innerHTML;

  if (submitButton) {
    submitButton.disabled = true;

    submitButton.innerHTML = `
      Creating...
    `;
  }

  try {
    const createdTask =
      await apiRequest(
        "/api/tasks",
        {
          method: "POST",
          body: JSON.stringify({
            title,
            priority
          })
        }
      );

    tasks.unshift(
      createdTask
    );

    taskForm.reset();

    activeTaskFilter =
      "all";

    taskFilters.forEach(
      filter => {
        filter.classList.toggle(
          "active",
          filter.dataset.filter ===
            "all"
        );
      }
    );

    renderTasks();

    taskTitle.focus();
  } catch (error) {
    console.error(
      "Task creation failed:",
      error
    );

    window.alert(
      error.message ||
        "Unable to create task."
    );
  } finally {
    if (submitButton) {
      submitButton.disabled =
        false;

      submitButton.innerHTML =
        originalText ||
        `
          Create task
          <span>→</span>
        `;
    }
  }
}

async function updateTask(
  taskId,
  changes
) {
  try {
    const updatedTask =
      await apiRequest(
        `/api/tasks/${encodeURIComponent(
          taskId
        )}`,
        {
          method: "PATCH",
          body: JSON.stringify(
            changes
          )
        }
      );

    const index =
      tasks.findIndex(
        task =>
          Number(task.id) ===
          Number(taskId)
      );

    if (index !== -1) {
      tasks[index] =
        updatedTask;
    }

    renderTasks();
  } catch (error) {
    console.error(
      "Task update failed:",
      error
    );

    window.alert(
      error.message ||
        "Unable to update task."
    );

    renderTasks();
  }
}

async function deleteTask(
  taskId
) {
  try {
    await apiRequest(
      `/api/tasks/${encodeURIComponent(
        taskId
      )}`,
      {
        method: "DELETE"
      }
    );

    tasks =
      tasks.filter(
        task =>
          Number(task.id) !==
          Number(taskId)
      );

    renderTasks();
  } catch (error) {
    console.error(
      "Task deletion failed:",
      error
    );

    window.alert(
      error.message ||
        "Unable to delete task."
    );
  }
}

taskForm?.addEventListener(
  "submit",
  createTask
);

taskFilters.forEach(filter => {
  filter.addEventListener(
    "click",
    () => {
      activeTaskFilter =
        filter.dataset.filter ||
        "all";

      taskFilters.forEach(
        item => {
          item.classList.toggle(
            "active",
            item === filter
          );
        }
      );

      renderTasks();
    }
  );
});

taskList?.addEventListener(
  "change",
  event => {
    const checkbox =
      event.target.closest(
        ".cf-task-check"
      );

    if (!checkbox) {
      return;
    }

    const taskElement =
      checkbox.closest(
        ".cf-operation-task"
      );

    const taskId =
      taskElement?.dataset.taskId;

    if (!taskId) {
      return;
    }

    updateTask(
      taskId,
      {
        completed:
          checkbox.checked
      }
    );
  }
);

taskList?.addEventListener(
  "click",
  event => {
    const deleteButton =
      event.target.closest(
        '[data-action="delete"]'
      );

    if (!deleteButton) {
      return;
    }

    const taskElement =
      deleteButton.closest(
        ".cf-operation-task"
      );

    const taskId =
      taskElement?.dataset.taskId;

    if (!taskId) {
      return;
    }

    deleteTask(taskId);
  }
);

taskRefresh?.addEventListener(
  "click",
  async () => {
    if (
      taskRefresh.classList.contains(
        "is-loading"
      )
    ) {
      return;
    }

    taskRefresh.classList.add(
      "is-loading"
    );

    try {
      await loadTasks();
    } finally {
      taskRefresh.classList.remove(
        "is-loading"
      );
    }
  }
);

/* ============================================================
   HEALTH CHECK
   ============================================================ */

async function checkApplicationHealth() {
  try {
    const health =
      await apiRequest(
        "/api/health"
      );

    if (
      health?.status ===
      "healthy"
    ) {
      document.body.dataset.apiHealth =
        "healthy";
    }
  } catch (error) {
    console.warn(
      "Application health check failed:",
      error
    );

    document.body.dataset.apiHealth =
      "unhealthy";
  }
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

$$(
  'a[href^="#"]'
).forEach(link => {
  link.addEventListener(
    "click",
    event => {
      const targetId =
        link.getAttribute("href");

      if (
        !targetId ||
        targetId === "#"
      ) {
        return;
      }

      const target =
        document.querySelector(
          targetId
        );

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior:
          window.matchMedia(
            "(prefers-reduced-motion: reduce)"
          ).matches
            ? "auto"
            : "smooth",
        block: "start"
      });

      history.replaceState(
        null,
        "",
        targetId
      );
    }
  );
});

/* ============================================================
   INITIALIZATION
   ============================================================ */

function initializeCloudForge() {
  initializeTheme();

  if (
    serviceItems.length &&
    capabilityDetail
  ) {
    loadCapability(
      "deployments"
    );
  }

  if (taskList) {
    loadTasks();
  }

  if (pipelineCards.length) {
    pipelineCards.forEach(
      card => {
        card.setAttribute(
          "aria-pressed",
          "false"
        );
      }
    );
  }

  checkApplicationHealth();
}

if (
  document.readyState ===
  "loading"
) {
  document.addEventListener(
    "DOMContentLoaded",
    initializeCloudForge,
    {
      once: true
    }
  );
} else {
  initializeCloudForge();
}

/* =========================================================
   PREMIUM SCROLL REVEALS
   ========================================================= */

const revealElements = [
  ".cf-section-header",
  ".cf-services-layout",
  ".cf-pipeline",
  ".cf-operations-layout",
  ".cf-contact-layout"
];

const revealTargets = document.querySelectorAll(
  revealElements.join(",")
);

revealTargets.forEach(element => {
  element.classList.add("cf-reveal");
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  },
  {
    threshold: 0.12,
    rootMargin: "0px 0px -60px 0px"
  }
);

revealTargets.forEach(element => {
  revealObserver.observe(element);
});
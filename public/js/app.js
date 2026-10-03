const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const healthBtn = document.getElementById("health-btn");
const healthStatus = document.getElementById("health-status");
const filters = document.querySelectorAll(".filter");

const themeToggle = document.getElementById("theme-toggle");

let tasks = [];
let currentFilter = "all";

/* =====================================================
   DARK / LIGHT MODE
===================================================== */

function setTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");

  if (themeToggle) {
    themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";

    themeToggle.setAttribute(
      "aria-label",
      theme === "dark"
        ? "Switch to light mode"
        : "Switch to dark mode"
    );
  }

  localStorage.setItem("cloudops-theme", theme);
}

function initializeTheme() {
  const savedTheme = localStorage.getItem("cloudops-theme");

  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  setTheme("light");
}

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const isDark = document.body.classList.contains("dark-mode");

    setTheme(isDark ? "light" : "dark");
  });
}

initializeTheme();


/* =====================================================
   LOAD TASKS
===================================================== */

async function loadTasks() {
  try {
    const response = await fetch("/api/tasks");

    tasks = await response.json();

    renderTasks();

  } catch {
    taskList.innerHTML =
      '<div class="empty">Unable to load tasks.</div>';
  }
}


/* =====================================================
   FILTER TASKS
===================================================== */

function filteredTasks() {
  if (currentFilter === "active") {
    return tasks.filter(task => !task.completed);
  }

  if (currentFilter === "completed") {
    return tasks.filter(task => task.completed);
  }

  return tasks;
}


/* =====================================================
   RENDER TASKS
===================================================== */

function renderTasks() {
  const visible = filteredTasks();

  if (!visible.length) {
    taskList.innerHTML =
      '<div class="empty">No tasks in this view.</div>';

    return;
  }

  taskList.innerHTML = visible.map(task => `
    <div
      class="task-item ${task.completed ? "completed" : ""}"
      data-id="${task.id}"
    >

      <input
        class="task-check"
        type="checkbox"
        ${task.completed ? "checked" : ""}
        aria-label="Complete task"
      >

      <span class="task-title">
        ${escapeHtml(task.title)}
      </span>

      <button
        class="delete-btn"
        aria-label="Delete task"
      >
        ✕
      </button>

    </div>
  `).join("");
}


/* =====================================================
   HTML SECURITY
===================================================== */

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}


/* =====================================================
   ADD TASK
===================================================== */

taskForm.addEventListener("submit", async event => {
  event.preventDefault();

  const title = taskInput.value.trim();

  if (!title) return;

  const response = await fetch("/api/tasks", {
    method: "POST",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      title
    })
  });

  if (response.ok) {
    taskInput.value = "";

    await loadTasks();
  }
});


/* =====================================================
   DELETE TASK
===================================================== */

taskList.addEventListener("click", async event => {

  const item = event.target.closest(".task-item");

  if (!item) return;

  const id = item.dataset.id;

  if (event.target.classList.contains("delete-btn")) {

    await fetch(`/api/tasks/${id}`, {
      method: "DELETE"
    });

    await loadTasks();
  }
});


/* =====================================================
   COMPLETE TASK
===================================================== */

taskList.addEventListener("change", async event => {

  if (!event.target.classList.contains("task-check")) {
    return;
  }

  const item = event.target.closest(".task-item");

  await fetch(`/api/tasks/${item.dataset.id}`, {

    method: "PATCH",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      completed: event.target.checked
    })

  });

  await loadTasks();
});


/* =====================================================
   FILTER BUTTONS
===================================================== */

filters.forEach(button => {

  button.addEventListener("click", () => {

    filters.forEach(item =>
      item.classList.remove("active")
    );

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTasks();
  });

});


/* =====================================================
   API HEALTH CHECK
===================================================== */

healthBtn.addEventListener("click", async () => {

  healthBtn.disabled = true;

  healthBtn.textContent = "Checking...";

  try {

    const response =
      await fetch("/api/health");

    const data =
      await response.json();

    healthStatus.textContent =
      `API status: ${data.status} • ${data.environment} • ${new Date(data.timestamp).toLocaleTimeString()}`;

    healthStatus.classList.toggle(
      "ok",
      response.ok
    );

  } catch {

    healthStatus.textContent =
      "API status: unavailable";

    healthStatus.classList.remove("ok");

  } finally {

    healthBtn.disabled = false;

    healthBtn.textContent = "Check API";
  }
});


/* =====================================================
   START APPLICATION
===================================================== */

loadTasks();

/* =====================================================
   INTERACTIVE APPLICATION CAPABILITIES
===================================================== */

const capabilityCards =
  document.querySelectorAll(".capability-card");

const capabilityPanel =
  document.getElementById("capability-panel");

const capabilityClose =
  document.getElementById("capability-close");

const capabilityIcon =
  document.getElementById("capability-icon");

const capabilityTitle =
  document.getElementById("capability-title");

const capabilitySummary =
  document.getElementById("capability-summary");

const capabilityTechnologies =
  document.getElementById("capability-technologies");

const capabilitySections =
  document.getElementById("capability-sections");


/* =====================================================
   OPEN CAPABILITY
===================================================== */

async function openCapability(capabilityId) {

  try {

    const response =
      await fetch(`/api/capabilities/${capabilityId}`);

    if (!response.ok) {
      throw new Error("Capability not found");
    }

    const capability =
      await response.json();


    capabilityIcon.textContent =
      capability.icon;

    capabilityTitle.textContent =
      capability.title;

    capabilitySummary.textContent =
      capability.summary;


    /* TECHNOLOGIES */

    capabilityTechnologies.innerHTML =
      capability.technologies
        .map(
          technology =>
            `<span class="capability-tech">
              ${escapeHtml(technology)}
            </span>`
        )
        .join("");


    /* DETAIL SECTIONS */

    capabilitySections.innerHTML =
      capability.sections
        .map(
          section => `
            <article class="capability-detail-card">

              <h4>
                ${escapeHtml(section.title)}
              </h4>

              <p>
                ${escapeHtml(section.description)}
              </p>

              <ul>
                ${section.items
                  .map(
                    item =>
                      `<li>
                        ${escapeHtml(item)}
                      </li>`
                  )
                  .join("")}
              </ul>

            </article>
          `
        )
        .join("");


    capabilityPanel.classList.add("open");

    capabilityPanel.setAttribute(
      "aria-hidden",
      "false"
    );

    document.body.style.overflow = "hidden";

  } catch (error) {

    console.error(
      "Capability loading failed:",
      error
    );

  }
}


/* =====================================================
   CLOSE CAPABILITY
===================================================== */

function closeCapability() {

  capabilityPanel.classList.remove("open");

  capabilityPanel.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


/* =====================================================
   CARD CLICK
===================================================== */

capabilityCards.forEach(card => {

  card.addEventListener("click", () => {

    const capabilityId =
      card.dataset.capability;

    openCapability(capabilityId);

  });


  /* Keyboard accessibility */

  card.addEventListener("keydown", event => {

    if (
      event.key === "Enter" ||
      event.key === " "
    ) {

      event.preventDefault();

      const capabilityId =
        card.dataset.capability;

      openCapability(capabilityId);

    }

  });

});


/* =====================================================
   CLOSE BUTTON
===================================================== */

if (capabilityClose) {

  capabilityClose.addEventListener(
    "click",
    closeCapability
  );

}


/* =====================================================
   CLOSE WHEN CLICKING BACKDROP
===================================================== */

if (capabilityPanel) {

  capabilityPanel.addEventListener(
    "click",
    event => {

      if (
        event.target === capabilityPanel
      ) {

        closeCapability();

      }

    }
  );

}


/* =====================================================
   ESCAPE KEY
===================================================== */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.key === "Escape" &&
      capabilityPanel.classList.contains("open")
    ) {

      closeCapability();

    }

  }
);
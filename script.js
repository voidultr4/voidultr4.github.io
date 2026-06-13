const projects = [
  {
    title: "HATTA",
    category: "web",
    featured: true,
    description: "Smart rehabilitation glove project and product page built as a clean web experience.",
    tags: ["healthtech", "web", "product"],
    url: "https://hatta.lovable.app",
    source: "",
    keywords: "hatta smart rehabilitation glove lovable healthcare product page",
    icon: "https://hatta.lovable.app/favicon.ico",
  },
  {
    title: "Portfolio Site",
    category: "web",
    description: "The main personal website for projects, live Discord presence, links, and contact routes.",
    tags: ["github pages", "vanilla js", "portfolio"],
    url: "https://voidultr4.github.io",
    source: "https://github.com/voidultr4/voidultr4.github.io",
    keywords: "website portfolio github pages personal site",
    iconType: "window",
  },
  {
    title: "GitHub Projects",
    category: "tools",
    description: "Public repositories, code experiments, and project work from the voidultr4 GitHub profile.",
    tags: ["code", "repos", "experiments"],
    url: "https://github.com/voidultr4?tab=repositories",
    source: "https://github.com/voidultr4",
    keywords: "github code repositories projects tools",
    iconType: "github",
  },
  {
    title: "More Soon",
    category: "other",
    description: "A reserved slot for the next project, game, tool, or experiment worth shipping.",
    tags: ["future", "ideas", "void lab"],
    url: "mailto:voidultr4@gmail.com",
    source: "",
    keywords: "more coming soon future project game tool experiment",
    iconType: "plus",
  },
];

const statusLabels = {
  online: "online",
  idle: "idle",
  dnd: "do not disturb",
  offline: "offline",
};

const filters = document.querySelectorAll(".filter");
const searchInput = document.querySelector("#projectSearch");
const projectGrid = document.querySelector("#projectGrid");
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector("#primaryNav");
const discordAvatar = document.querySelector("#discordAvatar");
const discordTitle = document.querySelector("#discord-title");
const discordUsername = document.querySelector("#discordUsername");
const discordStatus = document.querySelector("#discordStatus");
const discordActivity = document.querySelector("#discordActivity");
const discordUpdated = document.querySelector("#discordUpdated");
const localTime = document.querySelector("#localTime");
const presenceDot = document.querySelector("#presenceDot");
const syncState = document.querySelector("#syncState");

const DISCORD_USER_ID = "1375722019039084554";
let activeFilter = "all";

function iconMarkup(project) {
  if (project.icon) {
    return `<img src="${project.icon}" alt="" loading="lazy" />`;
  }

  const icons = {
    github:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.04c-3.34.73-4.04-1.42-4.04-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.48 11.48 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.49 5.93.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" /></svg>',
    plus:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2h-6v6a1 1 0 1 1-2 0v-6H5a1 1 0 1 1 0-2h6V5a1 1 0 0 1 1-1Z" /></svg>',
    window:
      '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v13a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 18.5v-13Zm2.5-.7a.7.7 0 0 0-.7.7v2.1h12.4V5.5a.7.7 0 0 0-.7-.7h-11Zm-.7 4.6v9.1c0 .39.31.7.7.7h11c.39 0 .7-.31.7-.7V9.4H5.8Zm2.1 2.2h4.6v1.8H7.9v-1.8Zm0 3.2h8.2v1.8H7.9v-1.8Z" /></svg>',
  };

  return icons[project.iconType] || icons.window;
}

function renderProjects() {
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <article
          class="project-card${project.featured ? " featured" : ""}"
          data-category="${project.category}"
          data-keywords="${project.keywords}"
        >
          <div class="project-top">
            <span class="project-icon">${iconMarkup(project)}</span>
            <span class="project-tag">${project.category}</span>
          </div>
          <div>
            <h3 class="project-title">${project.title}</h3>
            <p class="project-description">${project.description}</p>
          </div>
          <div class="tag-row" aria-label="${project.title} tags">
            ${project.tags.map((tag) => `<span>${tag}</span>`).join("")}
          </div>
          <div class="project-actions">
            <a class="project-action primary" href="${project.url}" target="${project.url.startsWith("mailto:") ? "_self" : "_blank"}" rel="noreferrer">Open</a>
            ${
              project.source
                ? `<a class="project-action" href="${project.source}" target="_blank" rel="noreferrer">Source</a>`
                : ""
            }
          </div>
        </article>
      `
    )
    .join("");
}

function updateProjects() {
  const query = searchInput.value.trim().toLowerCase();
  const cards = document.querySelectorAll(".project-card");
  let visibleCount = 0;

  cards.forEach((card) => {
    const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
    const searchableText = `${card.textContent} ${card.dataset.keywords}`.toLowerCase();
    const searchMatch = !query || searchableText.includes(query);
    const isVisible = categoryMatch && searchMatch;

    card.hidden = !isVisible;
    if (isVisible) visibleCount += 1;
  });

  emptyState.hidden = visibleCount !== 0;
}

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    updateProjects();
  });
});

searchInput.addEventListener("input", updateProjects);

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.addEventListener("click", (event) => {
  if (event.target.tagName === "A") {
    navLinks.classList.remove("open");
    navToggle.setAttribute("aria-expanded", "false");
  }
});

function formatClock(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function updateLocalTime() {
  localTime.textContent = formatClock();
}

function setSyncState(text, isError = false) {
  syncState.textContent = text;
  syncState.classList.toggle("error", isError);
}

function setPresence(status) {
  const normalizedStatus = status || "offline";
  presenceDot.className = `presence-dot ${normalizedStatus}`;
  discordStatus.textContent = statusLabels[normalizedStatus] || normalizedStatus;
}

function getAvatarUrl(user) {
  if (!user?.avatar) return "https://github.com/voidultr4.png";
  const extension = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=160`;
}

function getActivityText(activities = []) {
  const customStatus = activities.find((activity) => activity.type === 4);
  if (customStatus?.state) return customStatus.state;

  const activity = activities.find((item) => item.name && item.name !== "Custom Status");
  if (!activity) return "No active game or app";

  const details = [activity.name, activity.details, activity.state].filter(Boolean);
  return details.join(" - ");
}

function renderDiscordFallback(message = "Live Discord data unavailable") {
  discordTitle.textContent = "voidultr4";
  discordUsername.textContent = "@fakesanta";
  discordAvatar.src = "https://github.com/voidultr4.png";
  discordActivity.textContent = message;
  discordUpdated.textContent = formatClock();
  setPresence("offline");
  setSyncState("offline", true);
}

async function updateDiscordCard() {
  updateLocalTime();

  if (!DISCORD_USER_ID || DISCORD_USER_ID.includes("PUT_")) {
    renderDiscordFallback("Add your Discord user ID in script.js");
    return;
  }

  setSyncState("syncing");

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
    if (!response.ok) throw new Error("Discord presence unavailable");

    const payload = await response.json();
    if (!payload.success) throw new Error("Discord presence unavailable");

    const data = payload.data;
    const user = data.discord_user;
    discordAvatar.src = getAvatarUrl(user);
    discordTitle.textContent = user.global_name || user.username || "voidultr4";
    discordUsername.textContent = user.username ? `@${user.username}` : "@fakesanta";
    discordActivity.textContent = getActivityText(data.activities);
    discordUpdated.textContent = formatClock();
    setPresence(data.discord_status);
    setSyncState("live");
  } catch {
    renderDiscordFallback();
  }
}

renderProjects();
updateProjects();
year.textContent = new Date().getFullYear();
updateDiscordCard();
setInterval(updateDiscordCard, 30000);
setInterval(updateLocalTime, 1000);

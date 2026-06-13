const filters = document.querySelectorAll(".filter");
const searchInput = document.querySelector("#projectSearch");
const cards = document.querySelectorAll(".project-card");
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");
const discordAvatar = document.querySelector("#discordAvatar");
const discordTitle = document.querySelector("#discord-title");
const discordUsername = document.querySelector("#discordUsername");
const discordStatus = document.querySelector("#discordStatus");
const discordActivity = document.querySelector("#discordActivity");
const discordUpdated = document.querySelector("#discordUpdated");
const localTime = document.querySelector("#localTime");
const presenceDot = document.querySelector("#presenceDot");

// Replace this with your numeric Discord user ID.
// Your username (@fakesanta) is not enough for live presence APIs.
const DISCORD_USER_ID = "1375722019039084554";

let activeFilter = "all";

function updateProjects() {
  const query = searchInput.value.trim().toLowerCase();
  let visibleCount = 0;

  cards.forEach((card) => {
    const categoryMatch = activeFilter === "all" || card.dataset.category === activeFilter;
    const text = card.textContent.toLowerCase();
    const keywords = card.dataset.keywords.toLowerCase();
    const searchMatch = !query || text.includes(query) || keywords.includes(query);
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
year.textContent = new Date().getFullYear();

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

function setPresence(status) {
  presenceDot.className = `presence-dot ${status || "offline"}`;
  discordStatus.textContent = status || "offline";
}

function getAvatarUrl(user) {
  if (!user?.avatar) return "https://github.com/voidultr4.png";
  const extension = user.avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}?size=128`;
}

function getActivityText(activities = []) {
  const customStatus = activities.find((activity) => activity.type === 4);
  if (customStatus?.state) return customStatus.state;

  const activity = activities.find((item) => item.name && item.name !== "Custom Status");
  if (!activity) return "No activity";

  const details = [activity.name, activity.details, activity.state].filter(Boolean);
  return details.join(" - ");
}

function renderDiscordFallback() {
  discordTitle.textContent = "voidultr4";
  discordUsername.textContent = "@fakesanta";
  discordActivity.textContent = "Add your Discord user ID in script.js";
  discordUpdated.textContent = "not connected yet";
  setPresence("offline");
}

async function updateDiscordCard() {
  updateLocalTime();

  if (!DISCORD_USER_ID || DISCORD_USER_ID.includes("PUT_")) {
    renderDiscordFallback();
    return;
  }

  try {
    const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_USER_ID}`);
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
  } catch {
    discordActivity.textContent = "Live Discord data unavailable";
    discordUpdated.textContent = formatClock();
    setPresence("offline");
  }
}

updateDiscordCard();
setInterval(updateDiscordCard, 30000);
setInterval(updateLocalTime, 1000);

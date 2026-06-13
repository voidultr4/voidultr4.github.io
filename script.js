const filters = document.querySelectorAll(".filter");
const searchInput = document.querySelector("#projectSearch");
const cards = document.querySelectorAll(".project-card");
const emptyState = document.querySelector("#emptyState");
const year = document.querySelector("#year");

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

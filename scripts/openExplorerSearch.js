document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("click", (e) => {
        const target = e.target;
        const searchIcons = document.querySelectorAll(".search-icon");
        const searchBars = document.querySelectorAll(".search-bar");
        const activeSearches = new Set();

        searchIcons.forEach((icon) => {
            const targetId = icon.getAttribute("data-search-target");
            const searchBar = document.getElementById(targetId);
            if (!searchBar) return;

            if (target === icon) {
                const isActive = icon.classList.toggle("active");
                searchBar.classList.toggle("active");

                if (isActive) {
                    activeSearches.add(targetId);
                    const input = searchBar.querySelector("input");
                    if (input) input.focus();
                } else {
                    activeSearches.delete(targetId);
                    const input = searchBar.querySelector("input");
                    if (input) input.value = "";
                }
            }

            // Close search when clicking outside
            if (!icon.contains(target) && !searchBar.contains(target)) {
                icon.classList.remove("active");
                searchBar.classList.remove("active");
                activeSearches.delete(targetId);
                const input = searchBar.querySelector("input");
                if (input) input.value = "";
            }
        });
    });

    // Close search when pressing Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            document.querySelectorAll(".search-bar").forEach((searchBar) => {
                searchBar.classList.remove("active");
                const input = searchBar.querySelector("input");
                if (input) input.value = "";
            });
        }
    });
});

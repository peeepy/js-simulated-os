import { apps } from "./appManager.js";
import { openApp } from "./appManager.js";
import { addWindowToTaskbar } from "./taskbarManager.js";

document.getElementById("start-menu-button").addEventListener("click", () => {
    const menu = document.getElementById("start-menu-container");
    menu.classList.toggle("hidden");
});

function renderStartMenu() {
    const appContainer = document.querySelector(".app-container");
    const sidebarItems = document.querySelectorAll(".menu-sidebar .menu-item");
    const menuTitle = document.getElementById("menu-title");

    let activeSection = "applications"; // Default section

    function updateMenu() {
        appContainer.innerHTML = ""; // Clear existing apps

        Object.keys(apps).forEach(appId => {
            const app = apps[appId];

            if (
                (activeSection === "documents" && app.type === "document") ||
                (activeSection === "applications" && app.type === "application")
            ) {
                let menuItem = document.createElement("div");
                menuItem.classList.add("menu-item");
                menuItem.dataset.app = appId;
                menuItem.innerHTML = `<p>${app.title}</p>`;

                menuItem.addEventListener("click", () => {
                    openApp(appId);
                });

                appContainer.appendChild(menuItem);
            }
        });
    }

    sidebarItems.forEach(item => {
        item.addEventListener("click", () => {
            activeSection = item.dataset.section;
            menuTitle.textContent = activeSection.charAt(0).toUpperCase() + activeSection.slice(1); // Update title
            updateMenu();
        });
    });

    updateMenu(); // Initial render
}

document.addEventListener("DOMContentLoaded", renderStartMenu());


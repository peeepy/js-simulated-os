// const apps = {
//     explorer: {
//         title: "Explorer",
//         icon: "assets/folder-mac.png",
//         content: "<p>This is the Explorer window.</p>",
//         desktop: true
//     },
//     documents: {
//         title: "Documents",
//         icon: "assets/folder-mac.png",
//         content: "<p>This is the Documents window.</p>",
//         desktop: true
//     },
//     notepad: {
//         title: "Notepad",
//         icon: "assets/notepad-icon.png",
//         content: `<textarea style="width: 100%; height: 100%; border: none; outline: none; font-size: 16px;"></textarea>`,
//         desktop: false
//     },
//     calculator: {
//         title: "Calculator",
//         icon: "assets/calculator-icon.png",
//         content: "<p>This is a calculator.</p>",
//         desktop: false
//     }
// };

document.getElementById("start-menu-button").addEventListener("click", () => {
    const menu = document.getElementById("start-menu-container");
    menu.classList.toggle("hidden");
});

function renderStartMenu() {
    const appContainer = document.querySelector(".app-container");
    appContainer.innerHTML = ""; // Clear existing apps

    Object.keys(apps).forEach(appId => {
        const app = apps[appId];

        let menuItem = document.createElement("div");
        menuItem.classList.add("menu-item");
        menuItem.dataset.app = appId;
        menuItem.innerHTML = `<p>${app.title}</p>`;

        menuItem.addEventListener("click", () => {
            openApp(appId);
        });

        appContainer.appendChild(menuItem);
    });
}

// Run this function on page load
document.addEventListener("DOMContentLoaded", renderStartMenu);

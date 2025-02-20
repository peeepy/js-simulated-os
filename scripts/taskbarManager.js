import { bringWindowToFront } from "./windowManager.js";

const taskbarWindows = document.querySelector(".taskbar-windows");

    // 🟢 Open Start Menu
    const startMenuButton = document.getElementById("start-menu-button");
    const startMenu = document.getElementById("start-menu-container");

    startMenuButton.addEventListener("click", () => {
        startMenu.classList.toggle("hidden");
        startMenu.style.display = startMenu.classList.contains("hidden") ? "none" : "block";
    });

    // 🟢 Add App to Taskbar
    export function addWindowToTaskbar(windowId, iconSrc) {
        if (document.querySelector(`.taskbar-icon[data-window="${windowId}"]`)) return;

        let taskbarIconDiv = document.createElement("div");
        taskbarIconDiv.classList.add("taskbar-icon");
        taskbarIconDiv.dataset.window = windowId;
        taskbarIconDiv.innerHTML = `<img src="${iconSrc || "assets/folder-mac.png"}" />`;

        taskbarIconDiv.addEventListener("click", () => toggleWindow(windowId));
        taskbarWindows.appendChild(taskbarIconDiv);
    }


    // 🟢 Toggle Window (Minimize/Restore)
    export function toggleWindow(windowId) {
        let windowElement = document.getElementById(`window-${windowId}`);
        if (!windowElement) return;

        let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));
        let topWindow = windows.reduce((highest, current) =>
            parseInt(current.style.zIndex) > parseInt(highest.style.zIndex) ? current : highest, windows[0]);

        if (windowElement === topWindow) {
            minimizeWindow(windowId);
        } else {
            restoreWindow(windowElement);
        }

        updateTaskbarStyling();
    }

    // 🟢 Minimize Window
    export function minimizeWindow(windowId) {
        let windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.classList.add("hidden");
            windowElement.style.visibility = "hidden";
            windowElement.style.opacity = "0";
        }
    }

    // 🟢 Restore (Show) Window
    export function restoreWindow(windowElement) {
        windowElement.classList.remove("hidden");
        windowElement.style.visibility = "visible";
        windowElement.style.opacity = "1";
        bringWindowToFront(windowElement);
    }

    export function closeWindow(windowId) {
        let windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.remove(); // Completely removes the window from the DOM
            removeWindowFromTaskbar(windowId);
        }
        updateTaskbarStyling();
}
    
export function removeWindowFromTaskbar(windowId) {
    let taskbarIconDiv = document.querySelector(`.taskbar-icon[data-window="${windowId}"]`);
    if (taskbarIconDiv) {
        taskbarIconDiv.remove();
    }
}

    // 🟢 Update Taskbar Styling (Fixes Start Menu & Pinned Apps)
export function updateTaskbarStyling() {
        let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));

        document.querySelectorAll(".taskbar-icon").forEach(icon => {
            let windowId = icon.dataset.window;
            let windowElement = document.getElementById(`window-${windowId}`);

            // 🛑 Exclude Start Menu Button
            if (icon.id === "start-menu-button") return;

            if (windowElement) {
                if (!windowElement.classList.contains("hidden")) {
                    icon.classList.add("focus");
                    icon.classList.remove("open-indicator");
                } else {
                    icon.classList.add("open-indicator");
                    icon.classList.remove("focus");
                }
            } else {
                // 🟢 Ensure Pinned Apps Have No Styling Until Opened
                if (!icon.classList.contains("pinned")) {
                    icon.classList.remove("focus", "open-indicator");
                }
            }
        });
    }


    // // 🟢 Add App to Taskbar
    // function addWindowToTaskbar(windowId, iconSrc) {
    //     if (document.querySelector(`.taskbar-icon[data-window="${windowId}"]`)) return;

    //     let taskbarIconDiv = document.createElement("div");
    //     taskbarIconDiv.classList.add("taskbar-icon");
    //     taskbarIconDiv.dataset.window = windowId;
    //     taskbarIconDiv.innerHTML = `<img src="${iconSrc || "assets/folder-mac.png"}" />`;

    //     taskbarIconDiv.addEventListener("click", () => toggleWindow(windowId));
    //     taskbarWindows.appendChild(taskbarIconDiv);
    // }

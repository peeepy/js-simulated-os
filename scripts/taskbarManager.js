document.addEventListener("DOMContentLoaded", () => {
    const taskbarWindows = document.querySelector(".taskbar-windows");
    let highestZIndex = 100;

    // 🟢 Open Start Menu
    const startMenuButton = document.getElementById("start-menu-button");
    const startMenu = document.getElementById("start-menu-container");

    startMenuButton.addEventListener("click", () => {
        startMenu.classList.toggle("hidden");
        startMenu.style.display = startMenu.classList.contains("hidden") ? "none" : "block";
    });

    // 🟢 Add App to Taskbar
    function addWindowToTaskbar(windowId, iconSrc) {
        if (document.querySelector(`.taskbar-icon[data-window="${windowId}"]`)) return;

        let taskbarIconDiv = document.createElement("div");
        taskbarIconDiv.classList.add("taskbar-icon");
        taskbarIconDiv.dataset.window = windowId;
        taskbarIconDiv.innerHTML = `<img src="${iconSrc || "assets/folder-mac.png"}" />`;

        taskbarIconDiv.addEventListener("click", () => toggleWindow(windowId));
        taskbarWindows.appendChild(taskbarIconDiv);
    }

    // 🟢 Toggle Window (Minimize/Restore)
    function toggleWindow(windowId) {
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
    function minimizeWindow(windowId) {
        let windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.classList.add("hidden");
            windowElement.style.visibility = "hidden";
            windowElement.style.opacity = "0";
        }
    }

    // 🟢 Restore (Show) Window
    function restoreWindow(windowElement) {
        windowElement.classList.remove("hidden");
        windowElement.style.visibility = "visible";
        windowElement.style.opacity = "1";
        bringWindowToFront(windowElement);
    }

    // 🟢 Close Window
    function closeWindow(windowId) {
        let windowElement = document.getElementById(`window-${windowId}`);
        if (windowElement) {
            windowElement.classList.add("hidden");
            windowElement.style.visibility = "hidden";
            windowElement.style.opacity = "0";
            removeWindowFromTaskbar(windowId);
        }
        updateTaskbarStyling();
    }

  // 🟢 Update Taskbar Styling (Fixes Start Menu & Pinned Apps)
 function updateTaskbarStyling() {
    let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));

    // Determine the currently focused (highest z-index) window
    let focusedWindow = windows.reduce((highest, current) => {
        return parseInt(current.style.zIndex) > parseInt(highest.style.zIndex) ? current : highest;
    }, windows[0]);

    document.querySelectorAll(".taskbar-icon").forEach(icon => {
        let windowId = icon.dataset.window;
        let windowElement = document.getElementById(`window-${windowId}`);

        // 🛑 Exclude Start Menu Button
        if (icon.id === "start-menu-button") return;

        if (windowElement && !windowElement.classList.contains("hidden")) {
            if (windowElement === focusedWindow) {
                // 🟢 The focused window gets the 'focus' class
                icon.classList.add("focus");
                icon.classList.remove("open-indicator");
            } else {
                // 🟢 Other open but unfocused windows get 'open-indicator'
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

    // 🟢 Bring Windows to Front
    function bringWindowToFront(windowElement) {
        highestZIndex++;
        windowElement.style.zIndex = highestZIndex;
        updateTaskbarStyling();
    }

    // Run on Page Load
    document.addEventListener("mousedown", (e) => {
        let windowElement = e.target.closest(".window");
        if (windowElement) bringWindowToFront(windowElement);
    });
});

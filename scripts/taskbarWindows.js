document.addEventListener("DOMContentLoaded", () => {
    const taskbarWindows = document.querySelector(".taskbar-windows");
    let highestZIndex = 100; // Global z-index tracking

    // open start menu
    const startMenuButton = document.getElementById("start-menu-button");
    const startMenu = document.getElementById("start-menu-container");

    startMenuButton.addEventListener("click", () => {
        if (startMenu.classList.contains("hidden")) {
            startMenu.style.display = "block";
            startMenu.classList.remove("hidden");
        } else {
            startMenu.style.display = "none";
            startMenu.classList.add("hidden");
        }
    });

    function addWindowToTaskbar(windowId, iconSrc) {
        let windowElement = document.getElementById(windowId);

        // Prevent duplicate taskbar entries
        if (document.querySelector(`.taskbar-icon[data-window="${windowId}"]`)) {
            return;
        }

        let taskbarIconDiv = document.createElement("div");
        taskbarIconDiv.classList.add("taskbar-icon");
        taskbarIconDiv.dataset.window = windowId;

        let taskbarIcon = document.createElement("img");
        taskbarIcon.src = iconSrc || "assets/folder-mac.png";

        taskbarIconDiv.appendChild(taskbarIcon);
        taskbarWindows.appendChild(taskbarIconDiv);

        // Attach click event to toggle window
        taskbarIconDiv.addEventListener("click", () => {
            toggleWindow(windowId);
        });

    }

 function toggleWindow(windowId) {
    let windowElement = document.getElementById(windowId);
    if (!windowElement) return;

    // Find the currently focused window
    let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));
    let topWindow = windows.reduce((highest, current) => {
        return (parseInt(current.style.zIndex) > parseInt(highest.style.zIndex)) ? current : highest;
    }, windows[0]);

    // If the window is already focused, minimize it
    if (windowElement === topWindow) {
        windowElement.classList.add("hidden");
        windowElement.style.visibility = "hidden";
        windowElement.style.opacity = "0";
    } else {
        // Otherwise, bring it to the front
        windowElement.classList.remove("hidden");
        windowElement.style.visibility = "visible";
        windowElement.style.opacity = "1";
        bringWindowToFront(windowElement);
    }

    updateTaskbarStyling();
}


    function removeWindowFromTaskbar(windowId) {
        let taskbarIconDiv = document.querySelector(`.taskbar-icon[data-window="${windowId}"]`);
        if (taskbarIconDiv) {
            taskbarIconDiv.remove();
        }
    }

function updateTaskbarStyling() {
    let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));
    
    if (windows.length === 0) {
        // No windows open, remove all focus classes
        document.querySelectorAll(".taskbar-icon").forEach(icon => icon.classList.remove("focus"));
        return;
    }

    // Find the window with the highest actual z-index
    let topWindow = windows.reduce((highest, current) => {
        return (parseInt(current.style.zIndex) > parseInt(highest.style.zIndex)) ? current : highest;
    }, windows[0]);

    // Update taskbar icons based on which window is at the front
    document.querySelectorAll(".taskbar-icon").forEach(icon => {
        let windowId = icon.dataset.window;
        let windowElement = document.getElementById(windowId);

        if (windowElement && !windowElement.classList.contains("hidden") && windowElement !== "start-menu-container") {
            if (windowElement === topWindow) {
                icon.classList.add("focus"); // Only add focus class to the top window's taskbar icon
                icon.classList.remove("open-indicator");
            } else {
                icon.classList.add("open-indicator");
                icon.classList.remove("focus");
            }
        } else {
            icon.classList.add("open-indicator");
            icon.classList.remove("focus");
        }

    });
}


    // Open Windows when a Folder is Clicked
    document.querySelectorAll(".folder").forEach(folder => {
        folder.addEventListener("dblclick", function () {
            let windowId = this.dataset.window;
            let targetWindow = document.getElementById(windowId);
            
            if (targetWindow) {
                targetWindow.classList.remove("hidden");
                targetWindow.style.visibility = "visible";
                targetWindow.style.opacity = "1";
                bringWindowToFront(targetWindow);
                addWindowToTaskbar(windowId, "assets/folder-mac.png");
                updateTaskbarStyling();
            }
        });
    });

    // Close Window Button
    document.querySelectorAll(".window-button.close").forEach(closeBtn => {
        closeBtn.addEventListener("click", function () {
            let parentWindow = this.closest(".window");
            parentWindow.classList.add("hidden");
            parentWindow.style.visibility = "hidden";
            parentWindow.style.opacity = "0";
            removeWindowFromTaskbar(parentWindow.id); // Remove from taskbar on close
            updateTaskbarStyling();
        });
    });

    // Minimize Window Button
    document.querySelectorAll(".window-button.minimize").forEach(minimizeBtn => {
        minimizeBtn.addEventListener("click", function () {
            let parentWindow = this.closest(".window");
            parentWindow.classList.add("hidden");
            parentWindow.style.visibility = "hidden";
            parentWindow.style.opacity = "0";
            updateTaskbarStyling();
        });
    });

    // Maximise window button
document.querySelectorAll(".window-button.maximize").forEach(maximizeBtn => {
    maximizeBtn.addEventListener("click", function () {
        let parentWindow = this.closest(".window");
        let desktop = document.querySelector(".desktop");

        if (!parentWindow.dataset.isMaximized) {
            // Save original size & position
            parentWindow.dataset.originalWidth = parentWindow.style.width;
            parentWindow.dataset.originalHeight = parentWindow.style.height;
            parentWindow.dataset.originalTop = parentWindow.style.top;
            parentWindow.dataset.originalLeft = parentWindow.style.left;

            // Get available desktop height (excluding floating taskbar space)
            let availableHeight = desktop.clientHeight; // Now considers taskbar gap

            // Maximize window within the desktop
            parentWindow.style.width = "100vw";
            parentWindow.style.height = `${availableHeight}px`;
            parentWindow.style.top = "0";
            parentWindow.style.left = "0";
            parentWindow.dataset.isMaximized = "true";
        } else {
            // Restore original size & position
            parentWindow.style.width = parentWindow.dataset.originalWidth;
            parentWindow.style.height = parentWindow.dataset.originalHeight;
            parentWindow.style.top = parentWindow.dataset.originalTop;
            parentWindow.style.left = parentWindow.dataset.originalLeft;
            parentWindow.dataset.isMaximized = "";
        }

        updateTaskbarStyling();
    });
});

    // Bring windows to front when clicked
    document.querySelectorAll(".window").forEach(windowElement => {
        windowElement.addEventListener("mousedown", function () {
            bringWindowToFront(windowElement);
        });
    });

function bringWindowToFront(windowElement) {
    highestZIndex++; 
    windowElement.style.zIndex = highestZIndex;
    updateTaskbarStyling(); // Ensure focus is updated when window is brought to front
}

});

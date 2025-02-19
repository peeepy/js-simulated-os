const apps = {
    explorer: {
        title: "System",
        icon: "assets/folder-mac.png",
        content: `
                           <div class="folders">
                        <div class="folder">
                            <div class="folder-icon">
                                <img src="assets/folder-mac.png" />
                            </div>
                            <div class="folder-name">
                                <p>C:</p>
                            </div>
                        </div>

                        <div class="folder">
                            <div class="folder-icon">
                                <img src="assets/folder-mac.png" />
                            </div>
                            <div class="folder-name">
                                <p>D:</p>
                            </div>
                        </div>
                    </div>
                </div>`,
        desktop: true
    },
    documents: {
        title: "Documents",
        icon: "assets/folder-mac.png",
        content: "<p style='margin:auto'> This is the Documents window.</p>",
        desktop: true
    },
    notepad: {
        title: "Notepad",
        icon: "assets/notepad-icon.png",
        content: `<textarea style="width: 100%; height: 100%; border: none; outline: none; font-size: 16px;"></textarea>`,
        desktop: false
    },
    calculator: {
        title: "Calculator",
        icon: "assets/calculator-icon.png",
        content: "<p>This is a calculator.</p>",
        desktop: false
    }
};

const taskbarWindows = document.querySelector(".taskbar-windows");

// 🟢 Ensure Desktop Icons Render
function renderDesktopIcons() {
    const desktop = document.querySelector(".desktop");
    if (!desktop) {
        console.error("❌ Desktop container not found!");
        return;
    }
    
    desktop.innerHTML = ""; // Clear existing desktop icons

    Object.keys(apps).forEach(appId => {
        const app = apps[appId];
        if (app.desktop) {
            let folderDiv = document.createElement("div");
            folderDiv.classList.add("folder");
            folderDiv.dataset.app = appId;

            let folderIcon = document.createElement("div");
            folderIcon.classList.add("folder-icon");

            let iconImg = document.createElement("img");
            iconImg.src = app.icon;
            iconImg.alt = app.title;

            let folderName = document.createElement("div");
            folderName.classList.add("folder-name");
            folderName.innerHTML = `<p>${app.title}</p>`;

            folderIcon.appendChild(iconImg);
            folderDiv.appendChild(folderIcon);
            folderDiv.appendChild(folderName);

            // Double-click to open app
            folderDiv.addEventListener("dblclick", () => openApp(appId));

            desktop.appendChild(folderDiv);
        }
    });

    console.log("✅ Desktop icons rendered!");
}

// 🟢 Open or Bring App to Front
function openApp(appId) {
    const app = apps[appId];
    if (!app) {
        console.error(`❌ App '${appId}' not found.`);
        return;
    }

    let windowElement = document.getElementById(`window-${appId}`);

    if (!windowElement) {
        createWindow(appId, app.title, app.icon, app.content);
    } else {
        bringWindowToFront(windowElement);
    }
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

function updateTaskbarStyling() {
    let windows = Array.from(document.querySelectorAll(".window:not(.hidden)"));

    // Determine the currently focused (highest z-index) window
    let focusedWindow = null;
    let highestZ = 0;

    windows.forEach(win => {
        let zIndex = parseInt(win.style.zIndex) || 0;
        if (zIndex > highestZ) {
            highestZ = zIndex;
            focusedWindow = win;
        }
    });

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

    // function removeWindowFromTaskbar(windowId) {
    //     let taskbarIconDiv = document.querySelector(`.taskbar-icon[data-window="${windowId}"]`);
    //     if (taskbarIconDiv) {
    //         taskbarIconDiv.remove();
    //     }
    // }


// 🟢 Create a New Window (Fully Fixed)
function createWindow(id, title, icon, content) {
    const desktop = document.getElementById("desktop");

    let windowDiv = document.createElement("div");
    windowDiv.classList.add("window");
    windowDiv.id = `window-${id}`;
    windowDiv.style.zIndex = ++highestZIndex;
    windowDiv.style.left = "100px"; // Default position
    windowDiv.style.top = "100px";

    windowDiv.innerHTML = `
               <div class="window-header">
                    <div class="window-header-left">
                        <div class="window-buttons">
                            <div class="window-button close"></div>
                            <div class="window-button minimize"></div>
                            <div class="window-button maximize"></div>
                        </div>
                    </div>
                    <div class="window-header-right">
                        <div id="placeholder-text">
                            <i class="bi bi-chevron-left"></i>
                            <i class="bi bi-chevron-right"></i>
                        </div>
                        <div class="window-title">
                            ${title}
                        </div>
                        <i class="bi bi-search search-icon" data-search-target="search-bar-mypc"></i>
                        <div class="search-bar" id="search-bar-mypc">
                            <input type="text" placeholder="Search..." />
                        </div>
                    </div>
                </div>
                <div class="window-sidebar">
                    <div class="window-sidebar-item">
                        <p>My PC</p>
                    </div>
                    <div class="window-sidebar-item">
                        <p>Documents</p>
                    </div>
                </div>
                <div class="window-content">${content}</div>

            </div>

        <div class="resize-handle bottom-right"></div>
    `;

    desktop.appendChild(windowDiv);
    
    // 🟢 Bring to Front Immediately & Update Taskbar
    bringWindowToFront(windowDiv);
    addWindowToTaskbar(id, icon);
    
    // 🟢 Ensure Window is Focused Immediately (Fix Taskbar Focus Delay)
    updateTaskbarStyling();

    // 🟢 Attach Event Listeners
    windowDiv.querySelector(".window-button.close").addEventListener("click", () => closeWindow(id));
    windowDiv.querySelector(".window-button.minimize").addEventListener("click", () => minimizeWindow(id));
    windowDiv.querySelector(".window-button.maximize").addEventListener("click", () => maximizeWindow(id));

    // 🟢 Enable Dragging & Resizing Immediately
    makeWindowDraggable(windowDiv);
    enableResizeHandles(windowDiv);

    windowDiv.addEventListener("mousedown", () => bringWindowToFront(windowDiv));
}

// 🟢 Bring Window to Front (Fix Taskbar Delay)
function bringWindowToFront(windowElement) {
    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;
    updateTaskbarStyling(); // Ensure Focus Updates Immediately
}

// 🟢 Make Windows Draggable
function makeWindowDraggable(windowElement) {
    let header = windowElement.querySelector(".window-header");
    let startX, startY, startLeft, startTop, isDragging = false;

    header.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        startLeft = windowElement.offsetLeft;
        startTop = windowElement.offsetTop;

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            windowElement.style.left = `${startLeft + dx}px`;
            windowElement.style.top = `${startTop + dy}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}

// 🟢 Enable Resizing (Ensure Resizing Works)
function enableResizeHandles(windowElement) {
    let resizeHandle = windowElement.querySelector(".resize-handle.bottom-right");
    if (!resizeHandle) return;

    let startX, startY, startWidth, startHeight, isResizing = false;

    resizeHandle.addEventListener("mousedown", (e) => {
        isResizing = true;
        startX = e.clientX;
        startY = e.clientY;
        startWidth = windowElement.offsetWidth;
        startHeight = windowElement.offsetHeight;

        const onMouseMove = (e) => {
            if (!isResizing) return;
            windowElement.style.width = `${startWidth + (e.clientX - startX)}px`;
            windowElement.style.height = `${startHeight + (e.clientY - startY)}px`;
        };

        const onMouseUp = () => {
            isResizing = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
}


// 🟢 Update Taskbar Styling (Fixes Start Menu & Pinned Apps)
function updateTaskbarStyling() {
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
// 🟢 Run Correctly on Page Load
document.addEventListener("DOMContentLoaded", renderDesktopIcons());



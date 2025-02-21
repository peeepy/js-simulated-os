import { updateTaskbarStyling, addWindowToTaskbar, closeWindow, minimizeWindow } from "./taskbarManager.js";
import {generateDrivesContent, initialiseApplication, openApp, openFolder} from "./appManager.js";

let highestZIndex = 100;

// 🟢 Create a New Window (Fully Fixed)
export function createWindow(id, title, icon, content, type = "document") {
    const desktop = document.getElementById("desktop");

    let windowDiv = document.createElement("div");
    windowDiv.classList.add("window");
    windowDiv.id = `window-${id}`;
    windowDiv.style.zIndex = ++highestZIndex;
    windowDiv.style.left = "100px"; 
    windowDiv.style.top = "100px";
    windowDiv.dataset.path = id; // Store path in dataset
    windowDiv.dataset.history = JSON.stringify([id]); // Store navigation history
    windowDiv.dataset.historyIndex = 0; // Track current position in history

    if (type === "application") {
        windowDiv.classList.add("window-application");
        windowDiv.innerHTML = `
            <div class="window-header-application">
                <div class="window-title">${title}</div>
                <div class="window-buttons">
                    <div class="window-button close"></div>
                    <div class="window-button minimize"></div>
                    <div class="window-button maximize"></div>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;
    }

    if (type === "document") {
        windowDiv.classList.add("window-document"); // Apply document styling
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
                        <i class="bi bi-chevron-left nav-back"></i>
                        <i class="bi bi-chevron-right nav-forward"></i>
                    </div>
                    <div class="window-title">${title}</div>
                    <i class="bi bi-search search-icon" data-search-target="search-bar-mypc"></i>
                    <div class="search-bar" id="search-bar-mypc">
                        <input type="text" placeholder="Search..." />
                    </div>
                </div>
            </div>
            <div class="window-content">${content}</div>
        `;

        // Add sidebar for navigation in folders/documents
        let sidebar = document.createElement("div");
        sidebar.classList.add("window-sidebar");
        sidebar.innerHTML = `
            <div class="window-sidebar-item" id="sidebar-item-drives"><p>My PC</p></div>
            <div class="window-sidebar-item"  id="sidebar-item-documents"><p>Documents</p></div>
        `;
        windowDiv.insertBefore(sidebar, windowDiv.querySelector(".window-content"));
    }

    desktop.appendChild(windowDiv);

       // 🟢 Automatically initialize any application when its window opens
    if (type === "application") {
        setTimeout(() => initialiseApplication(id), 50);
    }

    // Bring to front & add to taskbar
    bringWindowToFront(windowDiv);
    addWindowToTaskbar(id, icon);

    // Attach event listeners
    windowDiv.querySelector(".window-button.close").addEventListener("click", () => closeWindow(id));
    windowDiv.querySelector(".window-button.minimize").addEventListener("click", () => minimizeWindow(id));
    // windowDiv.querySelector(".window-button.maximize").addEventListener("click", () => maximizeWindow(id));
    windowDiv.addEventListener("click", () => bringWindowToFront(windowDiv));
    windowDiv.querySelector("#sidebar-item-drives").addEventListener("click", () => openApp('drives'));
    windowDiv.querySelector("#sidebar-item-documents").addEventListener("click", () => openFolder(["C:/documents"]));
    // Add navigation event listeners
    windowDiv.querySelector(".nav-back").addEventListener("click", () => navigateBack(windowDiv));
    windowDiv.querySelector(".nav-forward").addEventListener("click", () => navigateForward(windowDiv));
    windowDiv.querySelector(".window-title").addEventListener("click", () => {
    toggleFullPath(windowDiv);
});

    
    windowDiv.querySelector(".window-title").addEventListener("click", () => {
    toggleFullPath(windowDiv);
});

    makeWindowDraggable(windowDiv);
    enableResizeHandles(windowDiv);
}

function toggleFullPath(windowElement) {
    const titleElement = windowElement.querySelector(".window-title");
    if (!titleElement) return;

    const fullPath = windowElement.dataset.path;
    const folderName = fullPath.split(',').pop();

    if (titleElement.textContent === folderName) {
        titleElement.textContent = fullPath; // Expand to full path
    } else {
        titleElement.textContent = folderName; // Collapse back to folder name
    }
}



export function updateWindowTitle(windowElement, path) {
    const titleElement = windowElement.querySelector(".window-title");
    if (titleElement) {
        const folderName = path.split(',').pop(); // Last folder in path
        titleElement.textContent = folderName;
    }
}


export function pushNavigationHistory(windowElement, path) {
    let history = JSON.parse(windowElement.dataset.history);
    let index = parseInt(windowElement.dataset.historyIndex, 10);

    // Remove future history if user navigated back and then opened a new folder
    history = history.slice(0, index + 1);
    history.push(path);
    
    windowElement.dataset.history = JSON.stringify(history);
    windowElement.dataset.historyIndex = history.length - 1;
}

function navigateBack(windowElement) {
    let history = JSON.parse(windowElement.dataset.history);
    let index = parseInt(windowElement.dataset.historyIndex, 10);
    
    if (index > 0) {
        index--;
        windowElement.dataset.historyIndex = index;
        const path = history[index];

        console.log("⬅ Navigating back to:", path);
        openFolder(path);
    }
}

function navigateForward(windowElement) {
    let history = JSON.parse(windowElement.dataset.history);
    let index = parseInt(windowElement.dataset.historyIndex, 10);
    
    if (index < history.length - 1) {
        index++;
        windowElement.dataset.historyIndex = index;
        const path = history[index];

        console.log("➡ Navigating forward to:", path);
        openFolder(path);
    }
}


// 🟢 Bring Window to Front (Fix Taskbar Delay)
export function bringWindowToFront(windowElement) {
    if (!windowElement) {
        console.error("❌ bringWindowToFront: Window element is null.");
        return;
    }

    highestZIndex++;
    windowElement.style.zIndex = highestZIndex;

    updateTaskbarStyling(); // Ensure Focus Updates Immediately
}


// 🟢 Make Windows Draggable
export function makeWindowDraggable(windowElement) {
    let header = windowElement.querySelector(".window-header") || windowElement.querySelector(".window-header-application");
    
    if (!header) {
        console.error("❌ makeWindowDraggable: No header found for window", windowElement.id);
        return;
    }

    let startX, startY, startLeft, startTop, isDragging = false;

    header.addEventListener("mousedown", (e) => {
        bringWindowToFront(windowElement); // 🔹 Ensure window moves to front on click

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


// // 🟢 Enable Resizing (Ensure Resizing Works)
// export function enableResizeHandles(windowElement) {
//     let resizeHandle = windowElement.querySelector(".resize-handle.bottom-right");
//     if (!resizeHandle) return;

//     let startX, startY, startWidth, startHeight, isResizing = false;

//     resizeHandle.addEventListener("mousedown", (e) => {
//         isResizing = true;
//         startX = e.clientX;
//         startY = e.clientY;
//         startWidth = windowElement.offsetWidth;
//         startHeight = windowElement.offsetHeight;

//         const onMouseMove = (e) => {
//             if (!isResizing) return;
//             windowElement.style.width = `${startWidth + (e.clientX - startX)}px`;
//             windowElement.style.height = `${startHeight + (e.clientY - startY)}px`;
//         };

//         const onMouseUp = () => {
//             isResizing = false;
//             document.removeEventListener("mousemove", onMouseMove);
//             document.removeEventListener("mouseup", onMouseUp);
//         };

//         document.addEventListener("mousemove", onMouseMove);
//         document.addEventListener("mouseup", onMouseUp);
//     });
// }

export function enableResizeHandles(windowElement) {
    windowElement.querySelectorAll('.resize-handle').forEach(handle => {
        handle.addEventListener('mousedown', (e) => {
            isResizing = true;
            currentHandle = e.target;
            targetWindow = handle.closest(".window");

            startX = e.clientX;
            startY = e.clientY;
            startWidth = parseInt(window.getComputedStyle(targetWindow).width, 10);
            startHeight = parseInt(window.getComputedStyle(targetWindow).height, 10);

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });

    const onMouseMove = (e) => {
        if (!isResizing || !targetWindow) return;

        const dx = e.clientX - startX;
        const dy = e.clientY - startY;

        if (currentHandle.classList.contains("right")) {
            targetWindow.style.width = `${startWidth + dx}px`;
        }
        if (currentHandle.classList.contains("bottom")) {
            targetWindow.style.height = `${startHeight + dy}px`;
        }
        if (currentHandle.classList.contains("bottom-right")) {
            targetWindow.style.width = `${startWidth + dx}px`;
            targetWindow.style.height = `${startHeight + dy}px`;
        }
    };

    const onMouseUp = () => {
        isResizing = false;
        currentHandle = null;
        targetWindow = null;

        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
    };
};

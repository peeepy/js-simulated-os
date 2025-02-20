import { updateTaskbarStyling, addWindowToTaskbar, closeWindow, minimizeWindow } from "./taskbarManager.js";
import {initialiseApplication} from "./appManager.js";

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
                        <i class="bi bi-chevron-left"></i>
                        <i class="bi bi-chevron-right"></i>
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
            <div class="window-sidebar-item"><p>My PC</p></div>
            <div class="window-sidebar-item"><p>Documents</p></div>
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
    
    makeWindowDraggable(windowDiv);
    enableResizeHandles(windowDiv);
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

let highestZIndex = 100;

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
            <div class="window-title"><p>${title}</p></div>
        </div>
        <div class="window-content">${content}</div>
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

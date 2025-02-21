import { initTerminal } from "./applications/terminal.js";
import { createWindow, bringWindowToFront, updateWindowTitle, pushNavigationHistory } from "./windowManager.js";

// File system simulation
const fileSystem = {
    "C:": {
        "Documents": {
            "note.txt": "This is a sample text file.",
        },
        "Program Files": {},
    },
    "D:": {
        "Games": {},
        "Media": {
            "music.mp3": "Sample music file",
        },
    },
};

let currentPath = ["C:"];

export const apps = {
    drives: {
        title: "Drives",
        icon: "assets/icons/desktop/drive.png",
        content: generateDrivesContent(),
        desktop: true,
        type: "document"
    },
    documents: {
        title: "Documents",
        icon: "assets/icons/desktop/folder_closed.png",
        content: generateFolderContent(["C:", "Documents"]),
        desktop: true,
        type: "document"
    },
    notepad: {
        title: "Notepad",
        icon: "assets/icons/desktop/notepad.png",
        content: `<textarea id="notepad" style="min-width: 100%; height: 500px; border: none; outline: none; font-size: 16px;"></textarea>`,
        desktop: false,
        type: "application"
    },
    terminal: {
        title: "Terminal",
        icon: "assets/icons/desktop/program.png",
        content: `<div id="terminal"></div>`,
        desktop: true,
        type: "application"
    },
};

export function generateDrivesContent() {
    console.log("🔍 Generating drives content");
    return `
        <div class="folders">
            ${Object.keys(fileSystem).map(drive => `
                <div class="folder" ondblclick="openFolder('${drive}')">
                    <div class="folder-icon"><img src="assets/icons/desktop/drive.png" /></div>
                    <div class="folder-name"><p>${drive}</p></div>
                </div>
            `).join('')}
        </div>
    `;
}

function generateFolderContent(path) {
    console.log("📂 Generating folder content for path:", path);
    let folder = fileSystem;
    for (const item of path) {
        folder = folder[item];
    }

    return `
        <div id="breadcrumb">${generateBreadcrumbs(path)}</div>
        <div class="folders">
            ${Object.keys(folder).map(item => {
                const isFolder = typeof folder[item] === 'object';
                return `
                    <div class="folder" ondblclick="${isFolder ? `openFolder('${[...path, item].join(',')}')` : `openFile('${[...path, item].join(',')}')` }">
                        <div class="folder-icon"><img src="assets/icons/desktop/${isFolder ? 'folder_closed.png' : 'file.png'}" /></div>
                        <div class="folder-name"><p>${item}</p></div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function generateBreadcrumbs(path) {
    console.log("🧭 Generating breadcrumbs for path:", path);
    return path.map((item, index) => `
        <a href="#" onclick="navigateTo('${path.slice(0, index + 1).join(',')}')">${item}</a>
        ${index < path.length - 1 ? ' > ' : ''}
    `).join('');
}

function renderDesktopIcons() {
    console.log("🖥️ Starting to render desktop icons");
    const desktop = document.querySelector(".desktop");
    if (!desktop) {
        console.error("❌ Desktop container not found!");
        return;
    }
    
    console.log("🧹 Clearing existing desktop icons");
    desktop.innerHTML = "";

    console.log("🔍 Apps to render:", Object.keys(apps));
    Object.keys(apps).forEach(appId => {
        const app = apps[appId];
        console.log(`📊 Processing app: ${appId}, desktop: ${app.desktop}`);
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

            folderDiv.addEventListener("dblclick", () => openApp(appId));

            desktop.appendChild(folderDiv);
        }
    });
    console.log("✅ Desktop icons rendered!");
}

export function initialiseApplication(appId) {
    const appContainer = document.getElementById(appId);
    if (!appContainer) {
        console.error(`❌ Application container for '${appId}' not found! Retrying...`);
        setTimeout(() => initialiseApplication(appId), 50);
        return;
    }

    if (appId === "terminal") {
        initTerminal();
    }
}

export function openApp(appId) {
    console.log("🚀 Opening app:", appId);
    const app = apps[appId];
    if (!app) {
        console.error(`❌ App '${appId}' not found.`);
        return;
    }

    let windowElement = document.getElementById(`window-${appId}`);

    if (!windowElement) {
        createWindow(appId, app.title, app.icon, app.content, app.type);
        windowElement = document.getElementById(`window-${appId}`);
    }

    if (windowElement) {
        bringWindowToFront(windowElement);
        setActiveWindow(windowElement); // Mark this window as active
    }
}

function setActiveWindow(windowElement) {
    document.querySelectorAll(".window").forEach(win => {
        win.classList.remove("active"); // Remove active from all windows
    });
    windowElement.classList.add("active"); // Set the clicked window as active
}


export function openFolder(path) {
    console.log("📂 Opening folder:", path);

    const pathArray = path.split(',');
    currentPath = pathArray; // Update global path

    // Find the active window based on the path
    const windowElement = document.querySelector('.window[data-path]');

    if (windowElement) {
        console.log("🔄 Updating existing window:", windowElement);
        
        // Update the dataset path
        windowElement.dataset.path = path;

        // Update content inside the window
        const contentElement = windowElement.querySelector('.window-content');
        if (contentElement) {
            contentElement.innerHTML = generateFolderContent(pathArray);
        }

        // Update window title immediately
        updateWindowTitle(windowElement, path);

        // Push navigation history (for chevrons)
        pushNavigationHistory(windowElement, path);
        
    } else {
        console.log("➕ No window found, opening a new one.");
        createWindow(path, pathArray[pathArray.length - 1], "assets/icons/desktop/folder_closed.png", generateFolderContent(pathArray), "document");
    }
}


function openFile(filePath) {
    console.log("🚀 Attempting to open file:", filePath, "in path:", currentPath);

    // Extract actual file name
    let pathArray = filePath.split(',');
    let fileName = pathArray.pop(); // Last element is the file name

    // Merge currentPath and pathArray to reconstruct the correct path
    let folder = fileSystem;
    let fullPath = [...currentPath.slice(0, -1), ...pathArray]; // Combine paths correctly

    console.log("📂 Reconstructed full path:", fullPath);

    for (const folderName of fullPath) {
        console.log(`📂 Navigating to: ${folderName}`);
        if (!folder[folderName]) {
            console.error(`❌ Folder does not exist: ${folderName}`);
            return;
        }
        folder = folder[folderName]; // Move deeper
    }

    console.log("📁 Final directory:", folder);

    if (!(fileName in folder)) {
        console.error(`❌ File not found: ${fileName}`);
        return;
    }

    let fileContent = folder[fileName];
    console.log("📄 File content retrieved:", fileContent);

    openApp("notepad");

    setTimeout(() => {
        let notepadWindow = document.getElementById("window-notepad");
        if (notepadWindow) {
            let textArea = notepadWindow.querySelector("#notepad");
            if (textArea) {
                textArea.value = fileContent;
            } else {
                console.error("❌ Notepad textarea not found.");
            }
        } else {
            console.error("❌ Notepad window not found.");
        }
    }, 100);
}


function navigateTo(path) {
    console.log("🔄 Navigating to:", path);
    
    const pathArray = path.split(',');  // Convert string back into array
    currentPath = pathArray;  // Update the current path
    
    // Generate new folder content
    const content = generateFolderContent(pathArray);

    // Find the **window that the breadcrumb belongs to**
    const windowElement = event.target.closest('.window');

    if (windowElement) {
        console.log("🔄 Updating correct window:", windowElement);
        windowElement.dataset.path = path; // Update window's path
        const contentElement = windowElement.querySelector('.window-content');
        if (contentElement) {
            contentElement.innerHTML = content; // Replace the content
        }
    } else {
        console.log("❌ No matching window found.");
    }
}




    window.openFolder = openFolder;
    window.openFile = openFile;
    window.navigateTo = navigateTo;

document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 DOMContentLoaded event fired");
    renderDesktopIcons();
    window.openFolder = openFolder;
    window.openFile = openFile;
    window.navigateTo = navigateTo;
    console.log("🏁 DOMContentLoaded setup complete");
});

console.log("✅ appManager.js loaded successfully!");

// Add this at the end of your appManager.js file
console.log("⏳ Setting up fallback for renderDesktopIcons");
setTimeout(() => {
    if (!document.querySelector(".desktop .folder")) {
        console.log("⚠️ Desktop icons not rendered, attempting fallback render");
        renderDesktopIcons();
    }
}, 1000);

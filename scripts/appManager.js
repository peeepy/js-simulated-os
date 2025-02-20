import { initTerminal } from "./applications/terminal";
import { createWindow, bringWindowToFront } from "./windowManager";
// import { updateTaskbarStyling, removeWindowFromTaskbar } from "./taskbarManager";

export const apps = {
    drives: {
        title: "Drives",
        icon: "assets/folder-mac.png",
        content: `
            <div class="folders">
                <div class="folder" ondblclick="openFolder('C Drive')">
                    <div class="folder-icon"><img src="assets/folder-mac.png" /></div>
                    <div class="folder-name"><p>C:</p></div>
                </div>
                <div class="folder" ondblclick="openFolder('D Drive')">
                    <div class="folder-icon"><img src="assets/folder-mac.png" /></div>
                    <div class="folder-name"><p>D:</p></div>
                </div>
            </div>
        `,
        desktop: true,
        type: "document"
    },
    documents: {
        title: "Documents",
        icon: "assets/folder-mac.png",
        content: "<p style='margin:auto'> This is the Documents window.</p>",
        desktop: true,
        type: "document"
    },
    notepad: {
        title: "Notepad",
        icon: "assets/notepad-icon.png",
        content: `<textarea id="notepad" style="width: 100%; height: 100%; border: none; outline: none; font-size: 16px;"></textarea>`,
        desktop: false,
        type: "application"
    },
    terminal: {
        title: "Terminal",
        icon: "assets/terminalicon-macos.png",
        content: `<div id="terminal"></div>`,
        desktop: true,
        type: "application"
    },
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
export function openApp(appId) {
    const app = apps[appId];
    if (!app) {
        console.error(`❌ App '${appId}' not found.`);
        return;
    }

    let windowElement = document.getElementById(`window-${appId}`);

    if (!windowElement) {
        // Check if it's an application or document
        if (app.type === "application") {
            createWindow(appId, app.title, app.icon, app.content, "application");
        } else {
            createWindow(appId, app.title, app.icon, app.content, "document");
        }
    } else {
        bringWindowToFront(windowElement);
    }
}

function openFolder(folderName) {
    let content = `
        <div class="folders">
            <div class="folder">
                <div class="folder-icon"><img src="assets/folder-mac.png" /></div>
                <div class="folder-name"><p>${folderName}</p></div>
            </div>
        </div>
    `;
    createWindow(folderName, folderName, "assets/folder-mac.png", content, "document");
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

    // Future applications can be added here:
    // if (appId === "anotherApp") { initializeAnotherApp(appContainer); }
}
    

// 🟢 Run Correctly on Page Load
document.addEventListener("DOMContentLoaded", renderDesktopIcons());




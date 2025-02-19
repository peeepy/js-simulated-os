const scripts = [
    "scripts/appManager.js",
    "scripts/windowManager.js",
    "scripts/taskbarManager.js",
    "scripts/startMenu.js",
    "scripts/resizeWindow.js",
    "scripts/dragWindows.js",
    "scripts/openExplorerSearch.js"
];

scripts.forEach(src => {
    let script = document.createElement("script");
    script.src = src;
    document.body.appendChild(script);
});

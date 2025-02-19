const startMenuButton = document.getElementById('start-menu-button');
const startMenu = document.getElementById('start-menu-container');

console.log("✅ main.js is loaded!");


// startMenuButton.addEventListener('click', () => {
//     if (startMenu.classList.contains('hidden')) {
//         startMenu.style.display = 'block';
//         startMenu.classList.remove('hidden');
//     } else {
//         startMenu.style.display = 'none';
//         startMenu.classList.add('hidden');
//     }
// });
window.addEventListener('click', (e) => {
    if (e.target !== startMenuButton && e.target !== startMenu) {
        startMenu.style.display = 'none';
        startMenu.classList.add('hidden');
    }
});

console.log(document.getElementById("desktop-container").offsetHeight);
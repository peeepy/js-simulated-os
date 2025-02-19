let isResizing = false;
let currentHandle = null;
let startX, startY, startWidth, startHeight, targetWindow;

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.resize-handle').forEach(handle => {
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

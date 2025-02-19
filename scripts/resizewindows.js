let isResizing = false;
let currentHandle = null;
let startX, startY, startWidth, startHeight;

const onMouseDown = (e) => {
    isResizing = true;
    currentHandle = e.target;
    startX = e.clientX;
    startY = e.clientY;
    startWidth = parseInt(document.defaultView.getComputedStyle(window1).width, 10);
    startHeight = parseInt(document.defaultView.getComputedStyle(window1).height, 10);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
}

const onMouseMove = (e) => {
    if (!isResizing) return;

    const dx = e.clientX - startX;
    const dy = e.clientY - startY;

    if (currentHandle.classList.contains("right")) {
        window1.style.width = `${startWidth + dx}px`;
    }
    if (currentHandle.classList.contains("bottom")) {
        window1.style.height = `${startHeight + dy}px`;
    }
    if (currentHandle.classList.contains("bottom-right")) {
        window1.style.width = `${startWidth + dx}px`;
        window1.style.height = `${startHeight + dy}px`;
    }

}

const onMouseUp = (e) => {
    isResizing = false;
    currentHandle = null;

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

document.querySelectorAll('.resize-handle').forEach(handle => {
    handle.addEventListener('mousedown', onMouseDown);
});



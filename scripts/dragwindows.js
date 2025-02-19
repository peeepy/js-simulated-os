document.addEventListener("DOMContentLoaded", () => {
    document.addEventListener("mousedown", (e) => {
        if (!e.target.closest(".window-header")) return;

        let windowElement = e.target.closest(".window");
        let startX = e.clientX;
        let startY = e.clientY;
        let startLeft = windowElement.offsetLeft;
        let startTop = windowElement.offsetTop;
        let isDragging = true;

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            let newLeft = startLeft + dx;
            let newTop = startTop + dy;

            // Prevent moving off-screen
            newLeft = Math.max(0, Math.min(window.innerWidth - windowElement.offsetWidth, newLeft));
            newTop = Math.max(0, Math.min(window.innerHeight - windowElement.offsetHeight, newTop));

            windowElement.style.left = `${newLeft}px`;
            windowElement.style.top = `${newTop}px`;
        };

        const onMouseUp = () => {
            isDragging = false;
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    });
});

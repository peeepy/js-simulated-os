document.addEventListener("DOMContentLoaded", () => {
    const windows = document.querySelectorAll(".window");

    windows.forEach((windowElement) => {
        const header = windowElement.querySelector(".window-header");

        let isDragging = false;
        let startX, startY, startLeft, startTop;

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
});

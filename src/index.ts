const drone = document.getElementById("drone") as HTMLElement;

let position = { x: window.innerWidth * 0.25, y: window.innerHeight * 0.25 };
let rotation = 0;

function updateDrone() {
    drone.style.transform = `
        translate(${position.x}px, ${position.y}px)
        rotate(${rotation}deg)
    `;
}

function move(xDelta: number, yDelta: number) {
    position.x += xDelta;
    position.y += yDelta;
    updateDrone();
}

function rotate(degrees: number) {
    rotation += degrees;
    updateDrone();
}

// Initialize position
updateDrone();

// Example controls
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            move(0, -10);
            break;
        case "ArrowDown":
            move(0, 10);
            break;
        case "ArrowLeft":
            move(-10, 0);
            break;
        case "ArrowRight":
            move(10, 0);
            break;
        case "q":
            rotate(-10);
            break;
        case "e":
            rotate(10);
            break;
    }
});

const cellSize = 50;
const canvas = document.getElementById("pixel-canvas")


function draw(state) {
    const context = canvas.getContext("2d");

    // context.fillStyle = "red";
    // context.fillRect(10, 10, 50, 50);
    context.strokeStyle = "black"
    context.lineWidth = 1;
    
    const image = state.image;
    const width = image.width();
    const height = image.height();

    const cells = image.cells();

    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const index = (y * width + x) * 3
            const color = `rgb(${cells[index + 0]}, ${cells[index + 1]}, ${cells[index + 2]})`;
            context.fillStyle = color;
            context.fillRect(x * cellSize, y * cellSize, cellSize, cellSize)
        }
    }

    for (let x = 0; x <= width; x++) {
        context.beginPath();
        context.moveTo(x * cellSize + 0.5, 0);
        context.lineTo(x * cellSize + 0.5, height * cellSize);
        context.stroke();
    }

    for (let y = 0; y <= height; y++) {
        context.beginPath();
        context.moveTo(0, y * cellSize + 0.5);
        context.lineTo(width * cellSize, y * cellSize + 0.5);
        context.stroke();
    }
    

}

function changeCanvas(event, state) {
    const rect = canvas.getBoundingClientRect();

    let x = event.clientX  - rect.left;
    let y = event.clientY - rect.top;

    x = Math.floor(x / cellSize);
    y = Math.floor(y / cellSize);

    if (x < 0 
        || y < 0 
        || x > state.image.width() - 1 
        || y > state.image.height() - 1) {
        return;
    }

    const image = state.image;
    image.brush(x, y, state.currentColor);
    draw(state);
}

function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
     ] : null;
  }

function setupCanvas(state) {

    canvas.addEventListener('click', event => {
        changeCanvas(event, state)
    });

    canvas.addEventListener("mousedown", event => {
        state.dragging = true;
    })
    canvas.addEventListener("mouseup", event => {
        state.dragging = false;
    })
    canvas.addEventListener('mousemove', event => {
        if(!state.dragging) {
            return;
        }
        changeCanvas(event, state)
    });

    const colorpicker = document.getElementById("color")
    colorpicker.addEventListener("change", (event) => {
        state.currentColor = hexToRgb(colorpicker.value)
    });

    document.getElementById("white").addEventListener("click", (event) =>{
        state.currentColor = [255, 255, 255]
    })

    document.getElementById("black").addEventListener("click", (event) =>{
        state.currentColor = [0, 0, 0]
    })
}

async function main() {
    const lib = await import("../pkg/index.js").catch(console.error);
    const image = new lib.Image(10, 10);

    const state = {
        image,
        currentColor: [0, 0, 0],
        dragging: false
    };

    setupCanvas(state);

    draw(state);
}

main();
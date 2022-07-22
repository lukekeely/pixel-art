const root = document.querySelector(':root');
const canvas = document.getElementById('canvas');
const CanvasSize = document.getElementById('CanvasSize');
const newCanvas = document.getElementById('newCanvas');
const ColorPicker = document.getElementById('penColor');
const BackgroundColor = document.getElementById('backgroundColor');
const BrushType = document.getElementById('BrushType');

root.style.setProperty('--gridSize', CanvasSize.value);
drawGrid(CanvasSize.value);

CanvasSize.addEventListener('input', () => showNewSize(CanvasSize.value));
CanvasSize.addEventListener('change', () => setNewSize(CanvasSize.value));

let drawingMode = 'modePen';
BrushType.addEventListener('click', (e) => {
  let clicked = e.target.closest('BUTTON');
  drawingMode = clicked.id;

  for (let i = 0; i < BrushType.children.length; i++)
    BrushType.children.item(i).classList.remove('btn-active');

  clicked.classList.add('btn-active');
});

let penColor = ColorPicker.value;
ColorPicker.addEventListener(
  'change',
  () => (penColor = ColorPicker.value)
);

BackgroundColor.addEventListener('input', () => {
  bgColorChange(BackgroundColor.value);
});

newCanvas.addEventListener('click', () => clearGrid(CanvasSize.value));

let isDrawing = false;
document.addEventListener('mousedown', (e) => {
  if (e.target.closest('.grid')) {
    isDrawing = true;
    drawOnCanvas(drawingMode, e.target.closest('.grid'));
  }

  document.addEventListener(
    'mouseleave',
    () => {
      isDrawing = false;
    },
    { once: true }
  );
});

document.addEventListener('mouseover', (e) => {
  if (e.target.closest('.grid') && isDrawing) {
    drawOnCanvas(drawingMode, e.target.closest('.grid'));
  }
});

document.addEventListener('mouseup', () => {
  isDrawing = false;
});


function showNewSize(size) {
  let sliderLabel = document.getElementById('sliderLabel');
  sliderLabel.textContent = `Size: ${size} x ${size}`;
}

function setNewSize(size) {
  if (size < 10 || size > 100) {
    alert(`Size is outside valid range, the page will be reloaded`);
    location.reload();
  }

  root.style.setProperty('--gridSize', size);
  drawGrid(size);
  clearGrid(size);
}

function drawGrid(size) {
  let newSize = size ** 2;
  let currentSize = canvas.children.length;

  while (newSize < currentSize) {
    canvas.removeChild(canvas.firstChild);
    currentSize--;
  }

  while (newSize > currentSize) {
    let gridPixel = document.createElement('div');
    gridPixel.classList.add('grid');
    canvas.appendChild(gridPixel);
    currentSize++;
  }
}

function clearGrid(size) {
  let newSize = size ** 2;
  for (let i = 0; i < newSize; i++) {
    let gridPixel = canvas.children.item(i);
    gridPixel.classList.remove('painted');
    gridPixel.style.backgroundColor = 'transparent';
  }
}

function bgColorChange(color) {
  canvas.style.backgroundColor = color;
}

function drawOnCanvas(mode, target) {
  if (mode === 'modePen') drawWithPen(target);
  else if (mode === 'modeEraser') drawEraser(target);
}

function drawWithPen(target) {
  if (target.style.backgroundColor !== penColor)
    target.style.backgroundColor = penColor;
}

function drawEraser(target) {
  target.style.backgroundColor = 'transparent';
}

// ===== MATRIX RAIN =====
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Ajustar tamaño inicial
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();

// Colores neón personalizables
let colors = ['#ff4d4d', '#4dff4d', '#4dd2ff', '#ffd24d', '#ff4de8', '#7d4dff'];

const fontSize = 20;
const maxParticles = 300;
let particles = [];

// Crear partículas
function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vy: 3 + Math.random() * 4,
    text: ["Te amo", "❤️", "Love", "Je t'aime", "愛してる"][Math.floor(Math.random() * 5)],
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: 0,
    vyExtra: 0
  };
}

// Inicializar partículas
for (let i = 0; i < maxParticles; i++) {
  particles.push(createParticle());
}

// Dibujar matrix
function drawMatrix() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = `${fontSize}px monospace`;

  particles.forEach(p => {
    ctx.fillStyle = p.color;
    ctx.fillText(p.text, p.x, p.y);

    p.y += p.vy;

    if (p.vx || p.vyExtra) {
      p.x += p.vx;
      p.y += p.vyExtra;
      p.vx *= 0.9;
      p.vyExtra *= 0.9;
    }

    if (p.y > canvas.height + 50) {
      Object.assign(p, createParticle());
      p.y = -20;
    }
  });
}

// Efecto al tocar
canvas.addEventListener("click", (e) => {
  const clickX = e.clientX;
  const clickY = e.clientY;

  particles.forEach(p => {
    const dx = p.x - clickX;
    const dy = p.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 150) {
      const force = (1 - dist / 150) * 8;
      const angle = Math.atan2(dy, dx);
      p.vx = Math.cos(angle) * force * 5;
      p.vyExtra = Math.sin(angle) * force * 5;
    }
  });
});

// Animación
setInterval(drawMatrix, 33);

// ===== CONTADOR DE DÍAS =====
const startDate = new Date("2024-06-07");
const counter = document.getElementById("counter");

function updateCounter() {
  const today = new Date();
  const days = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  counter.textContent = `❤️ Días juntos: ${days}`;
}
setInterval(updateCounter, 1000);
updateCounter();

// ===== FUNCIONALIDADES DE IMAGEN =====
let currentImage = null;
let isDragging = false;
let startX, startY, initialX, initialY;

// Elementos del DOM
const controlsPanel = document.getElementById("controls-panel");
const menuBtn = document.getElementById("menu-btn");
const imageContainer = document.getElementById("image-container");
const imageUpload = document.getElementById("image-upload");
const imagePreview = document.getElementById("image-preview");
const downloadBtn = document.getElementById("download-btn");
const sizeSlider = document.getElementById("size-slider");
const sizeValue = document.getElementById("size-value");
const colorPicker = document.getElementById("color-picker");
const neonEffectSelect = document.getElementById("neon-effect");
const frameSelect = document.getElementById("frame-select");
const frameEffect = document.getElementById("frame-effect");

// Toggle menú en móvil
menuBtn.addEventListener("click", () => {
  controlsPanel.classList.toggle("visible");
});

// Subir imagen
imageUpload.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      currentImage = new Image();
      currentImage.src = event.target.result;
      currentImage.onload = updateImageDisplay;
    };
    reader.readAsDataURL(file);
  }
});

// Actualizar imagen
function updateImageDisplay() {
  imagePreview.innerHTML = '';
  if (currentImage) {
    const img = document.createElement("img");
    img.src = currentImage.src;
    img.style.width = `${sizeSlider.value}%`;
    img.classList.add(`neon-${neonEffectSelect.value}`);
    imagePreview.appendChild(img);
    
    // Marco
    frameEffect.className = '';
    if (frameSelect.value !== 'none') {
      frameEffect.classList.add(`frame-${frameSelect.value}`);
    }
  }
}

// Controles
sizeSlider.addEventListener("input", () => {
  sizeValue.textContent = `${sizeSlider.value}%`;
  const img = imagePreview.querySelector("img");
  if (img) img.style.width = `${sizeSlider.value}%`;
});

colorPicker.addEventListener("input", () => {
  colors[0] = colorPicker.value;
});

neonEffectSelect.addEventListener("change", () => {
  const img = imagePreview.querySelector("img");
  if (img) {
    img.className = '';
    img.classList.add(`neon-${neonEffectSelect.value}`);
  }
});

frameSelect.addEventListener("change", updateImageDisplay);

// Mover imagen
imageContainer.addEventListener("mousedown", startDrag);
imageContainer.addEventListener("touchstart", startDrag, { passive: false });

function startDrag(e) {
  e.preventDefault();
  isDragging = true;
  const rect = imageContainer.getBoundingClientRect();
  initialX = rect.left;
  initialY = rect.top;
  startX = e.clientX || e.touches[0].clientX;
  startY = e.clientY || e.touches[0].clientY;
  
  // Para móvil: ocultar controles al arrastrar
  if (window.innerWidth < 768) {
    controlsPanel.classList.remove("visible");
  }
}

document.addEventListener("mousemove", drag);
document.addEventListener("touchmove", drag, { passive: false });

document.addEventListener("mouseup", endDrag);
document.addEventListener("touchend", endDrag);

function drag(e) {
  if (!isDragging) return;
  e.preventDefault();
  
  const x = (e.clientX || e.touches[0].clientX) - startX;
  const y = (e.clientY || e.touches[0].clientY) - startY;
  
  imageContainer.style.left = `${initialX + x}px`;
  imageContainer.style.top = `${initialY + y}px`;
}

function endDrag() {
  isDragging = false;
}

// Descargar imagen
downloadBtn.addEventListener("click", () => {
  if (!currentImage) {
    alert("¡Sube una foto primero!");
    return;
  }

  const tempCanvas = document.createElement("canvas");
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext("2d");
  
  // Dibujar fondo
  tempCtx.drawImage(canvas, 0, 0);
  
  // Dibujar marco e imagen
  const containerRect = imageContainer.getBoundingClientRect();
  tempCtx.save();
  
  // Marco
  if (frameSelect.value === 'polaroid') {
    tempCtx.fillStyle = 'white';
    tempCtx.fillRect(containerRect.left, containerRect.top, containerRect.width, containerRect.height);
    tempCtx.fillStyle = '#eee';
    tempCtx.fillRect(
      containerRect.left + containerRect.width * 0.1,
      containerRect.top + containerRect.height - 30,
      containerRect.width * 0.8,
      2
    );
  }
  
  // Imagen
  const img = imagePreview.querySelector("img");
  if (img) {
    tempCtx.filter = window.getComputedStyle(img).filter;
    tempCtx.drawImage(
      img,
      containerRect.left + (containerRect.width - img.offsetWidth) / 2,
      containerRect.top + (containerRect.height - img.offsetHeight) / 2,
      img.offsetWidth,
      img.offsetHeight
    );
  }
  
  tempCtx.restore();
  
  // Descargar
  tempCanvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "fondo-personalizado.png";
    a.click();
    URL.revokeObjectURL(url);
  }, "image/png");
});

// Posición inicial de la imagen
imageContainer.style.left = `${window.innerWidth / 2 - 125}px`;
imageContainer.style.top = `${window.innerHeight / 2 - 175}px`;

// Redimensionar
window.addEventListener("resize", resizeCanvas);
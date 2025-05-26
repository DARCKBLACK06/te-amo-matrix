const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Colores vivos tipo RGB neón 💖💚💙
const colors = ['#ff4d4d', '#4dff4d', '#4dd2ff', '#ffd24d', '#ff4de8', '#7d4dff', '#4dffff'];

const fontSize = 20;
const maxParticles = 400; // más partículas pa que caigan en friega
let particles = [];

function createParticle() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    vy: 3 + Math.random() * 4, // velocidad caída (ajústalo aquí si quieres más o menos)
    text: "Te amo❤️",
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: 0,
    vyExtra: 0
  };
}

// Generamos lluvia intensa
for (let i = 0; i < maxParticles; i++) {
  particles.push(createParticle());
}

function drawMatrix() {
  // ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // <<< ESTA LÍNEA ES EL EFECTO BORROSO (comentada pa que se vea limpio)
  ctx.clearRect(0, 0, canvas.width, canvas.height); // limpio total para que se vea nítido

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

    // Reinicio arriba si cae
    if (p.y > canvas.height + 50) {
      p.x = Math.random() * canvas.width;
      p.y = -20;
      p.color = colors[Math.floor(Math.random() * colors.length)];
    }
  });
}

// Efecto de dispersión 💥
canvas.addEventListener("click", (e) => {
  const clickX = e.clientX;
  const clickY = e.clientY;

  particles.forEach(p => {
    const dx = p.x - clickX;
    const dy = p.y - clickY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 200) {
      const force = (1 - dist / 200) * 6;
      const angle = Math.atan2(dy, dx);
      p.vx = Math.cos(angle) * force * 8;
      p.vyExtra = Math.sin(angle) * force * 8;
    }
  });
});

// 🕒 velocidad de dibujo
setInterval(drawMatrix, 33); // << aquí puedes cambiar el 33 por otro número para ajustar velocidad

// ❤️ Contador de días
const startDate = new Date("2024-06-07");
const counter = document.getElementById("counter");

function updateCounter() {
  const today = new Date();
  const timeDiff = today - startDate;
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  counter.innerHTML = `❤️ Días juntos: ${days}`;
}

setInterval(updateCounter, 1000);
updateCounter();

// Responsive
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Nuevo código para manejar la imagen
const imageContainer = document.getElementById('image-container');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const downloadBtn = document.getElementById('download-btn');

imageUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      const img = new Image();
      img.src = event.target.result;
      imagePreview.innerHTML = '';
      imagePreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

downloadBtn.addEventListener('click', function() {
  // Creamos un canvas temporal que combine todo
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width;
  tempCanvas.height = canvas.height;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Dibujamos el fondo de matrix
  tempCtx.drawImage(canvas, 0, 0);
  
  // Dibujamos la imagen si existe
  const img = imagePreview.querySelector('img');
  if (img) {
    const containerRect = imageContainer.getBoundingClientRect();
    const imgWidth = img.naturalWidth;
    const imgHeight = img.naturalHeight;
    const ratio = Math.min(
      imagePreview.offsetWidth / imgWidth,
      imagePreview.offsetHeight / imgHeight
    );
    
    const drawWidth = imgWidth * ratio;
    const drawHeight = imgHeight * ratio;
    const x = containerRect.left + (imagePreview.offsetWidth - drawWidth) / 2;
    const y = containerRect.top + (imagePreview.offsetHeight - drawHeight) / 2;
    
    tempCtx.drawImage(
      img,
      x, y, drawWidth, drawHeight
    );
  }
  
  // Convertimos a imagen y descargamos
  const dataURL = tempCanvas.toDataURL('image/png');
  const link = document.createElement('a');
  link.download = 'te-amo-con-fondo.png';
  link.href = dataURL;
  link.click();
});

// Asegurar que el contenedor de imagen permanezca centrado al redimensionar
window.addEventListener('resize', function() {
  const containerRect = imageContainer.getBoundingClientRect();
  imageContainer.style.left = '50%';
  imageContainer.style.top = '50%';
});

// matrix.js (nuevas funcionalidades al final)

// ... (tu código existente permanece igual hasta el final) ...

// ===== NUEVAS FUNCIONALIDADES MEJORADAS =====

// Variables globales para los controles
let currentImage = null;
let isDragging = false;
let dragOffsetX = 0;
let dragOffsetY = 0;
let currentSize = 100;
let currentColor = '#ff4d4d';
let currentNeonEffect = 'medium';
let currentFrame = 'none';

// Elementos del DOM
const controlsPanel = document.getElementById('controls-panel');
const imageContainer = document.getElementById('image-container');
const imageUpload = document.getElementById('image-upload');
const imagePreview = document.getElementById('image-preview');
const downloadBtn = document.getElementById('download-btn');
const sizeSlider = document.getElementById('size-slider');
const sizeValue = document.getElementById('size-value');
const colorPicker = document.getElementById('color-picker');
const neonEffectSelect = document.getElementById('neon-effect');
const frameSelect = document.getElementById('frame-select');
const frameEffect = document.getElementById('frame-effect');

// Cargar imagen
imageUpload.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      currentImage = new Image();
      currentImage.src = event.target.result;
      currentImage.onload = function() {
        updateImageDisplay();
      };
    };
    reader.readAsDataURL(file);
  }
});

// Actualizar visualización de la imagen
function updateImageDisplay() {
  imagePreview.innerHTML = '';
  
  if (currentImage) {
    const img = currentImage.cloneNode();
    img.style.width = `${currentSize}%`;
    img.style.filter = getNeonFilter();
    imagePreview.appendChild(img);
    
    // Aplicar marco
    frameEffect.className = '';
    if (currentFrame !== 'none') {
      frameEffect.classList.add(`frame-${currentFrame}`);
    }
  }
}

// Obtener filtro neón según selección
function getNeonFilter() {
  switch(currentNeonEffect) {
    case 'soft': return `drop-shadow(0 0 5px ${currentColor})`;
    case 'medium': return `drop-shadow(0 0 10px ${currentColor}) brightness(1.1)`;
    case 'strong': return `drop-shadow(0 0 15px ${currentColor}) brightness(1.2) contrast(1.1)`;
    default: return 'none';
  }
}

// Slider de tamaño
sizeSlider.addEventListener('input', function() {
  currentSize = this.value;
  sizeValue.textContent = `${currentSize}%`;
  updateImageDisplay();
});

// Selector de color
colorPicker.addEventListener('input', function() {
  currentColor = this.value;
  updateImageDisplay();
});

// Selector de efecto neón
neonEffectSelect.addEventListener('change', function() {
  currentNeonEffect = this.value;
  updateImageDisplay();
});

// Selector de marco
frameSelect.addEventListener('change', function() {
  currentFrame = this.value;
  updateImageDisplay();
});

// Hacer la imagen arrastrable
imageContainer.addEventListener('mousedown', startDrag);
imageContainer.addEventListener('touchstart', startDrag);

function startDrag(e) {
  if (!currentImage) return;
  
  isDragging = true;
  const rect = imageContainer.getBoundingClientRect();
  
  if (e.type === 'mousedown') {
    dragOffsetX = e.clientX - rect.left;
    dragOffsetY = e.clientY - rect.top;
  } else {
    dragOffsetX = e.touches[0].clientX - rect.left;
    dragOffsetY = e.touches[0].clientY - rect.top;
  }
  
  e.preventDefault();
}

document.addEventListener('mousemove', dragImage);
document.addEventListener('touchmove', dragImage);

document.addEventListener('mouseup', endDrag);
document.addEventListener('touchend', endDrag);

function dragImage(e) {
  if (!isDragging) return;
  
  let clientX, clientY;
  if (e.type === 'mousemove') {
    clientX = e.clientX;
    clientY = e.clientY;
  } else {
    clientX = e.touches[0].clientX;
    clientY = e.touches[0].clientY;
  }
  
  imageContainer.style.left = `${clientX - dragOffsetX}px`;
  imageContainer.style.top = `${clientY - dragOffsetY}px`;
  imageContainer.style.transform = 'none';
}

function endDrag() {
  isDragging = false;
}

// Descargar imagen compuesta
downloadBtn.addEventListener('click', function() {
  // Crear canvas temporal con mayor resolución
  const scale = 2; // Aumentamos la resolución
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = canvas.width * scale;
  tempCanvas.height = canvas.height * scale;
  const tempCtx = tempCanvas.getContext('2d');
  
  // Dibujar el fondo de matrix (escalado)
  tempCtx.scale(scale, scale);
  tempCtx.drawImage(canvas, 0, 0);
  tempCtx.setTransform(1, 0, 0, 1, 0, 0);
  
  // Dibujar la imagen si existe
  if (currentImage) {
    const containerRect = imageContainer.getBoundingClientRect();
    const img = imagePreview.querySelector('img');
    
    if (img) {
      // Calcular posición y tamaño escalados
      const x = containerRect.left * scale;
      const y = containerRect.top * scale;
      const width = containerRect.width * scale;
      const height = containerRect.height * scale;
      
      // Dibujar marco primero si existe
      if (currentFrame !== 'none') {
        tempCtx.save();
        
        if (currentFrame === 'polaroid') {
          // Marco polaroid especial
          tempCtx.fillStyle = 'white';
          tempCtx.fillRect(x, y, width, height);
          
          // Sombra
          tempCtx.shadowColor = 'rgba(0,0,0,0.3)';
          tempCtx.shadowBlur = 10 * scale;
          tempCtx.shadowOffsetY = 5 * scale;
          
          // Línea inferior
          tempCtx.fillStyle = '#ccc';
          tempCtx.fillRect(
            x + width * 0.1, 
            y + height - 30 * scale, 
            width * 0.8, 
            2 * scale
          );
        } else {
          // Otros marcos (patrones SVG)
          const patternCanvas = document.createElement('canvas');
          patternCanvas.width = 50 * scale;
          patternCanvas.height = 50 * scale;
          const patternCtx = patternCanvas.getContext('2d');
          
          if (currentFrame === 'heart') {
            // Patrón de corazones
            patternCtx.fillStyle = 'rgba(255,77,77,0.3)';
            patternCtx.beginPath();
            patternCtx.moveTo(25 * scale, 35 * scale);
            patternCtx.bezierCurveTo(
              25 * scale, 25 * scale,
              15 * scale, 15 * scale,
              25 * scale, 15 * scale
            );
            patternCtx.bezierCurveTo(
              35 * scale, 15 * scale,
              35 * scale, 25 * scale,
              35 * scale, 35 * scale
            );
            patternCtx.lineTo(25 * scale, 45 * scale);
            patternCtx.closePath();
            patternCtx.fill();
          } else if (currentFrame === 'sparkle') {
            // Patrón de estrellas
            patternCtx.fillStyle = 'rgba(255,215,0,0.3)';
            patternCtx.beginPath();
            patternCtx.moveTo(25 * scale, 10 * scale);
            patternCtx.lineTo(30 * scale, 20 * scale);
            patternCtx.lineTo(40 * scale, 25 * scale);
            patternCtx.lineTo(30 * scale, 30 * scale);
            patternCtx.lineTo(25 * scale, 40 * scale);
            patternCtx.lineTo(20 * scale, 30 * scale);
            patternCtx.lineTo(10 * scale, 25 * scale);
            patternCtx.lineTo(20 * scale, 20 * scale);
            patternCtx.closePath();
            patternCtx.fill();
          }
          
          const pattern = tempCtx.createPattern(patternCanvas, 'repeat');
          tempCtx.fillStyle = pattern;
          tempCtx.fillRect(x, y, width, height);
        }
        
        tempCtx.restore();
      }
      
      // Dibujar la imagen
      tempCtx.save();
      
      // Aplicar efectos neón
      if (currentNeonEffect !== 'none') {
        tempCtx.filter = getNeonFilter();
      }
      
      // Calcular tamaño y posición de la imagen dentro del contenedor
      const imgRatio = currentImage.naturalWidth / currentImage.naturalHeight;
      const containerRatio = width / height;
      
      let drawWidth, drawHeight, drawX, drawY;
      
      if (imgRatio > containerRatio) {
        // Imagen más ancha que el contenedor
        drawWidth = width * (currentSize / 100);
        drawHeight = drawWidth / imgRatio;
        drawX = x + (width - drawWidth) / 2;
        drawY = y + (height - drawHeight) / 2;
      } else {
        // Imagen más alta que el contenedor
        drawHeight = height * (currentSize / 100);
        drawWidth = drawHeight * imgRatio;
        drawX = x + (width - drawWidth) / 2;
        drawY = y + (height - drawHeight) / 2;
      }
      
      // Dibujar la imagen
      tempCtx.drawImage(
        currentImage,
        drawX, drawY, drawWidth, drawHeight
      );
      
      tempCtx.restore();
    }
  }
  
  // Convertir a imagen y descargar
  tempCanvas.toBlob(function(blob) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'te-amo-personalizado.png';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, 'image/png', 1.0);
});

// Actualizar colores de las partículas cuando cambia el selector de color
colorPicker.addEventListener('input', function() {
  // Actualiza el primer color del array para que coincida con el seleccionado
  colors[0] = this.value;
});

// Inicialización
updateImageDisplay();
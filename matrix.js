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
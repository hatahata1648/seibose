const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlayCanvas = document.getElementById('overlay-canvas');
const overlayImage = document.getElementById('overlay-image');
const captureBtn = document.getElementById('capture-btn');
const previewContainer = document.getElementById('preview-container');
const capturedImage = document.getElementById('captured-image');
const closeBtn = document.getElementById('close-btn');
const downloadLink = document.getElementById('download-link');
const imageInput = document.getElementById('image-input');
const shutterSound = document.getElementById('shutter-sound');

// カメラの初期化
const constraints = {
  video: {
    facingMode: 'environment'
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    video.play();
  })
  .catch(err => console.error(err));

// オーバーレイ画像の外側を白背景に描画
function drawOverlayBackground() {
  const ctx = overlayCanvas.getContext('2d');
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, overlayCanvas.width, overlayCanvas.height);

  if (overlayImage.src) {
    const imageRatio = overlayImage.naturalWidth / overlayImage.naturalHeight;
    const canvasRatio = overlayCanvas.width / overlayCanvas.height;

    let imageWidth, imageHeight;
    if (imageRatio > canvasRatio) {
      imageWidth = overlayCanvas.width;
      imageHeight = overlayCanvas.width / imageRatio;
    } else {
      imageHeight = overlayCanvas.height;
      imageWidth = overlayCanvas.height * imageRatio;
    }

    const x = (overlayCanvas.width - imageWidth) / 2;
    const y = (overlayCanvas.height - imageHeight) / 2;

    ctx.clearRect(x, y, imageWidth, imageHeight);
    ctx.drawImage(overlayImage, x, y, imageWidth, imageHeight);
  }
}

// 写真の撮影と保存
captureBtn.addEventListener('click', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (overlayImage.src) {
    ctx.drawImage(overlayCanvas, 0, 0, canvas.width, canvas.height);
  }

  const dataURL = canvas.toDataURL('image/png');
  capturedImage.src = dataURL;
  previewContainer.style.display = 'flex';
  downloadLink.href = dataURL;
  downloadLink.style.display = 'block';

  shutterSound.play();
  const previewOverlay = document.getElementById('preview-overlay');
  previewOverlay.style.animation = 'none';
  requestAnimationFrame(() => {
    previewOverlay.style.animation = null;
  });
  requestAnimationFrame(() => {
    previewOverlay.style.animation = 'flash 0.5s ease-out';
  });
});

// プレビューを閉じる
closeBtn.addEventListener('click', () => {
  previewContainer.style.display = 'none';
});

// 画像のオーバーレイ
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    overlayImage.src = reader.result;
    drawOverlayBackground();
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});

// ウィンドウサイズ変更時にオーバーレイ背景を更新
window.addEventListener('resize', drawOverlayBackground);

// 初期化
drawOverlayBackground();
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlayImage = document.getElementById('overlay-image');
const captureBtn = document.getElementById('capture-btn');
const previewContainer = document.getElementById('preview-container');
const capturedImage = document.getElementById('captured-image');
const closeBtn = document.getElementById('close-btn');
const downloadLink = document.getElementById('download-link');
const imageInput = document.getElementById('image-input');
const shutterSound = document.getElementById('shutter-sound');

let overlayScale = 1;
let overlayStartDistance = 0;

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

// 写真の撮影と保存
captureBtn.addEventListener('click', () => {
  const videoRatio = video.videoWidth / video.videoHeight;
  const canvasWidth = video.videoWidth;
  const canvasHeight = canvasWidth / videoRatio;
  canvas.width = canvasWidth;
  canvas.height = canvasHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvasWidth, canvasHeight);
  if (overlayImage.src) {
    ctx.drawImage(overlayImage, 0, 0, canvasWidth * overlayScale, canvasHeight * overlayScale);
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
    overlayImage.style.transform = 'scale(1)';
    overlayScale = 1;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
});

// ピンチ操作のイベントリスナー
overlayImage.addEventListener('touchstart', handleTouchStart, false);
overlayImage.addEventListener('touchmove', handleTouchMove, false);

// ピンチ操作の開始
function handleTouchStart(event) {
  if (event.touches.length === 2) {
    event.preventDefault();
    overlayStartDistance = getDistance(event.touches[0], event.touches[1]);
  }
}

// ピンチ操作の移動
function handleTouchMove(event) {
  if (event.touches.length === 2) {
    event.preventDefault();
    const distance = getDistance(event.touches[0], event.touches[1]);
    const scale = distance / overlayStartDistance;
    overlayScale *= scale;
    overlayImage.style.transform = `scale(${overlayScale})`;
    overlayStartDistance = distance;
  }
}

// 2点間の距離を計算
function getDistance(touch1, touch2) {
  const x = touch1.clientX - touch2.clientX;
  const y = touch1.clientY - touch2.clientY;
  return Math.sqrt(x * x + y * y);
}

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
let overlayX = 0;
let overlayY = 0;
let isDragging = false;
let startX, startY;

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
    ctx.drawImage(overlayImage, overlayX, overlayY, canvasWidth * overlayScale, canvasHeight * overlayScale);
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
    overlayX = 0;
    overlayY = 0;
  };
  if (file) {
    reader.readAsDataURL(file);
  }
});

// ピンチ操作のイベントリスナー
overlayImage.addEventListener('touchstart', handleTouchStart, false);
overlayImage.addEventListener('touchmove', handleTouchMove, false);
overlayImage.addEventListener('touchend', handleTouchEnd, false);

// ドラッグ操作のイベントリスナー
overlayImage.addEventListener('mousedown', handleMouseDown, false);
overlayImage.addEventListener('mousemove', handleMouseMove, false);
overlayImage.addEventListener('mouseup', handleMouseUp, false);
overlayImage.addEventListener('mouseleave', handleMouseLeave, false);

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
    overlayImage.style.transform = `translate(${overlayX}px, ${overlayY}px) scale(${overlayScale})`;
    overlayStartDistance = distance;
  }
}

// ピンチ操作の終了
function handleTouchEnd(event) {
  if (event.touches.length === 0) {
    overlayStartDistance = 0;
  }
}

// ドラッグ操作の開始
function handleMouseDown(event) {
  isDragging = true;
  startX = event.clientX - overlayX;
  startY = event.clientY - overlayY;
}

// ドラッグ操作の移動
function handleMouseMove(event) {
  if (isDragging) {
    overlayX = event.clientX - startX;
    overlayY = event.clientY - startY;
    overlayImage.style.transform = `translate(${overlayX}px, ${overlayY}px) scale(${overlayScale})`;
  }
}

// ドラッグ操作の終了
function handleMouseUp(event) {
  isDragging = false;
}

// ドラッグ操作の終了（マウスがオーバーレイ画像の外に出た場合）
function handleMouseLeave(event) {
  isDragging = false;
}

// 2点間の距離を計算
function getDistance(touch1, touch2) {
  const x = touch1.clientX - touch2.clientX;
  const y = touch1.clientY - touch2.clientY;
  return Math.sqrt(x * x + y * y);
}

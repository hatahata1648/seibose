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
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  if (overlayImage.src) {
    ctx.drawImage(overlayImage, 0, 0, canvas.width, canvas.height);
  }

  const dataURL = canvas.toDataURL('image/png');
  capturedImage.src = dataURL;
  previewContainer.style.display = 'flex'; // プレビューコンテナを表示

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
  previewContainer.style.display = 'none'; // プレビューコンテナを非表示
});

// 画像のオーバーレイ
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    overlayImage.src = reader.result;
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const overlayImage = document.getElementById('overlay-image');
const captureBtn = document.getElementById('capture-btn');
const downloadLink = document.getElementById('download-link');
const imageInput = document.getElementById('image-input');

// カメラの初期化
const constraints = {
  video: {
    facingMode: 'environment' // 外部カメラを使用
  }
};

navigator.mediaDevices.getUserMedia(constraints)
  .then(stream => {
    video.srcObject = stream;
    video.play();
    captureBtn.disabled = false;
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
  downloadLink.href = dataURL;
  downloadLink.style.display = 'block';
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
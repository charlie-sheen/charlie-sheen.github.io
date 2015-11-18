const canvas = document.querySelector('.output-canvas');
const hiddenCanvas = document.querySelector('.hidden-canvas');
const button = document.querySelector('.real-btn');
const fakeButton = document.querySelector('.upload-btn');
const downloadLink = document.querySelector('.download');

const ctx = canvas.getContext('2d');
const hiddenCtx = hiddenCanvas.getContext('2d');

const overlayImg = new Image();

function drawImageScaled(img, thisCtx) {
  const thisCanvas = thisCtx.canvas;
  const hRatio = thisCanvas.width / img.width;
  const vRatio = thisCanvas.height / img.height;
  const ratio = Math.max(hRatio, vRatio);
  const centerShift_x = (thisCanvas.width - img.width * ratio) / 2;
  const centerShift_y = (thisCanvas.height - img.height * ratio) / 2; 

  thisCtx.clearRect(0, 0, thisCanvas.width, thisCanvas.height);
  thisCtx.drawImage(
    img, 
    0,
    0, 
    img.width, 
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio, 
    img.height * ratio
  );  
}

function loadImage(img) {
  return new Promise((resolve, reject) => {
    img.onload = () => {
      return resolve(img);
    };

    img.onerror = (err) => {
      return reject(err);
    };
  });
}

fakeButton.onclick = () => {
  button.click();
};

button.onchange = () => {
  if (typeof window.FileReader !== 'function' || !button.files) {
    window.alert("Sorry. Your browser is old and/or terrible");
    return;
  } else if (!button.files[0]) {
    window.alert("Please select a file before clicking 'Load'");
  }
  else {
    let file = button.files[0];
    let fr = new FileReader();

    Promise.all([
      loadImage(overlayImg),
      loadImage(fr)
    ]).then(imgArr => {
      let overlay = imgArr[0];
      let main = imgArr[1].result;
      let overlayData = '';
      let newOverlayImg;
      let mainImg;

      mainImg = new Image();
      newOverlayImg = new Image();
      mainImg.src = main;

      mainImg.onload = () => {
        canvas.height = mainImg.height;
        canvas.width = mainImg.width;
        hiddenCanvas.height = canvas.height;
        hiddenCanvas.width = canvas.width;

        hiddenCtx.globalAlpha = 0.4;
        drawImageScaled(overlay, hiddenCtx);
        hiddenCtx.globalAlpha = 1.0;

        overlayData = hiddenCanvas.toDataURL();

        ctx.drawImage(mainImg, 0, 0);

        newOverlayImg.onload = () => {
          ctx.drawImage(newOverlayImg, 0, 0);

          downloadLink.href = canvas.toDataURL('image/jpeg');
          downloadLink.className = 'download';
        };

        newOverlayImg.src = overlayData;
      };
    }); 

    fr.readAsDataURL(file);

    overlayImg.crossOrigin = 'Anonymous';
    overlayImg.src = '../img/sheen.jpg';
  }
};
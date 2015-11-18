(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var canvas = document.querySelector('.output-canvas');
var hiddenCanvas = document.querySelector('.hidden-canvas');
var button = document.querySelector('.real-btn');
var fakeButton = document.querySelector('.upload-btn');
var downloadLink = document.querySelector('.download');

var ctx = canvas.getContext('2d');
var hiddenCtx = hiddenCanvas.getContext('2d');

var overlayImg = new Image();

function drawImageScaled(img, thisCtx) {
  var thisCanvas = thisCtx.canvas;
  var hRatio = thisCanvas.width / img.width;
  var vRatio = thisCanvas.height / img.height;
  var ratio = Math.max(hRatio, vRatio);
  var centerShift_x = (thisCanvas.width - img.width * ratio) / 2;
  var centerShift_y = (thisCanvas.height - img.height * ratio) / 2;

  thisCtx.clearRect(0, 0, thisCanvas.width, thisCanvas.height);
  thisCtx.drawImage(img, 0, 0, img.width, img.height, centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
}

function loadImage(img) {
  return new Promise(function (resolve, reject) {
    img.onload = function () {
      return resolve(img);
    };

    img.onerror = function (err) {
      return reject(err);
    };
  });
}

fakeButton.onclick = function () {
  button.click();
};

button.onchange = function () {
  if (typeof window.FileReader !== 'function' || !button.files) {
    window.alert("Sorry. Your browser is old and/or terrible");
    return;
  } else if (!button.files[0]) {
    window.alert("Please select a file before clicking 'Load'");
  } else {
    var file = button.files[0];
    var fr = new FileReader();

    Promise.all([loadImage(overlayImg), loadImage(fr)]).then(function (imgArr) {
      var overlay = imgArr[0];
      var main = imgArr[1].result;
      var overlayData = '';
      var newOverlayImg = undefined;
      var mainImg = undefined;

      mainImg = new Image();
      newOverlayImg = new Image();
      mainImg.src = main;

      mainImg.onload = function () {
        canvas.height = mainImg.height;
        canvas.width = mainImg.width;
        hiddenCanvas.height = canvas.height;
        hiddenCanvas.width = canvas.width;

        hiddenCtx.globalAlpha = 0.4;
        drawImageScaled(overlay, hiddenCtx);
        hiddenCtx.globalAlpha = 1.0;

        overlayData = hiddenCanvas.toDataURL();

        ctx.drawImage(mainImg, 0, 0);

        newOverlayImg.onload = function () {
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

},{}]},{},[1])


//# sourceMappingURL=index.js.map

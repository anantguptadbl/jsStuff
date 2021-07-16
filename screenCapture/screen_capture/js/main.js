/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
var video = null;
var canvas = null;
var photo = null;
var startbutton = null;
var width = 320;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream
var streaming = false;

// Polyfill in Firefox.
// See https://blog.mozilla.org/webrtc/getdisplaymedia-now-available-in-adapter-js/
if (adapter.browserDetails.browser == 'firefox') {
  adapter.browserShim.shimGetDisplayMedia(window, 'screen');
}

function handleSuccess(stream) {
  startButton.disabled = true;
  video = document.querySelector('video');
  canvas = document.getElementById('canvas');
  photo = document.getElementById('photo');
  capturebutton = document.getElementById('captureButton');
  video.srcObject = stream;

  // demonstrates how to detect that the user has stopped
  // sharing the screen via the browser UI.
  let track = stream.getVideoTracks()[0];
  //imageCapture = new ImageCapture(track);
  // Capture the image
  //imageCapture.takePhoto().then(function(blob) {
  //  console.log('Took photo:', blob);
  //  //img.classList.remove('hidden');
  //  //img.src = URL.createObjectURL(blob);
  //}).catch(function(error) {
  //  console.log('takePhoto() error: ', error);
  //});

  track.addEventListener('ended', () => {
    errorMsg('The user has ended sharing the screen');
    startButton.disabled = false;
  });

  
  video.addEventListener('canplay', function(ev){
      if (!streaming) {
        height = video.videoHeight / (video.videoWidth/width);
      
        // Firefox currently has a bug where the height can't be read from
        // the video, so we will make assumptions if this happens.
      
        if (isNaN(height)) {
          height = width / (4/3);
        }
      
        video.setAttribute('width', width);
        video.setAttribute('height', height);
        canvas.setAttribute('width', width);
        canvas.setAttribute('height', height);
        streaming = true;
      }
    }, false);

  capturebutton.addEventListener('click', function(ev){
      takepicture();
      ev.preventDefault();
    }, false);

    
}

function clearphoto() {
  var context = canvas.getContext('2d');
  context.fillStyle = "#AAA";
  context.fillRect(0, 0, canvas.width, canvas.height);

  var data = canvas.toDataURL('image/png');
  photo.setAttribute('src', data);
}

function takepicture() {
    var context = canvas.getContext('2d');
    if (width && height) {
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);
    
      //var data = canvas.toDataURL('image/png');
      var image_data = context.getImageData(0, 0, width, height).data;
      console.log("Width is " + width);
      console.log("Height is " + height);
      console.log(image_data);
      
      //photo.setAttribute('src', data);
    } else {
      //clearphoto();
    }
  }

function handleError(error) {
  errorMsg(`getDisplayMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

startButton = document.getElementById('startButton');



startButton.addEventListener('click', () => {
  navigator.mediaDevices.getDisplayMedia({video: true})
      .then(handleSuccess, handleError);
});

if ((navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices)) {
  startButton.disabled = false;
} else {
  errorMsg('getDisplayMedia is not supported');
}


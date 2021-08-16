// initialize vars
var videoOne = document.getElementById('one');
var videoTwo = document.getElementById('two');
var connectButton = document.getElementById('connect');
var videoStream;
var peerConnOne;
var peerConnTwo;
var offerOptions = { offerToReceiveAudio: 1, offerToReceiveVideo: 1};

//set up click handler
connectButton.onclick = startConnection;

//get video for peer one
navigator.getUserMedia = navigator.webkitGetUserMedia;
navigator.getUserMedia({video: true}, videoOneSource, function(){ console.log("No stream")});

//supporting functions
function videoOneSource(stream) {
  videoStream = stream;
  videoOne.src = window.URL.createObjectURL(stream);
}

function startConnection() {
  var servers = null;

  peerConnOne = new RTCPeerConnection(servers);
  peerConnOne.onicecandidate = function(e) { onIceCandidate(peerConnOne, e);};

  peerConnTwo = new RTCPeerConnection(servers);
  peerConnTwo.onicecandidate = function(e) { onIceCandidate(peerConnTwo, e);};

  peerConnTwo.onaddstream = function (data) { videoTwo.srcObject = data.stream; }

  peerConnOne.addStream(videoStream);

  peerConnOne.createOffer(offerOptions)
    .then(onCreateOfferSuccess);
}

function onIceCandidate(pc, event) {
  var peer = (pc === peerConnOne) ? peerConnTwo : peerConnOne;
  if (event.candidate) {
    peer.addIceCandidate(new RTCIceCandidate(event.candidate));
  }
}

function onCreateOfferSuccess(desc) {
  peerConnOne.setLocalDescription(desc);
  peerConnTwo.setRemoteDescription(desc);
  peerConnTwo.createAnswer()
    .then(onCreateAnswerSuccess);
}

function onCreateAnswerSuccess(desc) {
  peerConnTwo.setLocalDescription(desc);
  peerConnOne.setRemoteDescription(desc);
}